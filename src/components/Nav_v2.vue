<template>
    <div class="m-pvx-nav" :class="!isCollapse ? 'open' : 'close'">
        <div class="u-img" @click="changeList">
            <img src="@/assets/img/nav/Vector.png" />
        </div>
        <el-menu :collapse="isCollapse" :collapse-transition="true" class="new-el-menu--sidebar">
            <el-menu-item
                v-for="item in clientMenus"
                :key="item.key"
                v-show="item.status"
                :index="item.key"
                :class="{ 'is-active': active == item.key }"
                :style="item.style"
            >
                <a :href="item.path" :target="item.target || '_self'">
                    <!-- <i :class="item.icon"></i> -->
                    <img :src="getNavIcon(item.key)" :alt="item.label" />
                </a>
                <span slot="title" class="u-title">
                    <a :href="item.path" :target="item.target || '_self'"> {{ item.label }}</a></span
                >
            </el-menu-item></el-menu
        >
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
            isCollapse: false,
            menus: [
                {
                    path: "/face",
                    label: "捏脸数据",
                    icon: "el-icon-download",
                    key: "face",
                    status: true,
                    isStd: true,
                    clients: ["std", "origin"],
                },
                {
                    path: "https://jx3.xoyo.com/zt/2020/09/24/blueprint/#/",
                    label: "家园蓝图",
                    icon: "el-icon-download",
                    key: "blueprint",
                    status: true,
                    target: "_blank",
                    clients: ["std", "origin"],
                    style: "margin-bottom:40px",
                },
                {
                    path: "/pet",
                    label: "宠物大全",
                    icon: "el-icon-files",
                    key: "pet",
                    status: true,
                    clients: ["std", "origin"],
                },
                {
                    path: "/adventure",
                    label: "奇遇大全",
                    icon: "el-icon-files",
                    key: "adventure",
                    status: true,
                    clients: ["std"],
                },
                {
                    path: "/horse",
                    label: "坐骑大全",
                    icon: "el-icon-files",
                    key: "horse",
                    status: true,
                    clients: ["std", "origin"],
                },
                {
                    path: "/book",
                    label: "书籍大全",
                    icon: "el-icon-files",
                    key: "book",
                    status: true,
                    clients: ["std", "origin"],
                },
                {
                    path: "/furniture",
                    label: "家具大全",
                    icon: "el-icon-files",
                    key: "furniture",
                    status: true,
                    clients: ["std"],
                },
                {
                    path: "/reputation",
                    label: "声望大全",
                    icon: "el-icon-sugar",
                    key: "reputation",
                    status: true,
                    clients: ["std", "origin"],
                    style: "margin-bottom:40px",
                },
                {
                    path: "/pvg/manufacture",
                    label: "技艺助手",
                    icon: "el-icon-sugar",
                    key: "manufacture",
                    status: true,
                    clients: ["std", "origin"],
                },
                {
                    path: "/pvg/price",
                    label: "价格走势",
                    icon: "el-icon-sugar",
                    key: "price",
                    status: true,
                    clients: ["std"],
                },
            ],
        };
    },
    computed: {
        active: function () {
            let arr = compact(location.pathname?.split("/"));
            // return arr.length > 1 ? arr[1] : arr[0];
            return arr[0];
        },
        client() {
            return location.href.includes("origin") ? "origin" : "std";
        },
        clientMenus() {
            let menus = this.menus.filter((item) => item.clients.indexOf(this.client) != -1);
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
        changeList() {
            this.isCollapse = !this.isCollapse;
            // this.$emit("shrink", this.isCollapse);
            this.$store.commit("toState", { isCollapse: this.isCollapse });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/nav_v2.less";
</style>
