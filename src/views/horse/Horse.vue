<template>
    <div id="app">
        <Header></Header>
        <LeftSidebar><Nav></Nav></LeftSidebar>
        <Main :withoutRight="true">
            <div class="m-main">
                <router-view></router-view>
            </div>
            <PvxBacktop color="#fff" bgColor="#d16400"></PvxBacktop>
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import PvxBacktop from "@/components/PvxBacktop.vue";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils";
import { __imgPath, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Horse",
    provide: {
        __imgRoot: __imgPath + "homeland/",
        __imgRoot2: __imgPath + "horse/",
        __dataRoot: __dataPath + "pvx/",
    },
    data: function () {
        return {};
    },
    computed: {},
    methods: { getAppIcon },
    components: { Nav, PvxBacktop },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/horse/horse.less";
</style>
