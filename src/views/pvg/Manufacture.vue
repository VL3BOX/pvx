<template>
    <div class="m-manufacture-container">
        <div class="m-manufacture-header">
            <h1 class="u-title">技艺助手</h1>
            <div class="u-settings" v-if="isStd">
                <div class="u-servers">
                    <el-select v-model="server" placeholder="请选择" size="small">
                        <span slot="prefix" class="u-prefix"><i class="el-icon-coin"></i> 价格参考服务器</span>
                        <el-option v-for="item in server_list" :key="item" :label="item" :value="item"> </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="m-manufacture-main">
            <div class="m-manufacture-sidebar">
                <!-- 左侧 & 可制作配方 -->
                <Make class="u-left" />
            </div>
            <div class="m-manufacture-content">
                <!-- 中间 & 配方展示 -->
                <Recipe class="u-middle" />
                <!-- 右侧 & 购物车计算 -->
                <Cart class="u-right" />
            </div>
        </div>
    </div>
</template>

<script>
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

import Recipe from "@/components/manufacture/Recipe.vue";
import Make from "@/components/manufacture/Make.vue";
import Cart from "@/components/manufacture/Cart.vue";

export default {
    name: "Manufacture",
    components: { Make, Recipe, Cart },
    data: function () {
        return {
            server: "蝶恋花",
            craft_key: "",
            item_id: "",
            count: 0,
            cart_list: [],
            cache_data: {},
            my_prices: {},
        };
    },
    computed: {
        // 服务器
        server_list() {
            return this.client == "std" ? servers_std : servers_origin;
        },
        client() {
            return this.$store.state.client;
        },
        isStd() {
            return this.client == "std";
        },
        item() {
            return this.cacheItemData(this.cache_data[this.server][this.item_id]);
        },
        // recipe_props() {
        //     let _data = {
        //         client: this.client,
        //         item_id: this.item_id,
        //         server: this.server,
        //         craft_key: this.craft_key,
        //         my_prices: this.my_prices,
        //     };
        //     if (this.item) _data.item = this.item;
        //     if (this.count) _data.count = this.count;
        //     return _data;
        // },
        // cart_props() {
        //     return {
        //         list: this.cart_list,
        //         server: this.server,
        //         my_prices: this.my_prices,
        //     };
        // },
    },
    methods: {
        // 子组件传值
        // isEmit(data) {
        //     let { id, count, craft_key, my_price, item, del } = data;
        //     this.item_id = id || this.item_id;
        //     this.count = count || 0;
        //     if (craft_key) this.craft_key = craft_key;
        //     if (my_price) this.cachePrice(my_price);
        //     if (item) this.cache_data[this.server][item.ID] = item;
        //     count && item ? this.addToCart(item, count) : "";
        //     if (del) {
        //         del == -1
        //             ? this.cart_list.splice(0, this.cart_list.length)
        //             : (this.cart_list = this.cart_list.filter((item) => item.ID !== del));
        //     }
        // },
        // // 加入购物车
        // addToCart(obj, count) {
        //     this.cart_list.some((item) => item.ID == obj.ID)
        //         ? this.cart_list.forEach((item) => {
        //               if (item.ID == obj.ID) {
        //                   item.children = obj.children;
        //                   item.item.count += count;
        //               }
        //           })
        //         : this.cart_list.push(obj);
        //     this.count = 0;
        // },
        // // 更新已获取过的物品
        // cacheItemData(item) {
        //     if (!item) return;
        //     let data = this.my_prices;
        //     if (data[item.ID]) item.Price = data[item.ID].Price;
        //     item.children = item.children.map((el) => {
        //         if (data[el.id]) el.Price = data[el.id].Price;
        //         return el;
        //     });
        //     return item;
        // },
        // // 更新物品价格
        // cachePrice(my_price) {
        //     this.my_prices[my_price.id] = my_price;
        //     let _prices = this.my_prices;
        //     if (this.cart_list.length)
        //         this.cart_list = this.cart_list.map((item) => {
        //             if (_prices[item.ID]) item.Price = _prices[item.ID].Price;
        //             item.children.map((el) => {
        //                 if (_prices[el.id]) el.Price = _prices[el.id].Price;
        //                 return el;
        //             });
        //             return item;
        //         });
        // },
    },
    watch: {
        server: {
            immediate: true,
            handler: function (val) {
                this.$store.commit("toState", { server: val });
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/manufacture/index.less";
</style>
