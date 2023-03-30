<template>
    <div id="app">
        <Header></Header>
        <!-- <Breadcrumb
            :name="name"
            :slug="slug"
            :root="'/pvg/' + slug"
            :publishEnable="false"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="false"
        >
        </Breadcrumb> -->
        <Nav @statusChange="statusChange"></Nav>
        <Main :class="navStatusClass" :withoutRight="true">
            <div class="m-main">
                <router-view></router-view>
            </div>
            <!-- <Footer></Footer> -->
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/Nav_v3.vue";
export default {
    name: "Index",
    components: {
        Nav,
    },
    data: function () {
        return {
            navStatusClass: "is-regular",
        };
    },
    computed: {
        slug: function () {
            return this.$route.name;
        },
        name: function () {
            return this.$route.meta.name;
        },
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
