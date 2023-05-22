<template>
    <div class="m-manufacture">
        <div class="m-manufacture-header">
            <span
                :class="['u-craft', item.name == craftName ? 'active' : '']"
                v-for="(item, i) in craftList"
                :key="i"
                @click="changeCraft(i)"
                >{{ item.name }}</span
            >
            <el-input
                class="u-input"
                v-model.lazy="search"
                :placeholder="`搜索${craftName}配方`"
                suffix-icon="el-icon-search"
            >
            </el-input>
        </div>
        <div class="m-manufacture-body">
            <!-- 配方 -->
            <div class="m-manufacture-box">
                <div class="m-manufacture-title">
                    <span class="u-title">{{ craftName }}</span>
                    <el-select class="m-server" v-model="server" placeholder="请选择" size="small">
                        <span slot="prefix" class="u-prefix"> 区服价格</span>
                        <el-option v-for="item in serverList" :key="item" :label="item" :value="item"> </el-option>
                    </el-select>
                </div>
                <Recipe
                    :list="search ? searchList : showList"
                    :craftKey="craftKey"
                    :server="server"
                    @addCartItem="addCartItem"
                />
            </div>
            <!-- 成本计算器 -->
            <Cart :data="cartItem" :server="server" />

            <!-- 我的清单 -->
            <MyList />
        </div>
    </div>
</template>

<script>
import { getCraftJson, getManufactures } from "@/service/manufacture";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import { craft_types } from "@/assets/data/manufacture.json";

import Recipe from "@/components/manufacture/Recipe.vue";
import Cart from "@/components/manufacture/Cart.vue";
import MyList from "@/components/manufacture/MyList.vue";

export default {
    name: "Manufacture",
    components: { Recipe, Cart, MyList },
    data: function () {
        return {
            craftList: [],
            search: "",
            searchList: [],
            craftName: "",
            index: -1,
            showList: [],
            craftKey: "",
            craftTypes: craft_types,
            server: "蝶恋花",
            cartItem: {},
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
        // 选择新添配方
        addCartItem(item) {
            this.cartItem = item;
        },
    },

    watch: {
        index(i) {
            const { name, key } = this.craftList[i];
            this.craftName = name;
            this.loadList(key, i);
        },
        search(key) {
            let list = [];
            this.showList.forEach((item) => {
                item.list.forEach((_list) => {
                    if (_list.Name.includes(key)) list.push(_list);
                });
            });
            this.searchList = [{ BelongName: "搜索结果", list }];
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
.m-manufacture-header {
    .flex;
    gap: 20px;
    padding: 20px 0 40px 0;
    .u-craft {
        .size(100px,40px);
        .r(30px);
        .fz(16px);
        .bold;
        .lh(40px);
        .x;
        .pointer;
        padding: 0 10px;
        background-color: #fff;
        letter-spacing: 1px;
        &.active {
            background-color: #07ad36;
            color: #fff;
        }
    }
    .u-input {
        .w(420px);

        .el-input__inner {
            .r(20px);
            padding: 0 20px;
        }
        .el-input__suffix {
            right: 15px;
        }
    }
}
.m-manufacture-body {
    .flex;
    gap: 20px;
}
.m-manufacture-title {
    .flex;
    .pb(20px);
    gap: 20px;
    .u-title {
        .bold;
        .fz(32px);
        .lh(40px);
        .color(#24292e);
    }
    .m-server {
        background: #fff;
        .r(20px);
        .el-input {
            .w(120px);
            .pl(85px);
        }
        .el-input__inner {
            .fz(16px);
            .r(20px);
            .bold;
            .x;
            .h(40px);
            .lh(40px);
            color: #24292e;
            border: 0;
            padding: 0 22px 0 0;
        }
        .u-prefix {
            .db;
            .lh(40px);
            .bold;
            .fz(16px);
            .x;
            cursor: default;
            color: #909399;
            padding: 0 0 0 15px;
            white-space: nowrap;
        }
    }
}
</style>
