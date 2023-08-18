<template>
    <div class="m-body-list">
        <faceTabs
            @change="handleTabChange"
            :body_types="body_types"
            :link="link"
            :active="active"
            @setActive="setActive"
        />
        <div class="m-content" v-loading="loading">
            <template v-if="list.length">
                <div class="m-list" v-for="(_list, key) in groupList" :key="key">
                    <h2 class="u-title">{{ nameMap[key] }}</h2>
                    <!-- 显示一行 -->
                    <list-cross v-if="!tabsData.body_type" :list="_list" :gap="0" :radius="0">
                        <template v-slot="data">
                            <bodyItem class="m-pvx-item" :item="data.item"></bodyItem>
                        </template>
                    </list-cross>
                    <!-- 显示多行 -->
                    <template v-else>
                        <div class="m-all">
                            <bodyItem
                                v-for="item in _list"
                                :key="item.id"
                                :item="item"
                                :reporter="{ aggregate: listId(list) }"
                            />
                        </div>
                        <el-button
                            class="m-archive-more"
                            v-show="hasNextPage"
                            type="primary"
                            @click="appendPage"
                            :loading="loading"
                            icon="el-icon-arrow-down"
                            >加载更多</el-button
                        >
                        <el-pagination
                            class="m-archive-pages"
                            background
                            layout="total, prev, pager, next, jumper"
                            :hide-on-single-page="true"
                            :page-size="pageSize"
                            :total="total"
                            :current-page.sync="page"
                        ></el-pagination>
                    </template>
                </div>
            </template>
            <el-alert v-else class="m-archive-null" title="没有找到相关的体型" type="info" show-icon center></el-alert>
        </div>
    </div>
</template>
<script>
import { getBodyList } from "@/service/body";
import faceTabs from "@/components/face/tabs";
import bodyItem from "@/components/body/item";
import body_types from "@/assets/data/body_types.json";
import ListCross from "@/components/ListCross.vue";
import { clone } from "lodash";
export default {
    name: "BodyList",
    data: function () {
        return {
            active: "",
            body_types,
            tabsData: {},
            link: {
                data: "/body/bodydata",
                key: "body",
            },

            loading: false,
            list: [],
            page: 1,
            pageSize: 14,
            pageTotal: 1,
            total: 0,
            showAllList: false,
            appendMode: false,

            nameMap: {
                1: "成男体型",
                2: "成女体型",
                5: "正太体型",
                6: "萝莉体型",
            },
        };
    },
    components: {
        faceTabs,
        ListCross,
        bodyItem,
    },
    computed: {
        params({ tabsData }) {
            return {
                ...tabsData,
                pageIndex: this.page,
                pageSize: this.pageSize,
                client: this.client,
            };
        },
        groupList() {
            return this.list.reduce((acc, cur) => {
                acc[cur.body_type] ? acc[cur.body_type].push(cur) : (acc[cur.body_type] = [cur]);
                return acc;
            }, {});
        },
        hasNextPage() {
            return this.page < this.pageTotal;
        },
    },
    watch: {
        params: {
            deep: true,
            handler() {
                this.getData();
            },
        },
    },
    methods: {
        getData() {
            this.loading = true;
            const params = clone(this.params);
            getBodyList(params)
                .then((res) => {
                    const list = res.data.data.list || [];
                    this.total = res.data.data.page.total;
                    this.list = this.appendMode ? this.list.concat(list) : list;
                    if (this.params.body_type) this.pageTotal = res.data.data.page.pageTotal;
                })
                .finally(() => {
                    this.loading = false;
                    this.appendMode = false;
                });
        },
        setActive(val) {
            this.active = val;
            document.documentElement.scrollTop = 0;
        },
        handleTabChange(data) {
            this.page = 1;
            this.tabsData = data;
        },
        appendPage() {
            this.appendMode = true;
            this.page = this.page + 1;
        },
        listId(list) {
            return list.map((e) => e.id);
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/body/list.less";
</style>
