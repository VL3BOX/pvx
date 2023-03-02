<template>
    <div class="m-pvx-nav">
        <RightSideMsg>
            <em>休闲交流群</em> :
            <strong>
                <a href="https://jq.qq.com/?_wv=1027&k=utHr10Tl">658035079</a>
            </strong>
        </RightSideMsg>

        <el-menu :default-openeds="client == 'std' ? ['1', '2', '3', '4'] : ['1', '2', '3']">
            <el-submenu :index="group.index" v-for="group in clientMenus" :key="group.key">
                <template slot="title">{{ group.label }}</template>
                <el-menu-item-group>
                    <el-menu-item
                        v-for="item in group.submenus"
                        :key="item.key"
                        :class="{ 'is-active': active == item.key }"
                        v-show="item.status"
                    >
                        <a :href="item.path" :target="item.target || '_self'">
                            <!-- <i :class="item.icon"></i> -->
                            <img :src="getNavIcon(item.key)" :alt="item.label" />
                            <span>{{ item.label }}</span>
                        </a>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
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
                            path: "/pvg/item_price",
                            label: "价格走势",
                            icon: "el-icon-sugar",
                            key: "item_price",
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
        };
    },
    computed: {
        active: function () {
            let arr = compact(location.pathname?.split("/"));
            return arr.length > 1 ? arr[1] : arr[0];
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
    },
};
</script>

<style lang="less">
@import "~@/assets/css/nav.less";
</style>
