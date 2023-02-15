<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb name="坐骑大全" slug="horse" root="/horse" :feedbackEnable="true" :crumbEnable="true">
            <img slot="logo" svg-inline :src="getAppIcon('horse')" />
        </Breadcrumb>
        <LeftSidebar><Nav></Nav></LeftSidebar>
        <Main :withoutRight="true">
            <div class="m-main">
                <keep-alive include="HorseList">
                    <router-view></router-view>
                </keep-alive>
            </div>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils";
import { __imgPath,__dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Horse",
    provide : {
        __imgRoot : __imgPath + 'homeland/',
        __dataRoot : __dataPath + 'pvx/'
    },
    data: function () {
        return {};
    },
    computed: {},
    methods: { getAppIcon },
    components: { Nav },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
</style>
