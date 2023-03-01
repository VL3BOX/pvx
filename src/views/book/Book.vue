<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb name="书籍大全" slug="book" :publishEnable="true" :feedbackEnable="true" :crumbEnable="false">
        </Breadcrumb>
        <LeftSidebar>
            <Nav></Nav>
        </LeftSidebar>
        <Main :withoutRight="true" :withoutLeft="hasSidebar">
            <div class="m-main">
                <router-view />
            </div>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/book/nav.vue";

export default {
    name: "Book",
    components: { Nav },
    data: () => ({
        defaultExpandedKeys: ["book"],
        active: "",
    }),
    computed: {
        hasSidebar: function () {
            return this.$route.meta.sidebar;
        },
        routeName: function () {
            return this.$route.name;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
</style>
