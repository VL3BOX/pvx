<template>
    <div class="reputation-container" v-loading="loading">
        <div class="m-common-tabs">
            <div class="m-group">
                <div class="u-tab" :class="{ active: isAll }" @click="toAll">全部</div>
                <el-select class="u-select" v-model="dlc" clearable :class="{ active: dlc }">
                    <el-option
                        v-for="item in versions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    ></el-option>
                    <template #prefix> 版本 </template>
                </el-select>
            </div>

            <div class="m-group m-group-search">
                <el-input
                    v-model="keyword"
                    class="u-search"
                    :placeholder="`输入关键词搜索`"
                    clearable
                    suffix-icon="el-icon-search"
                >
                </el-input>
            </div>
        </div>

        <div v-if="isAll && !this.keyword" class="reputation-list-wrapper">
            <div class="reputation-title">资料片新增</div>
            <div class="reputation-list">
                <reputation-item :item="item" v-for="item in newsList" :key="item.dwForceID"></reputation-item>
            </div>
        </div>
        <template v-if="showList.length">
            <div class="reputation-list-wrapper" v-for="item in showList" :key="item.value">
                <div class="reputation-title">{{ item.label }}</div>
                <div class="reputation-list">
                    <reputation-item :item="item" v-for="item in item.list" :key="item.dwForceID"></reputation-item>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import ReputationItem from "@/components/reputation/ReputationItem.vue";
import { getList, getMenus } from "@/service/reputation";
import maps_std from "@jx3box/jx3box-data/data/fb/fb_map.json";
import maps_origin from "@jx3box/jx3box-data/data/fb/fb_map_origin.json";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
import { cloneDeep } from "lodash";

export default {
    name: "Index",
    components: { ReputationItem },
    data() {
        return {
            loading: false,
            news: [],
            newsList: [],
            level: -1,
            versions: [],
            versionList: [],
            isAll: true,
            keyword: "",
            dlc: "",
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        params() {
            return {
                page: 1,
                per: 50,
                client: this.client,
            };
        },
        showList() {
            let list = cloneDeep(this.versionList);
            if (this.dlc) {
                list = list.filter((item) => item.value === Number(this.dlc));
            }
            if (this.keyword) {
                const keyword = this.keyword.trim();
                list = list
                    .map((item) => {
                        item.list = item.list.filter((e) => e.szName.includes(keyword));
                        return item;
                    })
                    .filter((item) => {
                        return item.list.length;
                    });
            }
            return list;
        },
    },
    watch: {
        dlc(val) {
            this.isAll = val ? false : true;
        },
    },
    methods: {
        toAll() {
            this.isAll = true;
            this.dlc = "";
        }, 
        loadData() {
            this.loading = true;
            getBreadcrumb("reputation-newest", { client: this.client })
                .then((data) => {
                    this.news = data.split(",").map((item) => Number(item));
                })
                .then(() => {
                    getMenus({ client: this.client }).then((res) => {
                        const maps = this.client === "std" ? maps_std : maps_origin;
                        const list = res.data.dlc || [];
                        const arr = Object.keys(maps)
                            .map((key) => {
                                return `${key}(${maps[key].level}级)`;
                            })
                            .reverse();
                        const versions = list.map((item, i) => {
                            return {
                                value: item.nDlcID,
                                total: item.total,
                                label: arr[i],
                            };
                        });
                        this.versions = versions.reverse();
                        // 加载所有声望
                        const promiseAll = this.versions.map((item) => getList({ dlc: item.value, ...this.params }));
                        Promise.all(promiseAll).then((res) => {
                            const allList = res.map((item) => item.data.list);
                            this.newsList = allList.flat().filter((item) => this.news.includes(item.dwForceID));
                            const filterList = this.versions.map((item) => {
                                return {
                                    ...item,
                                    list: allList.flat().filter((reputation) => reputation.nDlcID === item.value),
                                };
                            });
                            this.versionList = filterList;
                        });
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/tabs.less";
@import "~@/assets/css/reputation/home.less";
</style>
