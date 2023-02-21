<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb
            name="捏脸妆容"
            slug="share"
            root="/share"
            :publishEnable="false"
            :feedbackEnable="true"
            :crumbEnable="true"
        >
        </Breadcrumb>
        <LeftSidebar><Nav></Nav></LeftSidebar>
        <Main :withoutRight="true">
            <div class="m-main">
                <keep-alive include="shareList">
                    <router-view></router-view>
                </keep-alive>
            </div>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
export default {
    name: "App",
    props: [],
    data: function () {
        return {};
    },
    computed: {},
    components: { Nav },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
</style>
