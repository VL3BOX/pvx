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
            versions: [],
            orginList: [],
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
                this.getList(data.dlc, data.keyword)
                    .then((list) => {
                        this.loading = false;
                        const dlcArr = list.map((item) => item.nDlcID);
                        const idArr = list.map((item) => item.dwForceID);
                        const newList = this.versionList
                            .filter((item) => {
                                return dlcArr.includes(item.value);
                            })
                            .map((item) => {
                                const reputations = item.list.filter((reputation) =>
                                    idArr.includes(reputation.dwForceID)
                                );
                                const { label, value } = item;
                                return {
                                    label,
                                    value,
                                    list: reputations,
                                    total: reputations.length,
                                };
                            });
                        this.versionList = newList;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } else {
                this.versionList = this.orginList;
            }
            if (data.dlc) {
                this.loading = true;
                this.getList(data.dlc)
                    .then((list) => {
                        this.loading = false;
                        const dlcArr = list.map((item) => item.nDlcID);
                        const newList = this.versionList.filter((item) => {
                            return dlcArr.includes(item.value);
                        });
                        this.versionList = newList;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } else {
                this.versionList = this.orginList;
            }
        },
        async getNews() {
            return await getBreadcrumb("reputation-newest").then((data) => {
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
                const filterList = versions.map((item) => {
                    return {
                        ...item,
                        list: allList.filter((reputation) => reputation.nDlcID === item.value),
                    };
                });
                this.orginList = filterList;
                this.versionList = filterList;
            });
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/reputation/home.less";
</style>
