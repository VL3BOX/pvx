<template>
    <aside class="m-pvx-aside" :class="navStatusClass">
        <div class="u-home-wrap" :class="active === 'pvx' && 'is-active'">
            <span class="u-open" v-if="navStatus !== 2" @click="toRight">
                <img src="@/assets/img/nav/open.svg" svg-inline />
            </span>
            <span class="u-close" v-if="navStatus === 2" @click="toLeft">
                <img src="@/assets/img/nav/fold.svg" svg-inline />
            </span>
            <a v-if="navStatus === 2" class="u-home" href="/pvx">
                <img :src="require(`@/assets/img/nav/home${active === 'pvx' ? '' : '1'}.svg`)" svg-inline />
            </a>
            <span class="u-setting is-disabled" v-if="navStatus === 2">
                <img src="@/assets/img/nav/setting.svg" svg-inline />
            </span>
        </div>
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
                        <img
                            class="u-nav-icon"
                            :src="getNavIcon(item.key, active == item.key)"
                            svg-inline
                            :alt="item.label"
                        />
                        <span>{{ item.label }}</span>
                    </a>
                    <div v-show="navStatus === 1" class="u-nav-label">{{ item.label }}</div>
                </div>
            </div>
        </div>
        <template v-if="navStatus !== 2">
            <div class="u-btn" v-if="!navStatus" @click="toRight">
                <img src="../assets/img/nav/op.svg" svg-inline />
            </div>
            <div class="u-btn" v-if="navStatus" @click="toLeft">
                <img src="../assets/img/nav/left.svg" svg-inline />
            </div>
        </template>
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
        getNavIcon(key, isActive) {
            let name = key + (this.navStatus ? this.navStatus : "1");
            if (this.navStatus === 1 && isActive) {
                // regular
                name = key + "2";
            }
            console.log(name);
            return require(`../assets/img/nav/${name}.svg`);
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
@import "~@/assets/css/nav_v4.less";
</style>
