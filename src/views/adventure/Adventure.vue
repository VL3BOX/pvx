<template>
    <div id="app" class="p-adventure">
        <Header></Header>
        <!-- <Breadcrumb name="奇遇大全" slug="adventure" root="/adventure" :publishEnable="false" :adminEnable="false" :feedbackEnable="true" :crumbEnable="true">
            <img slot="logo" svg-inline :src="getAppIcon('qiyu')" />
        </Breadcrumb> -->
        <LeftSidebar class="m-left"> <Nav></Nav></LeftSidebar>
        <Main :withoutRight="true" :class="$store.state.isCollapse ? 'open' : 'close'">
            <div class="m-main">
                <keep-alive include="adventureList">
                    <router-view></router-view>
                </keep-alive>
            </div>
            <!-- <Footer></Footer> -->
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils";
import { __imgPath, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "App",
    provide: {
        __imgRoot: __imgPath + "adventure/",
        __dataRoot: __dataPath + "pvx/",
    },
    data: function () {
        return {};
    },
    mounted() {},
    computed: {},
    methods: { getAppIcon },
    components: { Nav },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
.m-left {
    top: @header-height;
}
.c-main {
    margin-top: @header-height;
}
</style>
