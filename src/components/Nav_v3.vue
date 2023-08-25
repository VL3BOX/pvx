<template>
    <aside class="m-pvx-aside" :class="navStatusClass">
        <a class="u-home" :class="active === 'pvx' && 'is-active'" href="/pvx">
            <img src="@/assets/img/nav/home.svg" svg-inline />
        </a>
        <div class="m-pvx-nav">
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
import menus from "@/assets/data/menus.json";
export default {
    name: "Nav",
    props: [],
    components: {},
    data: function () {
        return {
            menus: menus,
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
            let str = arr[0];
            if (str === "pvg") str = arr[1];
            if (str === "homeland") str = "blueprint";
            if (str === "body") str = "exterior";
            return str;
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
                                if (el.key == "blueprint") return false;
                                if (el.key == "exterior") return false;
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
