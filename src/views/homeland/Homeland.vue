<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb
            name="家园建设"
            slug="homeland"
            root="/homeland"
            :publishEnable="false"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="false"
        >
            <img slot="logo" svg-inline :src="getAppIcon('furniture')" />
        </Breadcrumb>
        <LeftSidebar><Nav></Nav></LeftSidebar>
        <Main :withoutRight="true">
            <div class="m-main">
                <router-view></router-view>
            </div>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils";
import { __imgPath, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "App",
    props: [],
    provide: {
        __imgRoot: __imgPath + "homeland/",
        __dataRoot: __dataPath + "pvx/",
    },
    data: function () {
        return {};
    },
    computed: {},
    methods: { getAppIcon },
    components: {
        Nav,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
</style>
