<template>
    <div class="m-bbs">
        <div class="m-archive-list">
            <bbs_item v-for="item in list" :item="item" :key="item.id"></bbs_item>
            <pagination
                v-if="list.length"
                v-show="totalPages > 1"
                :total="total"
                :page.sync="query.page"
                :limit.sync="query.per"
                @pagination="loadList"
            />
        </div>
    </div>
</template>

<script>
import { getBbsList } from "@/service/homeland";
import Pagination from "@/components/Pagination";
import bbs_item from "@/components/homeland/bbs_item.vue";
export default {
    name: "BBS",
    components: { Pagination, bbs_item },
    data() {
        return {
            list: [],
            total: 0,
            totalPages: 0,
            query: {
                page: 1,
                per: 20,
            },
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        params() {
            return { ...this.query, client: this.client, order: "update", type: "bbs", topic: "家园" };
        },
    },
    methods: {
        loadList() {
            getBbsList(this.params).then((res) => {
                this.list = res.data?.data?.list || [];
                this.total = res.data?.data?.total;
                this.totalPages = res.data?.data?.pages;
            });
        },
    },
    created() {
        this.loadList();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/homeland/bbs.less";
</style>
