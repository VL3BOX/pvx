<template>
    <CommonToolbar search color="#d16400" :types="body_types" @update="updateToolbar"> </CommonToolbar>
</template>

<script>
import CommonToolbar from "@/components/common/toolbar.vue";
export default {
    name: "tabs",
    components: { CommonToolbar },
    props: ["body_types"],
    data: function () {
        return {
            name: "",
        };
    },
    computed: {
        params() {
            const _params = {};
            if (this.name) {
                _params.name = this.name;
            }
            return _params;
        },
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        //切换数据
        clickTabs(value) {
            this.$emit("setActive", value);
        },
        updateToolbar(data) {
            const { type, search } = data;
            this.name = search;
            this.clickTabs(type);
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (obj) {
                this.$emit("change", obj);
            },
        },
    },
};
</script>
