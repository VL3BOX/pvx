<template>
    <div id="app" class="p-body">
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
        return {};
    },
    computed: {},
    methods: {},
};
</script>
