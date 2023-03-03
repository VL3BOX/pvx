<template>
    <div class="reputation-container">
        <PvxSearch
            ref="search"
            :items="searchProps"
            class="reputation-search"
            :class="selected && 'selected-wrapper'"
            @search="searchEvent($event)"
        >
            <div class="select-item" :class="!selected && 'active'" @click="toAll">全部</div>
        </PvxSearch>
        <div v-loading="loading" class="reputaion-content-wrapper">
            <div v-if="!selected && !this.search.keyword" class="reputation-list-wrapper">
                <div class="reputation-title">资料片新增</div>
                <div class="reputation-list">
                    <reputation-item :item="item" v-for="item in newsList" :key="item.dwForceID"></reputation-item>
                </div>
            </div>
            <template v-if="versionList.length">
                <!-- <div
                    class="reputation-list-wrapper"
                    v-for="(version, index) in getVersionsLately(versions)"
                    :key="version.value"
                >
                    <div class="reputation-title">{{ version.label }}</div>
                    <div class="reputation-list">
                        <reputation-item
                            :item="item"
                            v-for="item in getVersionListLately(index)"
                            :key="item.dwForceID"
                        ></reputation-item>
                    </div>
                </div> -->
                <div class="reputation-list-wrapper" v-for="version in versionList" :key="version.value">
                    <div class="reputation-title">{{ version.label }}</div>
                    <div class="reputation-list">
                        <reputation-item
                            :item="item"
                            v-for="item in version.list"
                            :key="item.dwForceID"
                        ></reputation-item>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import PvxSearch from "@/components/PvxSearch.vue";
import ReputationItem from "@/components/reputation/ReputationItem.vue";

import { getList, getMenus } from "@/service/reputation";
import maps_std from "@jx3box/jx3box-data/data/fb/fb_map.json";
import maps_orgin from "@jx3box/jx3box-data/data/fb/fb_map_origin.json";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";

export default {
    name: "Index",
    components: { PvxSearch, ReputationItem },
    data() {
        return {
            news: [],
            newsList: [],
            level: -1,
            loading: false,
            search: {},
            query: {
                page: 1,
                pageSize: 50,
                client: this.client,
            },
            showList: false,
            versions: [],
            versionList: [],
            selected: "",
            searchProps: [
                {
                    key: "dlc",
                    name: "版本",
                    type: "select",
                    options: [],
                    showLabel: true,
                    showActive: true,
                },
                {
                    key: "keyword",
                    name: "声望/地图/奖励/势力名称",
                },
            ],
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        toAll() {
            this.$refs.search.reset();
        },
        searchEvent(data) {
            this.search = data;
            this.selected = data.dlc;
            if (data.keyword) {
                this.loading = true;
                this.getList(0, data.keyword)
                    .then((list) => {
                        this.loading = false;
                        this.versionList = list;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            }
        },
        getNews() {
            return getBreadcrumb("reputation-newest").then((data) => {
                this.news = data.split(",").map((item) => Number(item));
            });
        },
        async getVersions() {
            await getMenus({
                client: this.client,
            }).then((res) => {
                const maps = this.client === "std" ? maps_std : maps_orgin;
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

                const dclObj = this.searchProps[0];
                dclObj.options = versions;
                this.$set(this.searchProps, 0, dclObj);
            });
        },
        getList(dlc, keyword) {
            const params = Object.assign({}, this.query);
            if (keyword) {
                params.keyword = keyword;
                if (this.selected) {
                    params.dlc = this.selected;
                }
            }
            if (dlc) {
                params.dlc = dlc;
            }
            return new Promise((resolve, reject) => {
                getList(params)
                    .then((res) => {
                        const list = res.data.list || [];
                        resolve(list);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        // getVersionsLately(list) {
        //     const selected = this.selected;
        //     if (selected) {
        //         return list.filter((item) => item.value === selected);
        //     } else {
        //         return list;
        //     }
        // },
        // getVersionListLately(index) {
        //     const list = this.versionList;
        //     const selected = this.selected;
        //     const keyword = this.search.keyword;
        //     if (keyword) {
        //         return list.flat();
        //     } else {
        //         if (selected) {
        //             return list.flat().filter((item) => item.nDlcID === selected);
        //         } else {
        //             return list[index];
        //         }
        //     }
        // },
    },
    mounted() {
        this.getNews();
        this.getVersions().then(() => {
            const versions = this.versions;
            const promiseAll = [];
            versions.forEach((version) => {
                promiseAll.push(this.getList(version.value));
            });
            this.loading = true;
            Promise.all(promiseAll).then((res) => {
                this.loading = false;
                const allList = res.flat();
                this.newsList = allList.flat().filter((item) => this.news.includes(item.dwForceID));
                this.versionList = versions.map((item) => {
                    return {
                        ...item,
                        list: allList.filter((reputation) => reputation.nDlcID === item.value),
                    };
                });
            });
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/reputation/home.less";
</style>
