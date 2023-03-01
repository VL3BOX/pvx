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
export default {
    name: "Reputation",
    data: () => ({}),
    components: { Nav, PvxBacktop },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/reputation/reputation.less";
</style>
