<template>
    <div class="horse-list-wrapper" ref="listRef">
        <!-- 搜索 -->
        <PvxSearch :items="searchProps" :initValue="initValue" @search="searchEvent($event)"></PvxSearch>
        <!-- 预留抓马播报 -->
        <!-- 列表 -->
        <div class="horse-list-content">
            <div class="horse-title-wrap">
                <h2>
                    {{
                        searchProps[0].options.find((item) => item.type === search.type)
                            ? searchProps[0].options.find((item) => item.type === search.type).name
                            : "全部"
                    }}
                </h2>
                <div v-if="showSwitch" class="operate-wrap">
                    <el-tooltip
                        :content="listType === 'card' ? '卡片模式' : '列表模式'"
                        class="theme-tooltips"
                        placement="top"
                    >
                        <el-switch
                            v-model="listType"
                            active-value="card"
                            inactive-value="list"
                            active-icon-class="el-icon-menu"
                            inactive-icon-class="el-icon-s-order"
                            active-color="#d16400"
                        />
                    </el-tooltip>
                </div>
            </div>
            <div class="horse-list" :class="[listType + '-wrap']" v-loading="loading">
                <div v-if="listType === 'card'" class="list-content">
                    <HorseCard :item="item" v-for="item in list" :key="item.ID"></HorseCard>
                    <el-button
                        class="more-btn"
                        :disabled="!hasNextPage"
                        @click="loadData"
                        :loading="loading"
                        icon="el-icon-arrow-down"
                        >{{ hasNextPage ? "加载更多" : "没有更多了" }}</el-button
                    >
                </div>
                <div v-if="listType === 'list'" class="list-content">
                    <ListHead></ListHead>
                    <HorseItem :item="item" v-for="item in list" :key="item.ID"></HorseItem>
                    <pagination
                        v-show="totalPages > 0"
                        :total="total"
                        :page.sync="query.page"
                        :limit.sync="query.pageSize"
                        @pagination="findList(false)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { getHorses, getFeeds, getAttrs } from "@/service/horse";
import HorseCard from "@/components/horse/HorseCard";
import ListHead from "@/components/horse/ListHead";
import HorseItem from "@/components/horse/HorseItem";
import PvxSearch from "@/components/PvxSearch.vue";
import { deleteNull, isPhone } from "@/utils/index";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "HorseList",
    props: [],
    components: {
        ListHead,
        HorseItem,
        HorseCard,
        PvxSearch,
    },
    data() {
        return {
            loading: false,
            listType: "card",
            showSwitch: true,
            feeds: [],
            list: [],
            query: {
                page: 1,
                pageSize: 20,
                client: this.client,
            },
            total: 0,
            totalPages: 0,
            search: {},
            initValue: {
                type: "",
            },
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
                            type: "select",
                            name: "喂养方式",
                            multiple: true,
                            options: [],
                        },
                        {
                            key: "attr",
                            type: "select",
                            name: "属性",
                            filterable: true,
                            remote: "getAttrList",
                        },
                    ],
                },
                {
                    key: "keyword",
                    name: "名称",
                },
            ],
        };
    },
    computed: {
        hasNextPage: function () {
            return this.totalPages > 1 && this.query.page < this.totalPages;
        },
        client: function () {
            return this.$store.state.client;
        },
    },
    watch: {
        listType: {
            handler(type) {
                this.query.page = 1;
                if (type === "card") {
                    this.showCount();
                    this.findList();
                } else {
                    this.query.pageSize = 20;
                    this.findList();
                }
            },
        },
        search: {
            deep: true,
            handler() {
                this.query.page = 1;
                this.findList();
            },
        },
    },
    methods: {
        async getAttrList(params) {
            await getAttrs().then((res) => {
                const data = res.data.concat([{ name: "双骑" }, { name: "渡水" }]);
                const options = data
                    .filter((item) => item.name.indexOf(params.name) > -1)
                    .map((item) => {
                        return {
                            label: item.name,
                            value: item.name,
                        };
                    });
                this.searchProps[1].options[1].options = options;
            });
        },
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
        isPhone,
        searchEvent(data) {
            this.search = data;
        },
        loadData() {
            this.query.page++;
            this.findList(true);
        },
        findList: function (isAppend = false) {
            this.loading = true;
            const search = Object.assign({}, this.search);
            for (let key in search) {
                if (Array.isArray(search[key])) {
                    search[key] = search[key].toString();
                }
            }
            const query = Object.assign({}, this.query);
            const params = Object.assign(search, query);
            getHorses(deleteNull(params))
                .then((res) => {
                    let newList = res.data.list.map((item) => {
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
                    if (isAppend) {
                        this.list = this.list.concat(newList);
                    } else {
                        this.list = newList;
                    }
                    this.total = res.data.total;
                    this.totalPages = res.data.pages;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        async getFeedList() {
            await getFeeds().then((res) => {
                const arr = res.data.map((item) => {
                    const start = item.tip.indexOf("【");
                    const end = item.tip.indexOf("】") + 1;
                    item.feed = item.tip.slice(start, end);
                    return item;
                });
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
        // 按宽度显示个数
        showCount() {
            this.$nextTick(() => {
                const listWidth = this.$refs.listRef?.clientWidth;
                this.query.pageSize = Math.floor(listWidth / 220) * 4;
            });
        },
        jdugeType() {
            const self = this;
            setTimeout(() => {
                self.showSwitch = !self.isPhone();
                if (self.isPhone()) {
                    self.listType = "card";
                }
            }, 10);
        },
    },
    mounted: function () {
        this.jdugeType();
        const self = this;
        window.onresize = function () {
            self.jdugeType();
        };
        this.getFeedList().then(() => {
            if (this.listType === "card") {
                this.showCount();
                // 此处设置了初始化的值，改变了search，会自动触发查询，不再挂载后手动请求。
                // this.findList();
            } else {
                // this.findList();
            }
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/list.less";
</style>
