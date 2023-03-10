<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb name="家具大全" slug="furniture" root="/furniture" :feedbackEnable="true" :crumbEnable="false">
            <img slot="logo" svg-inline :src="getAppIcon('furniture')" />
        </Breadcrumb>
        <LeftSidebar><Nav></Nav></LeftSidebar>
        <Main :withoutRight="true">
            <div class="m-main">
                <keep-alive include="FurnitureList">
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
    name: "Furniture",
    props: [],
    data: function () {
        return {

        };
    },
    provide : {
        __imgRoot : __imgPath + 'homeland/',
        __dataRoot : __dataPath + 'pvx/'
    },
    computed: {},
    methods: { getAppIcon },
    components: { Nav },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
</style>
