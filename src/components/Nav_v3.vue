<template>
    <aside class="m-pvx-aside" :class="navStatusClass">
        <router-link class="u-home" to="/">
            <img src="@/assets/img/nav/home.svg" svg-inline />
        </router-link>
        <div class="m-pvx-nav">
            <el-scrollbar>
                <div class="m-nav-group" :class="group.key" v-for="group in clientMenus" :key="group.key">
                    <div
                        class="m-nav-item"
                        v-for="item in group.submenus"
                        :key="item.key"
                        :class="[{ 'is-active': active == item.key }, item.key]"
                        v-show="item.status"
                    >
                        <a :href="item.path" :target="item.target || '_self'">
                            <img class="u-nav-icon" :src="getNavIcon(item.key)" :alt="item.label" />
                            <span>{{ item.label }}</span>
                            <i v-show="navStatus === 2 && active == item.key" class="el-icon-caret-left"></i>
                        </a>
                        <div v-show="navStatus === 1" class="u-nav-label">{{ item.label }}</div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="u-btns">
            <div class="u-btn" :class="navStatus === 0 && 'is-disabled'" @click="toLeft">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="u-btn" :class="navStatus === 2 && 'is-disabled'" @click="toRight">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
    </aside>
</template>

<script>
import { compact } from "lodash";
export default {
    name: "Nav",
    props: [],
    components: {},
    data: function () {
        return {
            menus: [
                {
                    key: "share",
                    label: "策勋",
                    index: "1",
                    submenus: [
                        {
                            path: "/face",
                            label: "捏脸数据",
                            icon: "el-icon-download",
                            key: "face",
                            status: true,
                            isStd: true,
                        },
                        {
                            path: "https://jx3.xoyo.com/zt/2020/09/24/blueprint/#/",
                            label: "家园蓝图",
                            icon: "el-icon-download",
                            key: "blueprint",
                            status: true,
                            target: "_blank",
                        },
                        // {
                        //     path: "/share/facedata",
                        //     label: "妆容解析",
                        //     icon: "el-icon-setting",
                        //     key: "facedata",
                        //     status: true,
                        // },
                    ],
                },

                {
                    key: "rare",
                    label: "珍奇",
                    index: "2",
                    submenus: [
                        {
                            path: "/pet",
                            label: "宠物大全",
                            icon: "el-icon-files",
                            key: "pet",
                            status: true,
                        },
                        {
                            path: "/adventure",
                            label: "奇遇大全",
                            icon: "el-icon-files",
                            key: "adventure",
                            status: true,
                        },
                        {
                            path: "/horse",
                            label: "坐骑大全",
                            icon: "el-icon-files",
                            key: "horse",
                            status: true,
                        },
                        {
                            path: "/book",
                            label: "书籍大全",
                            icon: "el-icon-files",
                            key: "book",
                            status: true,
                        },
                        {
                            path: "/furniture",
                            label: "家具大全",
                            icon: "el-icon-files",
                            key: "furniture",
                            status: true,
                        },
                        {
                            path: "/reputation",
                            label: "声望大全",
                            icon: "el-icon-sugar",
                            key: "reputation",
                            status: true,
                        },
                        // {
                        //     path: "/exterior",
                        //     label: "外观大全",
                        //     icon: "el-icon-setting",
                        //     key: "exterior",
                        //     status: false,
                        // },
                    ],
                },

                {
                    key: "merchants",
                    label: "商贾",
                    index: "3",
                    submenus: [
                        {
                            path: "/pvg/manufacture",
                            label: "技艺助手",
                            icon: "el-icon-sugar",
                            key: "manufacture",
                            status: true,
                        },
                        {
                            path: "/pvg/price",
                            label: "价格走势",
                            icon: "el-icon-sugar",
                            key: "price",
                            status: true,
                        },
                        {
                            path: "/pvg/gonggao",
                            label: "活动告示",
                            icon: "el-icon-sugar",
                            key: "gonggao",
                            status: true,
                        },
                    ],
                },

                // {
                //     key: "homeland",
                //     label: "家园",
                //     index: "4",
                //     submenus: [
                // {
                //     path: "/homeland/tutorial",
                //     label: "家园建设",
                //     icon: "el-icon-reading",
                //     key: "tutorial",
                //     status: true,
                // },
                // {
                //     path: "/homeland/maps",
                //     label: "家园地图",
                //     icon: "el-icon-map-location",
                //     key: "maps",
                //     status: true,
                // },
                // {
                //     path: "/homeland/flower",
                //     label: "家园花价",
                //     icon: "el-icon-sunny",
                //     key: "flower",
                //     status: true,
                // },
                // ],
                // },
            ],
            navStatus: 1,
        };
    },
    computed: {
        isPhone() {
            return document.documentElement.clientWidth <= 768;
        },
        navStatusClass() {
            let text = "";
            const navStatus = this.navStatus;
            if (navStatus === 0) {
                text = "is-closed";
            } else if (navStatus === 1) {
                text = "is-regular";
            } else {
                text = "is-opened";
            }
            return text;
        },
        active: function () {
            let arr = compact(location.pathname?.split("/"));
            return arr[0];
        },
        client() {
            return location.href.includes("origin") ? "origin" : "std";
        },
        clientMenus() {
            let menus = this.menus;
            if (this.client !== "std") {
                menus = menus
                    .map((item) => {
                        if (item.index == "4") return false;
                        item.submenus = item.submenus
                            .map((el) => {
                                if (el.key == "adventure") return false;
                                if (el.key == "furniture") return false;
                                if (el.key == "tutorial") return false;
                                if (el.key == "item_price") return false;
                                return el;
                            })
                            .filter(Boolean);
                        return item;
                    })
                    .filter(Boolean);
            }
            return menus;
        },
    },
    watch: {
        navStatusClass: {
            immediate: true,
            handler(navStatusClass) {
                this.$emit("statusChange", navStatusClass);
            },
        },
    },
    methods: {
        getAppLink: function (appKey) {
            let isDev = location.hostname == "localhost";
            if (isDev) {
                return `/${appKey}/`;
            } else {
                return `/pvx/${appKey}`;
            }
        },
        getNavIcon(key) {
            return require(`../assets/img/nav/${key}.png`);
        },
        toLeft() {
            if (this.navStatus > 0) {
                this.navStatus--;
            }
        },
        toRight() {
            if (this.navStatus < 2) {
                this.navStatus++;
            }
        },
    },
    mounted() {
        if (this.isPhone) {
            this.navStatus = 0;
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/nav_v3.less";
</style>
