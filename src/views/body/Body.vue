<template>
    <div id="app">
        <Header></Header>
        <Nav @statusChange="statusChange"></Nav>
        <Main :class="navStatusClass" :withoutRight="true">
            <div class="m-main"><router-view></router-view></div>
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/Nav_v3.vue";
export default {
    name: "Body",
    components: { Nav },
    data: function () {
        return { navStatusClass: "is-regular" };
    },
    methods: {
        statusChange(navStatusClass) {
            this.navStatusClass = navStatusClass;
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/app.less";
</style>
