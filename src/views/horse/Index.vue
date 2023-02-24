<template>
    <div class="horse-home-wrapper" v-loading="loading">
        <PvxSearch :items="searchProps" @search="searchEvent($event)"></PvxSearch>
        <div class="list-wrapper">
            <div class="list-item-wrapper" v-for="(list, index) in latelyList" :key="index">
                <div class="title-header">
                    <div class="title">
                        {{
                            searchProps[0].options.find((item) => item.type === index)
                                ? searchProps[0].options.find((item) => item.type === index).name
                                : "全部"
                        }}
                    </div>
                    <router-link :to="`/list?type=${latelyList.length > 1 ? index : currentType}`"
                        >查看全部</router-link
                    >
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
import { getHorses } from "@/service/horse";
import PvxSearch from "@/components/PvxSearch.vue";
import HorseCross from "@/components/horse/HorseCross.vue";
import HorseCard from "@/components/horse/HorseCard";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "HorseHome",
    components: { PvxSearch, HorseCross, HorseCard },
    data() {
        return {
            loading: false,
            query: {
                page: 1,
                pageSize: 20,
                client: this.client,
            },
            currentType: "",
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
            ],
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        latelyList() {
            const listAll = this.listAll;
            const type = this.currentType;
            if (typeof type === "number") {
                return listAll.slice(type, type + 1);
            } else {
                return listAll;
            }
        },
    },
    methods: {
        iconLink,
        getHorses(type) {
            const query = this.query;
            const params = Object.assign({ type: type }, query);
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
        searchEvent(data) {
            this.currentType = data.type;
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
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/index.less";
</style>
