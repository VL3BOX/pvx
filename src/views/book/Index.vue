<template>
    <div ref="listRef" class="book-home-wrapper" v-loading="loading">
        <PvxSearch ref="search" :items="searchProps" class="book-search" @search="searchEvent($event)">
            <div
                class="select-item"
                v-for="profession in professions"
                :key="profession.id"
                :class="[profession.id === selected && 'is-active', 'select-item-' + profession.id]"
                @click="selected = profession.id"
            >
                {{ profession.name }}
            </div>
        </PvxSearch>
        <div class="list-wrapper" ref="crossWrap">
            <!-- 全部模式 -->
            <template v-if="isAll">
                <!-- 最近阅读 -->
                <div v-if="recentReadList.length" class="list-item-wrapper">
                    <div class="title-header">
                        <div class="title">最近阅读</div>
                        <a href="javascript:;" @click="clearRecent">清除记录</a>
                    </div>
                    <list-cross
                        v-if="isPhone() || showRecentCross"
                        key="recentRead"
                        ref="recentRead"
                        :list="recentReadList"
                        :radius="0"
                    >
                        <template v-slot="data">
                            <BookCard :item="data.item"></BookCard>
                        </template>
                    </list-cross>
                    <div v-else class="no-cross-wrap">
                        <div class="list">
                            <BookCard :item="item" v-for="(item, i) in recentReadList" :key="item.idKey + i"></BookCard>
                        </div>
                    </div>
                </div>
                <!-- 杂集、道学、佛学 -->
                <div class="list-item-wrapper" v-for="(list, index) in listAll" :key="index">
                    <div v-if="list.length" class="title-header">
                        <div class="title">
                            {{ professions[index + 1].name }}
                        </div>
                        <a href="javascript:;" @click="selected = professions[index + 1].id">查看全部</a>
                    </div>
                    <list-cross
                        v-if="showCross[index]"
                        :ref="professions[index + 1].name"
                        :key="professions[index + 1].name"
                        :list="list"
                        :radius="0"
                    >
                        <template v-slot="data">
                            <BookCard :item="data.item"></BookCard>
                        </template>
                    </list-cross>
                    <div v-else class="no-cross-wrap">
                        <div class="list">
                            <BookCard :item="item" v-for="(item, i) in list" :key="item.idKey + i"></BookCard>
                        </div>
                    </div>
                </div>
            </template>
            <!-- 列表模式 -->
            <div v-else class="list-item-wrapper">
                <div v-if="list.length" class="title-header">
                    <div class="title">
                        {{ professions.find((item) => item.id === this.selected).name }}
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
                    <BookItem :item="item" v-for="(item, index) in list" :key="item.idKey + index"></BookItem>
                    <pagination
                        v-if="list.length"
                        v-show="totalPages > 0"
                        :total="total"
                        :page.sync="query.page"
                        :limit.sync="query.pageSize"
                        @pagination="loadList"
                    />
                </div>
                <!-- 卡片 -->
                <div v-if="listType === 'card'" class="list-card-content">
                    <BookCard :item="item" v-for="(item, index) in list" :key="item.idKey + index"></BookCard>
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
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import PvxSearch from "@/components/PvxSearch.vue";
import ListCross from "@/components/ListCross.vue";
import BookCard from "@/components/book/BookCard";
import ListHead from "@/components/book/result/list_head.vue";
import BookItem from "@/components/book/result/book_item.vue";
import Pagination from "@/components/Pagination";

import { getList } from "@/service/book";

import professions from "@/assets/data/book_profession.json";
import { deleteNull, isPhone } from "@/utils/index";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "Index",
    components: { PvxSearch, ListCross, BookCard, ListHead, BookItem, Pagination },
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
                pageSize: 20,
            },
            total: 0,
            totalPages: 0,
            search: {},
            listAll: [],
            list: [],
            // 是否是全部
            isAll: true,
            // 默认全部 id 8
            selected: 8,
            searchProps: [
                {
                    key: "keyword",
                    name: "书籍名称/描述",
                },
            ],
            buttonWidth: 0,
            showCross: [],
            showRecentCross: false,
            gap: 20,
            base: 190,
        };
    },
    computed: {
        ...mapState(["recentReadList"]),
        client() {
            return this.$store.state.client;
        },
        params() {
            return { ...this.query, ...this.search, client: this.client };
        },
        professions() {
            return professions.map((item) => {
                item.id === 8 && (item.name = "全部");
                return item;
            });
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
        recentReadList: {
            deep: true,
            immediate: true,
            handler(list) {
                this.$nextTick(() => {
                    const wrapW = this.$refs.crossWrap?.clientWidth;
                    const gap = this.gap;
                    const baseW = this.base + gap;
                    // 判断是否显示左右滚动
                    const sw = list.length * baseW - gap;
                    if (sw > wrapW) {
                        this.showRecentCross = true;
                    }
                });
            },
        },
        selected(profession) {
            this.$store.dispatch("setCurrentBookType", profession);
            this.toList(profession);
        },
        listType: {
            handler(type) {
                this.query.page = 1;
                this.list = [];
                if (type === "list") {
                    this.query.pageSize = 20;
                    this.loadList();
                } else {
                    this.showCount();
                }
            },
        },
    },
    methods: {
        clearRecent() {
            this.$confirm("此操作将永久清除最近阅读, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$store.dispatch("clearRecentReadList").then(() => {
                        this.$message({
                            type: "success",
                            message: "清除成功!",
                        });
                    });
                })
                .catch(() => {});
        },
        iconLink,
        isPhone,
        searchEvent(data) {
            this.search = data;
            this.toList(this.selected);
        },
        toList(profession) {
            this.query.page = 1;
            if (!profession || profession === 8) {
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
        getList(profession, returnList = true) {
            const params = Object.assign({}, deleteNull(this.params));
            if (profession !== 8) {
                params.profession = profession;
            }
            return new Promise((resolve, reject) => {
                getList(params)
                    .then((res) => {
                        const newList = res.data.list;
                        if (returnList) {
                            // 是否只返回List
                            resolve(newList);
                        } else {
                            resolve(res.data);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        jdugeType() {
            const self = this;
            setTimeout(() => {
                if (self.isPhone()) {
                    self.selected = 8;
                    self.listType = "card";
                }
            }, 10);
        },
        // 列表card模式下按宽度显示个数
        showCount() {
            this.$nextTick(() => {
                const listWidth = this.$refs.listRef?.clientWidth;
                this.query.pageSize = Math.floor(listWidth / 210) * 4;
                // 加载更多按钮的实际宽度
                if (!this.isPhone()) {
                    this.buttonWidth = (this.query.pageSize / 4) * 210 - 20;
                }
                this.loadCardList();
            });
        },
        getAllList() {
            // 重置
            this.query.pageSize = 20;
            this.listAll = [];
            this.showCross = [];

            const professionPros = [];
            professions
                .filter((profession) => profession.id !== 8)
                .forEach((profession) => {
                    professionPros.push(this.getList(profession.id));
                });
            this.loading = true;
            Promise.all(professionPros)
                .then((data) => {
                    this.loading = false;
                    const wrapW = this.$refs.crossWrap?.clientWidth;
                    const gap = this.gap;
                    const baseW = this.base + gap;
                    for (let i = 0; i < data.length; i++) {
                        // 判断是否显示左右滚动
                        const sw = data[i].length * baseW - gap;
                        if (sw > wrapW) {
                            this.showCross[i] = true;
                        } else {
                            this.showCross[i] = false;
                        }
                    }
                    this.listAll = data;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.$store.dispatch("setCurrentBookType", 8);
        this.jdugeType();
        const self = this;
        window.onresize = function () {
            self.jdugeType();
        };
    },
};
</script>

<style lang="less">
@import "~@/assets/css/book/home.less";
</style>
