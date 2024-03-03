<template>
    <aside class="m-pvx-aside" :class="navStatusClass">
        <div class="u-home-wrap" :class="active === 'pvx' && 'is-active'">
            <span class="u-open" v-if="navStatus !== 2" @click="toRight">
                <img src="@/assets/img/nav/open.svg" svg-inline />
            </span>
            <span class="u-close" v-if="navStatus === 2" @click="toLeft">
                <img src="@/assets/img/nav/fold.svg" svg-inline class="u-icon" />
            </span>
            <a v-if="navStatus === 2" class="u-home" :class="active" href="/pvx">
                <img src="@/assets/img/nav/home.svg" svg-inline class="u-icon" />
            </a>
            <span class="u-setting is-disabled" v-if="navStatus === 2">
                <img src="@/assets/img/nav/setting.svg" svg-inline />
            </span>
        </div>
        <div class="m-pvx-nav" v-if="clientMenus.length">
            <div class="m-nav-group" :class="group.key" v-for="group in clientMenus" :key="group.key">
                <div
                    class="m-nav-item"
                    v-for="item in group.submenus"
                    :key="item.key"
                    :class="[{ 'is-active': active == item.key }, item.key]"
                    v-show="item.status"
                >
                    <a :href="item.path" :target="item.target || '_self'">
                        <div class="u-nav-icon">
                            <img svg-inline :src="require(`../assets/img/nav/${item.key}.svg`)" class="u-icon" />
                            <img svg-inline :src="require(`../assets/img/nav/${item.key}2.svg`)" class="u-icon-hover" />
                        </div>

                        <span>{{ $t(item.label) }}</span> <!-- i18n:assets/data/menus -->
                    </a>
                    <div v-show="navStatus === 1" class="u-nav-label">{{ $t(item.label) }}</div> <!-- i18n:assets/data/menus -->
                </div>
            </div>
        </div>
        <div class="u-btn" v-if="!navStatus" @click="toRight">
            <img src="../assets/img/nav/op.svg" svg-inline />
        </div>
        <div class="u-btn" v-if="navStatus" @click="toLeft">
            <img src="../assets/img/nav/left.svg" svg-inline />
        </div>
        <!-- <div class="u-btn" :class="navStatus === 2 && 'is-disabled'" @click="toRight">
                <i class="el-icon-arrow-right"></i>
            </div> -->
    </aside>
</template>

<script>
import { compact } from "lodash";
import menus from "@/assets/data/menus.json";
export default {
    name: "Nav_V4",
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
            return this.$store.state.client;
        },
        clientMenus() {
            let menus = this.menus;
            if (this.client !== "std") {
                menus = menus
                    .map((item) => {
                        // if (item.index == "4") return false;
                        item.submenus = item.submenus
                            .map((el) => {
                                // if (el.key == "adventure") return false;
                                // if (el.key == "furniture") return false;
                                // if (el.key == "blueprint") return false;
                                // if (el.key == "exterior") return false;
                                if (el.isStd) return false;
                                return el;
                            })
                            .filter(Boolean);
                        return item;
                    })
                    .filter(Boolean);
            }
            return menus;
        },
        storeNavStatus() {
            return ~~sessionStorage.getItem("navStatus") || 1;
        },
    },
    watch: {
        navStatusClass: {
            immediate: true,
            handler(navStatusClass) {
                this.$emit("statusChange", navStatusClass);
            },
        },
        navStatus: {
            handler(navStatus) {
                sessionStorage.setItem("navStatus", navStatus);
            },
        },
        storeNavStatus: {
            immediate: true,
            handler(val) {
                this.navStatus = val;
            },
        },
    },
    methods: {
        toLeft() {
            if (this.navStatus === 2) {
                this.navStatus = 0;
            } else if (this.navStatus > 0) {
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
@import "~@/assets/css/nav_v4.less";
</style>
