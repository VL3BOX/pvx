<template>
    <div class="m-body-list">
        <faceTabs
            @change="handleTabChange"
            :body_types="body_types"
            :link="link"
            :active="active"
            @setActive="setActive"
        />
        <div class="m-content">
            <template v-if="list.length">
                <div class="m-list" v-for="(_list, key) in groupList" :key="key">
                    <h2 class="u-title">{{ nameMap[key] }}</h2>
                    <list-cross v-if="_list.length" :list="_list" :gap="10" :radius="0">
                        <template v-slot="data">
                            <bodyItem class="m-pvx-item" :item="data.item"></bodyItem>
                        </template>
                    </list-cross>
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
            pageSize: 10,
            pageTotal: 1,
            total: 0,
            showAllList: false,

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
        handleTabChange(data) {
            this.page = 1;
            this.tabsData = data;
        },
        setActive(val) {
            this.active = val;
            document.documentElement.scrollTop = 0;
        },
        getData() {
            this.loading = true;
            const params = clone(this.params);
            getBodyList(params).then((res) => {
                this.list = res.data.data.list || [];
                this.total = res.data.data.page.total;
            });
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/body/list.less";
</style>
