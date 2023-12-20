<template>
    <div class="horse-home-wrapper">
        <!-- <PvxSearch :items="searchProps" :initValue="initValue" @search="searchEvent($event)"></PvxSearch> -->
        <div class="m-horse-content" ref="listRef" v-loading="loading">
            <!-- 全部模式 -->
            <template v-if="active === ''">
                <!-- 抓马播报 -->
                <HorseBroadcast v-if="client === 'std'"></HorseBroadcast>
                <!-- 普通坐骑、奇趣坐骑、马具 -->
                <div v-for="(item, i) in list" :key="i" class="m-list-wrapper">
                    <template v-if="item.list.length">
                        <div class="u-type">
                            <div class="u-title">
                                {{ item.name }}
                            </div>
                            <div class="u-all" @click="clickTabs(item.type)">查看全部</div>
                        </div>

                        <CommonList :data="{ ...itemData, type: item.type }" @update:load="handleLoad">
                            <div class="m-common-list">
                                <template v-if="item.type !== 2">
                                    <HorseCard
                                        :style="!isPhone ? `width: calc(100% / ${count} - 20px)` : ''"
                                        v-for="item in item.list"
                                        :key="item.ID"
                                        :item="item"
                                        :reporter="{ aggregate: listId(item.list) }"
                                    />
                                </template>
                                <template v-else>
                                    <SameItem
                                        :style="!isPhone ? `width: calc(100% / ${count} - 20px)` : ''"
                                        v-for="item in item.list"
                                        :key="item.ID"
                                        :item="item"
                                        :reporter="{ aggregate: listId(item.list) }"
                                    />
                                </template>
                            </div>
                        </CommonList>
                    </template>
                </div>
            </template>
            <!-- 列表模式 -->
            <!-- <div v-else class="list-item-wrapper">
                <div v-if="list.length" class="title-header">
                    <div class="title">
                        {{
                            types.find((item) => item.type === this.selected)
                                ? types.find((item) => item.type === this.selected).name
                                : "全部"
                        }}
                    </div>
                    <div v-if="showSwitch" class="operate-wrap">
                        <div class="list-type-wrapper">
                            <div
                                class="list-type-item"
                                :class="listType === item.value && 'active'"
                                :key="item.value"
                                v-for="item in listTypes"
                                @click="listType = item.value"
                            >
                                {{ item.label }}
                            </div>
                        </div>
                    </div>
                </div>
       
                <div v-if="listType === 'list'" class="list-content">
                    <ListHead></ListHead>
                    <HorseItem :item="item" v-for="item in list" :key="item.ID"></HorseItem>
                    <pagination
                        v-if="list.length"
                        v-show="totalPages > 0"
                        :total="total"
                        :page.sync="query.page"
                        :limit.sync="query.per"
                        @pagination="loadList"
                    />
                </div>
            
                <div v-if="listType === 'card'" class="list-card-content">
                    <HorseCard :item="item" v-for="item in list" :key="item.ID"></HorseCard>
                    <el-button
                        v-if="list.length"
                        class="more-btn"
                        :disabled="!hasNextPage"
                        @click="loadCardList"
                        :loading="loading"
                        :style="{ width: buttonWidth ? buttonWidth + 'px' : '100%' }"
                        icon="el-icon-arrow-down"
                        >{{ hasNextPage ? "加载更多" : "没有更多了" }}</el-button
                    >
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import { getHorses, getFeeds, getAttrs } from "@/service/horse";
import CommonList from "@/components/common/list.vue";
import PvxSearch from "@/components/PvxSearch.vue";
import HorseBroadcast from "@/components/horse/HorseBroadcast";
import HorseCard from "@/components/horse/HorseCard";
import SameItem from "@/components/horse/SameItem.vue";
import ListHead from "@/components/horse/ListHead";
import HorseItem from "@/components/horse/HorseItem";
import { omit, cloneDeep, concat } from "lodash";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { isPhone } from "@/utils/index";
export default {
    name: "HorseHome",
    components: { SameItem, HorseCard, HorseBroadcast, CommonList },
    data() {
        return {
            loading: false,
            listType: "card",
            listTypes: [
                {
                    value: "list",
                    label: "列表",
                },
                {
                    value: "card",
                    label: "卡片",
                },
            ],
            keyword: "",
            active: "",
            page: 1, //当前页数
            total: 0, //总条目数
            per: 0, //每页条目
            count: 0, // 自动判断最多显示几个
            list: [
                {
                    type: "",
                    name: "全部",
                    page: 1,
                    pages: 1,
                    list: [],
                },
                {
                    type: 0,
                    name: "普通坐骑",
                    page: 1,
                    pages: 1,
                    list: [],
                },
                {
                    type: 1,
                    name: "奇趣坐骑",
                    page: 1,
                    pages: 1,
                    list: [],
                },
                {
                    type: 2,
                    name: "马具",
                    page: 1,
                    pages: 1,
                    list: [],
                },
            ],
            itemData: {
                color: "#E86F00",
                width: "220",
            },
            appendMode: false,
            feeds: [],
            attrs: [],

            searchProps: [
                {
                    key: "type",
                    name: "类型",
                    type: "radio",
                    options: [
                        {
                            type: "",
                            name: "全部",
                        },
                        {
                            type: 0,
                            name: "普通坐骑",
                        },
                        {
                            type: 1,
                            name: "奇趣坐骑",
                        },
                        {
                            type: 2,
                            name: "马具",
                        },
                    ],
                },
                {
                    type: "filter",
                    key: "filter",
                    name: "过滤",
                    options: [
                        {
                            key: "feed",
                            type: "checkbox",
                            name: "喂食饲料",
                            options: [],
                        },
                        {
                            key: "attr",
                            type: "checkbox",
                            name: "属性",
                            options: [],
                        },
                    ],
                },
                {
                    key: "keyword",
                    name: "名称/ID",
                },
            ],

            buttonWidth: 0,
            showCross: [],
            showRecentCross: false,
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        params() {
            const _params = { client: this.client, per: this.per };
            if (this.keyword) _params.keyword = this.keyword;
            return _params;
        },
        hasNextPage: function () {
            const pages = this.list.filter((e) => e.type === this.active)[0].pages;
            return pages > 1 && this.page < pages;
        },
        subList() {
            if (this.active === 0) return null;
            return this.list.filter((e) => e.type == this.active)[0].list;
        },
        isPhone() {
            return isPhone();
        },
    },
    watch: {
        params: {
            deep: true,
            handler() {
                this.loadData();
            },
        },
        active: {
            immediate: true,
            handler: function () {
                this.page = 1;
            },
        },
    },
    methods: {
        iconLink,
        loadInfoData() {
            getFeeds({ client: this.client }).then((res) => {
                const arr = res.data.map((item) => {
                    const start = item.tip.indexOf("【");
                    const end = item.tip.indexOf("】");
                    item.feed = item.tip.slice(start + 1, end);
                    return item;
                });
                let newArr = [];
                arr.forEach((item) => {
                    const index = newArr.findIndex((nItem) => nItem.feed === item.feed);
                    if (index > -1) {
                        newArr[index].id += "," + item.id;
                    } else {
                        newArr.push(item);
                    }
                });
                this.feeds = newArr.map((item) => {
                    return {
                        label: item.feed,
                        value: item.id,
                    };
                });
            });
            getAttrs({ client: this.client }).then((res) => {
                const data = res.data;
                const options = data.map((item) => {
                    return {
                        label: item.name,
                        value: item.name,
                    };
                });
                this.attrs = options;
            });
        },
        getFeed(item) {
            let feed = "";
            if (item.SubType === 15) {
                feed = this.feeds.find((fitem) => fitem.id === item.DetailType)
                    ? this.feeds.find((fitem) => fitem.id === item.DetailType).feed
                    : "";
            }
            return feed;
        },
        // 可否双骑
        canDouble(item) {
            let name = "";
            if (item.SubType === 15) {
                if (item.MagicAttributes && item.MagicAttributes.length) {
                    name = item.MagicAttributes.find((attr) => attr.id === "15650")
                        ? item.MagicAttributes.find((attr) => attr.id === "15650").name
                        : "单骑";
                }
            }
            return name;
        },
        getType(item) {
            // SubType 15为坐骑 23 为马具
            // DetailType 0普通坐骑，非0奇趣坐骑, 非0决定feed
            // DetailType 0头饰，1鞍饰，2足饰，3马饰
            let type = "";
            if (item.SubType === 15) {
                if (item.DetailType === 0) {
                    type = "普通坐骑";
                } else {
                    type = "奇趣坐骑";
                }
            } else if (item.SubType === 23) {
                if (item.DetailType === 0) {
                    type = "头饰";
                } else if (item.DetailType === 1) {
                    type = "鞍饰";
                } else if (item.DetailType === 2) {
                    type = "足饰";
                } else if (item.DetailType === 3) {
                    type = "马饰";
                } else {
                    type = "马具";
                }
            }
            return type;
        },
        listId(list) {
            if (!list?.length) return [];
            return list.map((e) => e.ID);
        },
        changePage(i) {
            this.page = i;
            this.loadData();
        },
        // 按宽度显示个数
        showCount() {
            if (this.isPhone) {
                this.per = 8;
                return;
            }
            const listWidth = this.$refs.listRef?.clientWidth - 120;
            this.count = Math.floor(listWidth / this.itemData.width);
            this.per = this.count;
        },
        appendPage() {
            this.appendMode = true;
            this.handleLoad(this.active, true);
        },
        handleLoad(type, append) {
            const page = this.list.filter((e) => e.type === type)[0].page;
            let params = cloneDeep(this.params);
            params.page = page + 1;
            params.per = append ? this.per * 3 : this.per;
            params.type = type;
            this.loadList(params, type);
        },
        loadData() {
            this.loading = true;
            let params = omit(this.params, ["type"]);
            if (this.active === "") {
                const list = this.list.filter((e) => e.type !== "");
                list.forEach((e) => {
                    params.page = e.page;
                    params.type = e.type;
                    params.per = this.per;
                    this.loadList(params, e.type);
                });
            } else {
                params.page = this.page;
                params.per = this.per * 3;
                this.loadList({ ...params, type: this.active }, this.active);
            }
        },
        loadList(params, key) {
            const index = this.list.findIndex((e) => e.type === key);
            if (this.list[index].pages < params.page && this.active === "") params.page = 1;
            getHorses(params)
                .then((res) => {
                    const { list, total, pages, page } = res.data;
                    const _list = this.appendMode ? concat(this.list[index].list, list) : list;
                    const newList = _list.map((item) => {
                        item.typeName = this.getType(item);
                        item.modeName = this.canDouble(item);
                        item.feedName = this.getFeed(item);
                        if (item.MoveSpeed) {
                            item.speed = item.MoveSpeedDesc.split("移动速度提高")[1];
                        }
                        if (item.MagicAttributes && item.MagicAttributes.length) {
                            item.MagicAttributes.map((mItem) => {
                                mItem.iconUrl = this.iconLink(mItem.icon);
                                return mItem;
                            });
                        }
                        return item;
                    });
                    this.list[index].list = newList || [];
                    this.list[index].page = page || 1;
                    this.list[index].pages = pages || 1;
                    if (this.active !== "") this.page = page || 1;
                    this.total = total;
                })
                .finally(() => {
                    this.loading = false;
                    this.appendMode = false;
                });
        },
    },
    mounted() {
        this.showCount();
        this.loadInfoData();

        // const attrPro = this.getAttrList();
        // const feedPro = this.getFeedList();
        // const self = this;
        // Promise.all([attrPro, feedPro]).then(() => {
        //     self.jdugeType();
        // });
        // window.onresize = function () {
        //     self.jdugeType();
        // };
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/index.less";
</style>
