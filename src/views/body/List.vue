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
                <div class="m-list" v-for="(_list, index) in groupList" :key="index">
                    <h2 class="u-list-title">
                        <span>{{ nameMap[_list.key] }}</span>
                        <span class="u-more" @click="setActive(_list.key)">查看全部</span>
                    </h2>
                    <!-- 显示一行 -->
                    <div class="m-list-box" v-if="!tabsData.body_type">
                        <list-cross :list="_list.list" :gap="0" :radius="0" :id="'nav' + index">
                            <template v-slot="data">
                                <bodyItem :item="data.item"></bodyItem>
                            </template>
                        </list-cross>
                    </div>

                    <!-- 显示多行 -->
                    <template v-else>
                        <div class="m-all">
                            <bodyItem
                                v-for="item in _list.list"
                                :key="item.id"
                                :item="item"
                                :reporter="{ aggregate: listId(groupList) }"
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
            <el-alert v-else class="m-archive-null" :title="$t('没有找到相关的体型')" type="info" show-icon center></el-alert>
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
            bodyId: "",
            tabsData: {},
            link: {
                data: "/body/bodydata",
                key: "body",
            },

            loading: false,
            list: [],
            page: 1,
            pageTotal: 1,
            total: 0,
            appendMode: false,
            all: true,

            nameMap: {
                1: "成男体型",
                2: "成女体型",
                5: "正太体型",
                6: "萝莉体型",
            },
        };
    },
    components: { faceTabs, ListCross, bodyItem },
    computed: {
        pageSize() {
            return this.all ? 14 : 21;
        },
        params({ tabsData }) {
            return {
                ...tabsData,
                pageIndex: this.page,
                pageSize: this.pageSize,
                client: "std",
            };
        },
        groupList() {
            return Object.keys(this.nameMap)
                .map((item) => {
                    let list = [];
                    this.list.forEach((el) => {
                        if (el.body_type == item) list.push(el);
                    });
                    return { key: item, list };
                })
                .filter((item) => item.list.length);
        },
        hasNextPage() {
            return this.page < this.pageTotal;
        },
    },
    watch: {
        params: {
            deep: true,
            handler: function () {
                if (!this.all) {
                    this.getData();
                } else {
                    Object.keys(this.nameMap).forEach((item) => {
                        this.getData({ body_type: item });
                    });
                }
            },
        },
    },
    methods: {
        getData(params) {
            this.loading = true;
            const _params = clone(this.params);
            getBodyList({ ...params, ..._params })
                .then((res) => {
                    const list = res.data.data.list || [];
                    this.total = res.data.data.page.total;
                    this.list = this.list.concat(list);
                    this.pageTotal = res.data.data.page.pageTotal;
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
            this.list = [];
            this.all = data.body_type ? false : true;
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
