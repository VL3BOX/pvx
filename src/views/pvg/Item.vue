<template>
    <div class="m-item_price m-price-header">
        <div class="m-header">
            <h1 class="u-title">物价大全</h1>
            <el-select class="u-servers" v-model="server" placeholder="请选择服务器" size="small">
                <span slot="prefix" class="u-prefix"><i class="el-icon-coin"></i> 价格参考服务器</span>
                <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
            </el-select>
        </div>
        <div class="m-search">
            <!-- @keyup.enter.native="search_data" -->
            <el-input class="u-search" placeholder="请输入搜索内容" v-model="search" size="mini">
                <span slot="prepend">关键词</span>
                <el-button slot="append" icon="el-icon-search" @click="search_data"></el-button>
            </el-input>
        </div>

        <div class="m-price-list" v-if="groups && groups.length && isEmpty">
            <!-- <div v-for="i in 2" :key="'wrapper' + i"> -->
            <el-row class="m-item" :gutter="30" v-for="(group, key) in groups" :key="key">
                <div :span="24" class="u-group-title" v-text="group.label"></div>
                <el-col :span="6" v-for="(item, k) in group.items" :key="k">
                    <!-- :href="`http://localhost:6090/item/view/${item.item_id}`" target="_blank"  -->
                    <div @click="goItemPage(item.item_id)" v-if="item" class="u-item" :class="`u-item-${key}`">
                        <div class="u-icon">
                            <img :src="icon_url(item.icon)" />
                        </div>
                        <div class="u-content">
                            <span class="u-name">
                                <span v-text="item.label"></span>
                            </span>
                            <span class="u-price">
                                <span class="u-trending" :class="showItemTrendingClass(item)">{{
                                        showItemTrending(item)
                                }}</span>
                                <template v-if="item.sub_days_0_price">
                                    <span>今日：</span>
                                    <GamePrice :price="item.sub_days_0_price" />
                                </template>
                                <template v-else-if="!item.sub_days_0_price && item.sub_days_1_price">
                                    <span>昨日：</span>
                                    <GamePrice :price="item.sub_days_1_price" />
                                </template>
                                <template v-else-if="
                                    !item.sub_days_0_price && !item.sub_days_1_price && item.sub_days_2_price
                                ">
                                    <span>前日：</span>
                                    <GamePrice :price="item.sub_days_2_price" />
                                </template>
                                <span v-else>暂无价目</span>
                            </span>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <!-- </div> -->
        </div>
        <div class="m-price-empty" v-else>
            <el-alert class="u-alert" title="没有对应的物品" type="info" center show-icon @close="close_alert"></el-alert>
        </div>
    </div>
</template>

<script>
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";
import User from "@jx3box/jx3box-common/js/user";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";

import { getProfile, getItemPrice } from "@/service/item";

export default {
    name: "ItemPrice",
    data() {
        return {
            groups: [],
            allGroups: [],
            server: "蝶恋花",
            loading: false,
            search: "",
        };
    },
    computed: {
        servers: function () {
            return this.$store.state.client == "origin" ? servers_origin : servers_std;
        },
        client: function () {
            return this.$store.state.client;
        },
        isEmpty: function () {
            return this.groups.some((item) => item);
        },
        link: function () {
            return __Root;
        },
    },
    components: {
        GamePrice,
    },
    methods: {
        // 获取星标物品
        get_data() {
            if (!this.server) return;
            this.loading = true;
            getItemPrice({
                server: this.server,
                limit: 18,
            })
                .then((data) => {
                    data = data.data;
                    const arr = Object.values(data.data) || []
                    this.groups = arr;
                    this.allGroups = arr;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        goItemPage: function (id) {
            let host = location.origin;
            window.open(`${host}/item/view/${id}`, "_blank");
            sessionStorage.setItem('server_name', this.server)
        },
        //搜索物品
        search_data() {
            let arr = []
            let goodsArr = []
            if (this.search) {
                this.allGroups.forEach(item => {
                    goodsArr = item.items.filter(goodsItem => goodsItem.label.indexOf(this.search) !== -1)
                    if (goodsArr.length > 0) {
                        arr.push({
                            ...item,
                            items: goodsArr
                        })
                    }
                })
            } else {
                arr = this.allGroups
            }
            this.groups = arr
            // this.groups = this.search ? this.allGroups.map(item => {
            //     return {
            //         ...item,
            //         items: item.items.filter(goodsItem => goodsItem.label.indexOf(this.search) !== -1)
            //     }
            // }) : this.allGroups
        },
        //关闭提示框
        close_alert() {
            this.search = ''
        },
        icon_url: function (id) {
            return iconLink(id, this.client);
        },

        showItemTrending: function (item) {
            if (item.sub_days_0_price && item.sub_days_1_price) {
                if (item.sub_days_0_price - item.sub_days_1_price > 0) {
                    return "▲";
                } else if (item.sub_days_0_price - item.sub_days_1_price < 0) {
                    return "▼";
                } else {
                    return "";
                }
            }
        },
        showItemTrendingClass: function (item) {
            if (item.sub_days_0_price && item.sub_days_1_price) {
                if (item.sub_days_0_price - item.sub_days_1_price > 0) {
                    return "up";
                } else if (item.sub_days_0_price - item.sub_days_1_price < 0) {
                    return "down";
                } else {
                    return "keep";
                }
            }
        },
        iconLink,
    },
    watch: {
        server: {
            immediate: true,
            handler() {
                this.get_data();
            },
        },
        search: {
            immediate: true,
            handler(val, oldval) {
                console.log(val, oldval);
                this.search_data();
            },
            deep: true,
        },
    },
    mounted: function () {
        if (User.isLogin() && this.$store.state.client == "std") {
            getProfile().then((data) => {
                if (data) {
                    this.server = data.jx3_server || "斗转星移";
                }
            });
        } else {
            this.server = "斗转星移";
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/manufacture/item_price.less";
</style>
