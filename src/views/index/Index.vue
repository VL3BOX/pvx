<template>
    <div class="p-index">
        <div class="m-index-category" v-for="(menu, index) in menus" :key="index" :class="'index' + index">
            <div class="u-index-category-title">
                {{ $t(menu.label) }} <!-- i18n:assets/data/menus -->
            </div>
            <div class="m-child-category-list">
                <a
                    :href="submenu.path"
                    class="m-child-category"
                    :class="'child-' + index"
                    v-for="(submenu, i) in menu.submenus"
                    :target="submenu.target || '_self'"
                    :key="i"
                >
                    <img :src="getNavIcon(submenu.key)" class="u-img" :alt="$t(submenu.label)" /> <!-- i18n:assets/data/menus -->
                    <span class="u-text">{{ $t(submenu.label) }}</span> <!-- i18n:assets/data/menus -->
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import menus from "@/assets/data/menus.json";
export default {
    name: "Index",
    data() {
        return {
            menus,
        };
    },
    computed: {},
    methods: {
        getNavIcon(key) {
            return require(`@/assets/img/nav/${key}2.svg`);
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/index.less";
</style>
