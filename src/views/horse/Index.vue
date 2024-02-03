<template>
    <div ref="listRef" class="horse-home-wrapper" v-loading="loading">
        <PvxSearch :items="searchProps" :initValue="initValue" @search="searchEvent($event)"></PvxSearch>
        <div class="list-wrapper" ref="crossWrap">
            <!-- 全部模式 -->
            <template v-if="isAll">
                <!-- 抓马播报 -->
                <HorseBroadcast v-if="client === 'std'"></HorseBroadcast>
                <!-- 普通坐骑、奇趣坐骑、马具 -->
                <div class="list-item-wrapper" v-for="(list, index) in listAll" :key="index">
                    <div v-if="list.length" class="title-header">
                        <div class="title">
                            {{ types[index + 1].name }}
                        </div>
                        <a href="javascript:;" @click="toLookAll(types[index + 1].type)">{{ $t('查看全部') }}</a>
                    </div>
                    <list-cross
                        v-if="showCross[index]"
                        :ref="types[index + 1].name"
                        :key="types[index + 1].name"
                        :list="list"
                        :radius="0"
                    >
                        <template v-slot="data">
                            <HorseCard :item="data.item"></HorseCard>
                        </template>
                    </list-cross>
                    <div v-else class="no-cross-wrap">
                        <div class="list">
                            <HorseCard :item="item" v-for="item in list" :key="item.id"></HorseCard>
                        </div>
                    </div>
                </div>
            </template>
            <!-- 列表模式 -->
            <div v-else class="list-item-wrapper">
                <div v-if="list.length" class="title-header">
                    <div class="title">
                        {{
                            types.find((item) => item.type === this.selected)
                                ? types.find((item) => item.type === this.selected).name
                                : $t('全部')
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
                <!-- 列表 -->
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
                <!-- 卡片 -->
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
                        >{{ hasNextPage ? $t('加载更多') : $t('没有更多了') }}</el-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getHorses, getFeeds, getAttrs } from "@/service/horse";
import PvxSearch from "@/components/PvxSearch.vue";
import ListCross from "@/components/ListCross.vue";
import HorseBroadcast from "@/components/horse/HorseBroadcast";
import HorseCard from "@/components/horse/HorseCard";
import ListHead from "@/components/horse/ListHead";
import HorseItem from "@/components/horse/HorseItem";
import Pagination from "@/components/Pagination";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { deleteNull, isPhone } from "@/utils/index";
export default {
    name: "HorseHome",
    components: { PvxSearch, ListCross, HorseCard, ListHead, HorseItem, Pagination, HorseBroadcast },
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
            query: {
                page: 1,
                per: 20,
            },
            total: 0,
            totalPages: 0,
            search: {},
            listAll: [],
            list: [],
            feeds: [],
            // 是否是全部
            isAll: true,
            // 默认全部
            selected: "",
            initValue: {},
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
            gap: 20,
            base: 200,
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        types() {
            return this.searchProps[0].options;
        },
        params() {
            return { ...this.query, ...this.search, client: this.client };
        },
        showSwitch() {
            const isAll = this.isAll;
            return !isAll && !this.isPhone();
        },
        hasNextPage: function () {
            return this.totalPages > 1 && this.query.page < this.totalPages;
        },
    },
    watch: {
        listType: {
            handler(listType) {
                this.query.page = 1;
                this.list = [];
                if (listType === "list") {
                    this.query.per = 20;
                    this.loadList();
                } else {
                    this.showCount();
                }
            },
        },
    },
    methods: {
        isPhone,
        iconLink,
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
        getList(type, returnList = true) {
            const params = deleteNull({ ...this.params, type });
            this.loading = true;
            return new Promise((resolve, reject) => {
                getHorses(params)
                    .then((res) => {
                        const newList = res.data.list.map((item) => {
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
                        this.loading = false;
                        if (returnList) {
                            // 是否只返回List
                            resolve(newList);
                        } else {
                            resolve(res.data);
                        }
                    })
                    .catch((err) => {
                        this.loading = false;
                        reject(err);
                    });
            });
        },
        toLookAll(type) {
            this.$set(this.initValue, "type", type);
        },
        toList(type) {
            this.query.page = 1;
            if (type === "" || type === undefined) {
                this.isAll = true;
                this.getAllList();
            } else {
                this.isAll = false;
                this.list = [];
                if (this.listType === "card") {
                    this.showCount();
                } else {
                    this.loadList();
                }
            }
        },
        loadList() {
            this.getList(this.selected, false).then((data) => {
                this.list = data.list;
                this.total = data.total;
                this.totalPages = data.pages;
            });
        },
        loadCardList() {
            this.getList(this.selected, false).then((data) => {
                this.query.page++;
                this.list = this.list.concat(data.list);
                this.total = data.total;
                this.totalPages = data.pages;
            });
        },
        async getFeedList() {
            await getFeeds({ client: this.client }).then((res) => {
                const arr = res.data.map((item) => {
                    const start = item.tip.indexOf("【");
                    const end = item.tip.indexOf("】");
                    item.feed = item.tip.slice(start + 1, end);
                    return item;
                });
                this.feeds = JSON.parse(JSON.stringify(arr));
                const newArr = [];
                arr.forEach((item) => {
                    const index = newArr.findIndex((nItem) => nItem.feed === item.feed);
                    if (index > -1) {
                        newArr[index].id += "," + item.id;
                    } else {
                        newArr.push(item);
                    }
                });

                const options = newArr.map((item) => {
                    return {
                        label: item.feed,
                        value: item.id,
                    };
                });
                this.searchProps[1].options[0].options = options;
            });
        },
        async getAttrList() {
            await getAttrs({ client: this.client }).then((res) => {
                const data = res.data;
                const options = data.map((item) => {
                    return {
                        label: item.name,
                        value: item.name,
                    };
                });
                this.searchProps[1].options[1].options = options;
            });
        },
        searchEvent(data) {
            this.search = data;
            this.selected = data.type;
            this.toList(data.type);
        },
        jdugeType() {
            const self = this;
            setTimeout(() => {
                if (self.isPhone()) {
                    self.selected = "";
                    self.listType = "card";
                }
            }, 10);
        },
        // 列表card模式下按宽度显示个数
        showCount() {
            this.$nextTick(() => {
                const listWidth = this.$refs.listRef?.clientWidth;
                this.query.per = Math.floor(listWidth / this.base) * 4;
                // 加载更多按钮的实际宽度
                if (!this.isPhone()) {
                    this.buttonWidth = (this.query.per / 4) * (this.base + this.gap) - 20;
                }
                this.loadCardList();
            });
        },
        getAllList() {
            // 重置
            this.query.per = 20;
            this.listAll = [];
            this.showCross = [];

            const type0 = this.getList(0),
                type1 = this.getList(1),
                type2 = this.getList(2);
            this.loading = true;
            Promise.allSettled([type0, type1, type2])
                .then((data) => {
                    const newData = data.map((item) => {
                        if (item.status === "fulfilled") {
                            return item.value;
                        } else {
                            return [];
                        }
                    });
                    const wrapW = this.$refs.crossWrap?.clientWidth;
                    const gap = this.gap;
                    const baseW = this.base + gap;
                    const len = newData.length;
                    for (let i = 0; i < len; i++) {
                        // 判断是否显示左右滚动
                        const sw = newData[i].length * baseW - gap;
                        if (sw > wrapW) {
                            this.showCross[i] = true;
                        } else {
                            this.showCross[i] = false;
                        }
                    }
                    this.listAll = newData;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        const attrPro = this.getAttrList();
        const feedPro = this.getFeedList();
        const self = this;
        Promise.all([attrPro, feedPro]).then(() => {
            self.jdugeType();
        });
        window.onresize = function () {
            self.jdugeType();
        };
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/index.less";
</style>
