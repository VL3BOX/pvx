<template>
    <div class="v-share-list" v-loading="loading">
        <ShareSearch @onSearchKey="onSearchKey" />
        <ShareTabs @onShareData="onShareData" />
        <template v-if="list.length > 0">
            <div class="m-face-list">
                <ShareItem v-for="(item, index) in list" :key="index" :item="item" />
            </div>
            <el-button class="m-archive-more" v-show="hasNextPage" type="primary" @click="appendPage" :loading="loading" icon="el-icon-arrow-down">加载更多</el-button>
            <el-pagination class="m-archive-pages" background layout="total, prev, pager, next, jumper" :hide-on-single-page="true" :page-size="per" :total="total" :current-page.sync="page"></el-pagination>
        </template>

        <el-alert v-else class="m-archive-null" :title="title" type="info" center show-icon></el-alert>
    </div>
</template>

<script>
import ShareSearch from "@/components/share/search.vue";
import ShareTabs from "@/components/share/tabs.vue";
import ShareItem from "@/components/share/item.vue";
import { getPosts } from "@/service/share";
export default {
    name: "shareList",
    components: { ShareSearch, ShareTabs, ShareItem },
    data: function () {
        return {
            loading: false,
            list: [],
            search: "",
            mark: "",
            subtype: "",

            page: 1, //当前页数
            total: 1, //总条目数
            pages: 1, //总页数
            per: 40, //每页条目

            appendMode: false, //追加模式
        };
    },
    computed: {
        title: function () {
            if (this.search) return "没找到对应的捏脸，请重新选择条件或关键词搜索";
            return "没有找到相关的捏脸";
        },
        params: function () {
            let _params = {
                per: this.per,
                sticky: 1,
                page: this.page,
                type: "share",
            };
            if (this.search) _params.search = this.search;
            if (this.mark && this.mark !== "all") _params.mark = this.mark;
            if (this.subtype && this.subtype !== "全部") _params.subtype = this.subtype;
            return _params;
        },
        hasNextPage: function () {
            return this.pages > 1 && this.page < this.pages;
        },
    },
    methods: {
        onShareData(data) {
            this.mark = data.mark;
            this.subtype = data.subtype;
            this.page = 1;
        },
        onSearchKey(search) {
            this.search = search;
            this.page = 1;
        },
        // 获取数据
        getData() {
            this.loading = true;
            getPosts(this.params, this)
                .then((res) => {
                    if (this.appendMode) {
                        this.list = this.list.concat(res.data.data.list);
                    } else {
                        this.list = res.data.data.list;
                    }

                    this.total = res.data.data.total;
                    this.pages = res.data.data.pages;
                })
                .finally(() => {
                    this.appendMode = false;
                    this.loading = false;
                });
        },
        appendPage: function () {
            this.appendMode = true;
            this.page = this.page + 1;
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (obj) {
                if (obj) this.getData();
            },
        },
    },
    mounted: function () {},
};
</script>

<style lang="less">
    @import "~@/assets/css/share/list.less";
</style>
