<template>
    <div ref="listRef" class="book-home-wrapper" v-loading="loading">
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
        <div class="list-wrapper">
            <!-- 全部模式 -->
            <template v-if="isAll">
                <div class="list-item-wrapper" v-for="(list, index) in listAll" :key="index">
                    <div class="title-header">
                        <div class="title">
                            {{ professions[index].name }}
                        </div>
                        <a href="javascript:;" @click="toList(index)">查看全部</a>
                    </div>
                    <list-cross :list="list" :radius="0">
                        <template v-slot="data">
                            <BookCard :item="data.item"></BookCard>
                        </template>
                    </list-cross>
                </div>
            </template>
            <!-- 列表模式 -->
            <template v-else>
                <!-- 列表 -->
                <div v-if="listType === 'list'" class="list-content">
                    <ListHead></ListHead>
                    <BookItem :item="item" v-for="item in list" :key="item.ID"></BookItem>
                    <pagination
                        v-show="totalPages > 0"
                        :total="total"
                        :page.sync="query.page"
                        :limit.sync="query.pageSize"
                        @pagination="loadList"
                    />
                </div>
                <!-- 卡片 -->
                <div v-if="listType === 'card'" class="list-content">
                    <BookCard :item="item" v-for="item in list" :key="item.ID"></BookCard>
                    <el-button
                        class="more-btn"
                        :disabled="!hasNextPage"
                        @click="loadCardList"
                        :loading="loading"
                        icon="el-icon-arrow-down"
                        >{{ hasNextPage ? "加载更多" : "没有更多了" }}</el-button
                    >
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import PvxSearch from "@/components/PvxSearch.vue";
import ListCross from "@/components/ListCross.vue";
import BookCard from "@/components/book/BookCard";
import ListHead from "@/components/book/result/list_head.vue";
import BookItem from "@/components/book/result/book_item.vue";

import { getList } from "@/service/book";

import professions from "@/assets/data/book_profession.json";
import { deleteNull, isPhone } from "@/utils/index";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "Index",
    components: { PvxSearch, ListCross, BookCard, ListHead, BookItem },
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
                client: this.client,
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
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
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
        selected(profession) {
            this.toList(profession);
        },
        listType: {
            handler(type) {
                this.query.page = 1;
                if (type === "card") {
                    this.showCount();
                } else {
                    this.query.pageSize = 20;
                    this.getList();
                }
            },
        },
    },
    methods: {
        iconLink,
        isPhone,
        searchEvent(data) {
            this.search = data;
        },
        toList(profession) {
            if (profession === 8) {
                this.isAll = true;
                this.getAllList();
            } else {
                this.isAll = false;
            }
        },
        loadList() {
            this.getList(this.selected).then((data) => {
                console.log(data);
                this.list = data.list;
            });
        },
        loadCardList() {
            this.query.page++;
            this.getList(this.selected).then((data) => {
                this.list = this.list.concat(data.list);
                this.total = data.total;
                this.totalPages = data.pages;
            });
        },
        getList(profession = 8) {
            const query = this.query;
            const search = deleteNull(this.search);
            const params = Object.assign(search, query);
            if (profession !== 8) {
                params.profession = profession;
            }
            return new Promise((resole, reject) => {
                getList(params)
                    .then((res) => {
                        const newList = res.data.list;
                        resole(newList);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        // 列表card模式下按宽度显示个数
        showCount(bol = true) {
            this.$nextTick(() => {
                const listWidth = this.$refs.listRef?.clientWidth;
                this.query.pageSize = Math.floor(listWidth / 210) * 4;
                bol && this.findList();
            });
        },
        getAllList() {
            const professionPros = [];
            professions.forEach((profession) => {
                professionPros.push(this.getList(profession.id));
            });
            this.loading = true;
            Promise.all(professionPros)
                .then((data) => {
                    this.loading = false;
                    this.listAll = data;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.getAllList();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/book/home.less";
</style>
