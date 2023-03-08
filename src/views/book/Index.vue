<template>
    <div class="m-book-home">
        <!-- <PvxSearch
            ref="search"
            :items="searchProps"
            class="book-search"
            :class="selected && 'selected-wrapper'"
            @search="searchEvent($event)"
        >
            <div class="select-item" :class="!selected && 'active'">全部</div>
        </PvxSearch> -->
        <!-- 通用输入框 -->
        <search-input></search-input>
        <wiki-panel v-loading="loading" :border-none="true">
            <template slot="body">
                <list-head></list-head>
                <item-card v-for="book in list" :key="book.id" :item="book"></item-card>
                <el-pagination
                    hide-on-single-page
                    background
                    layout="prev, pager, next"
                    @current-change="search"
                    :current-page.sync="currentPage"
                    :total="total"
                    :page-size="pageSize"
                    style="text-align: center; margin-top: 1.5rem"
                >
                </el-pagination>
            </template>
        </wiki-panel>
    </div>
</template>

<script>
// import PvxSearch from "@/components/PvxSearch.vue";
import SearchInput from "@/components/book/common/search_input.vue";
import WikiPanel from "@jx3box/jx3box-common-ui/src/wiki/WikiPanel";
import ListHead from "@/components/book/result/list_head.vue";
import ItemCard from "@/components/book/result/item_card.vue";

import { feedback } from "@jx3box/jx3box-common/data/jx3box.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

import { getList } from "@/service/book";

export default {
    name: "Index",
    components: { SearchInput, WikiPanel, ListHead, ItemCard },
    data: () => ({
        by: "all",
        feedback,
        list: [],
        loading: false,
        total: 1,
        pageSize: 10,
        input: "",
        currentPage: 1,
        selected: "",
        searchProps: [
            {
                key: "keyword",
                name: "书籍名称/描述",
            },
        ],
    }),
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        searchEvent() {},
        iconLink,
        search(page = 1) {
            this.loading = true;
            const params = {
                ids: this.id,
                keyword: this.keyword,
                page,
                client: this.client,
            };
            this.list = [];
            getList(params)
                .then((res) => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.pageSize = res.data.per;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.search();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/book/home.less";
</style>
