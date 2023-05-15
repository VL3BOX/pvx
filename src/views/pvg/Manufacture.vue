<template>
    <div class="m-manufacture">
        <div class="m-manufacture-header">
            <span v-for="(item, i) in craftList" :key="i" @click="changeCraft(i)">{{ item.name }}</span>
            <el-input class="u-input" v-model.lazy="search" :placeholder="`搜索${craftName}配方`">
                <el-button slot="prepend" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div class="m-manufacture-body">
            <!-- 配方 -->
            <div class="m-manufacture-box">
                <div class="m-manufacture-server">{{ server }}</div>
                <Recipe :list="showList" :craftKey="craftKey" :server="server" />
            </div>

            <!-- 成本计算器 -->
            <!-- 我的清单 -->
        </div>
    </div>
</template>

<script>
import { getCraftJson, getManufactures } from "@/service/manufacture";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import { craft_types } from "@/assets/data/manufacture.json";
// import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

import Recipe from "@/components/manufacture/Recipe.vue";
// import Make from "@/components/manufacture/Make.vue";
// import Cart from "@/components/manufacture/Cart.vue";

export default {
    name: "Manufacture",
    components: { Recipe },
    data: function () {
        return {
            craftList: [],
            search: "",
            craftName: "",
            index: -1,
            showList: [],
            craftKey: "",
            craftTypes: craft_types,
            server: "蝶恋花",
            // craft_key: "",
            // item_id: "",
            // count: 0,
            // cart_list: [],
            // cache_data: {},
            // my_prices: {},
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        isStd() {
            return this.client == "std";
        },
        serverList() {
            return this.isStd ? servers_std : servers_origin;
        },
    },
    methods: {
        // 获取数据
        load() {
            getCraftJson()
                .then((res) => {
                    const { std, origin } = res.data;
                    this.craftList = this.client == "std" ? this.toCraftList(std) : this.toCraftList(origin);
                    if (this.craftList.length) this.index = 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取配方列表 && 合并入配方分类
        loadList(type, index) {
            getManufactures({ client: this.client, type, mode: "simple" }).then((res) => {
                // 配方分类
                const list = this.craftList[index].list;
                // 配方数据进行分组
                const data = res.data.reduce((acc, cur) => {
                    acc[cur.Belong] ? acc[cur.Belong].push(cur) : (acc[cur.Belong] = [cur]);
                    return acc;
                }, {});

                // 合并数据配方分类
                this.showList = list
                    .map((item) => {
                        if (data[item.BelongID]) item.list = data[item.BelongID];
                        return item;
                    })
                    .filter((item) => item.list);
                this.craftKey = type;
            });
        },
        // 处理技艺列表
        toCraftList(data) {
            const type = this.craftTypes[this.client];
            // 1. 将列表按ProfessionID分类
            const craftData = data.reduce((acc, cur) => {
                acc[cur.ProfessionID] ? acc[cur.ProfessionID].push(cur) : (acc[cur.ProfessionID] = [cur]);
                return acc;
            }, {});

            // 2.为分类添加name和key值
            return type.map((item) => {
                if (craftData[item.ProfessionID]) item.list = craftData[item.ProfessionID];
                return item;
            });
        },
        // 切换技艺
        changeCraft(i) {
            this.index = i;
        },
    },

    watch: {
        index(i) {
            const { name, key } = this.craftList[i];
            this.craftName = name;
            this.loadList(key, i);
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/manufacture/new_index.less";
</style>
