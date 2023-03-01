<template>
    <div v-loading="loading" class="m-search-result">
        <search-input></search-input>
        <list-head></list-head>
        <item-card v-for="(book, index) in list" :key="index" :item="book"></item-card>
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
    </div>
</template>

<script>
import ItemCard from "@/components/book/result/item_card.vue";
import SearchInput from "@/components/book/common/search_input.vue";
import ListHead from "@/components/book/result/list_head.vue";
import { getList } from "@/service/book";
export default {
    name: "SearchResult",
    components: { ItemCard, SearchInput, ListHead },
    data: () => ({
        total: 1,
        pageSize: 10,
        list: [],
        input: "",
        currentPage: 1,
        loading: false,
    }),
    mounted() {
        this.search();
    },
    methods: {
        search(page = 1) {
            this.loading = true;
            const params = {
                ids: this.id,
                keyword: this.keyword,
                page,
                client: this.client,
            };
            Number(this.profession) !== 8 && (params.profession = this.profession);
            this.list = [];
            getList(params)
                .then((res) => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.pageSize = res.data.per;
                })
                .finally(() => {
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
    },
    computed: {
        profession() {
            return this.$route.query.profession;
        },
        keyword() {
            return this.$route.query.keyword;
        },
        id() {
            return this.$route.query.id;
        },
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        id(id) {
            this.currentPage = 1;
            this.search();
        },
        keyword() {
            this.currentPage = 1;
            this.search();
        },
        profession() {
            this.currentPage = 1;
            this.search();
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/book/result/search_result.less";
</style>
