<template>
    <div id="app" class="p-pet">
        <Header></Header>
        <!-- <Breadcrumb name="宠物大全" slug="pet" root="/pet" :feedbackEnable="true" :crumbEnable="true">
            <img slot="logo" svg-inline :src="getAppIcon('pet')" />
        </Breadcrumb> -->
        <LeftSidebar><Nav></Nav></LeftSidebar>
        <Main :withoutRight="true">
            <div class="m-main">
                <keep-alive include="PetList">
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
    name: "Pet",
    provide: {
        __imgRoot: __imgPath + "pet/",
        __dataRoot: __dataPath + "pvx/",
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
.c-main {
    .mt( @header-height);
}
.c-sidebar-left {
    top: @header-height;
}
.m-main {
    min-height: calc(100vh - @header-height);
}
</style>
