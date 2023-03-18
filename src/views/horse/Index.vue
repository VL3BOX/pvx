<template>
    <div class="horse-home-wrapper" v-loading="loading">
        <PvxSearch :items="searchProps" @search="searchEvent($event)"></PvxSearch>
        <div class="list-wrapper">
            <div class="list-item-wrapper" v-for="(list, index) in listAll" :key="index">
                <div class="title-header">
                    <div class="title">
                        {{
                            searchProps[0].options.find((item) => item.type === index)
                                ? searchProps[0].options.find((item) => item.type === index).name
                                : "全部"
                        }}
                    </div>
                    <a href="javascript:;" @click="toList(index)">查看全部</a>
                    <!-- <router-link :to="`/list?type=${index}`">查看全部</router-link> -->
                </div>
                <horse-cross :list="list">
                    <template v-slot="data">
                        <HorseCard :item="data.item"></HorseCard>
                    </template>
                </horse-cross>
            </div>
        </div>
    </div>
</template>

<script>
import { getHorses, getFeeds, getAttrs } from "@/service/horse";
import PvxSearch from "@/components/PvxSearch.vue";
import HorseCross from "@/components/horse/HorseCross.vue";
import HorseCard from "@/components/horse/HorseCard";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { deleteNull } from "@/utils/index";
export default {
    name: "HorseHome",
    components: { PvxSearch, HorseCross, HorseCard },
    data() {
        return {
            loading: false,
            query: {
                page: 1,
                pageSize: 20,
            },
            listAll: [],
            searchProps: [
                {
                    key: "type",
                    name: "类型",
                    type: "radio",
                    options: [
                        {
                            type: "",
                            name: "全部",
                        },
                        {
                            type: 0,
                            name: "普通坐骑",
                        },
                        {
                            type: 1,
                            name: "奇趣坐骑",
                        },
                        {
                            type: 2,
                            name: "马具",
                        },
                    ],
                },
                {
                    type: "filter",
                    key: "filter",
                    name: "过滤",
                    options: [
                        {
                            key: "feed",
                            type: "checkbox",
                            name: "喂食饲料",
                            options: [],
                        },
                        {
                            key: "attr",
                            type: "checkbox",
                            name: "属性",
                            options: [],
                        },
                    ],
                },
                {
                    key: "keyword",
                    name: "名称/ID",
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
        iconLink,
        getHorses(type) {
            const query = this.query;
            const params = Object.assign({ type: type }, query);
            params.client = this.client;
            return new Promise((resole, reject) => {
                getHorses(params)
                    .then((res) => {
                        let newList = res.data.list.map((item) => {
                            if (item.MagicAttributes && item.MagicAttributes.length) {
                                item.MagicAttributes.map((mItem) => {
                                    mItem.iconUrl = this.iconLink(mItem.icon);
                                    return mItem;
                                });
                            }
                            return item;
                        });
                        resole(newList);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        async getFeedList() {
            await getFeeds({ client: this.client }).then((res) => {
                const arr = res.data.map((item) => {
                    const start = item.tip.indexOf("【");
                    const end = item.tip.indexOf("】");
                    item.feed = item.tip.slice(start + 1, end);
                    return item;
                });
                this.feeds = JSON.parse(JSON.stringify(arr));
                const newArr = [];
                arr.forEach((item) => {
                    const index = newArr.findIndex((nItem) => nItem.feed === item.feed);
                    if (index > -1) {
                        newArr[index].id += "," + item.id;
                    } else {
                        newArr.push(item);
                    }
                });

                const options = newArr.map((item) => {
                    return {
                        label: item.feed,
                        value: item.id,
                    };
                });
                this.searchProps[1].options[0].options = options;
            });
        },
        async getAttrList() {
            await getAttrs({ client: this.client }).then((res) => {
                const data = res.data;
                const options = data.map((item) => {
                    return {
                        label: item.name,
                        value: item.name,
                    };
                });
                this.searchProps[1].options[1].options = options;
            });
        },
        searchEvent(data) {
            const newData = Object.assign({}, data);
            if (Object.keys(deleteNull(newData)).length) {
                this.$router.push({ name: "list", params: deleteNull(newData) });
            }
        },
        toList(type) {
            this.$router.push({ name: "list", params: { type } });
        },
    },
    mounted() {
        const type0 = this.getHorses(0),
            type1 = this.getHorses(1),
            type2 = this.getHorses(2);
        this.loading = true;
        Promise.all([type0, type1, type2])
            .then((data) => {
                this.loading = false;
                this.listAll = data;
            })
            .catch(() => {
                this.loading = false;
            });
        this.getAttrList();
        this.getFeedList();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/index.less";
</style>
