<template>
    <div class="m-common-toolbar">
        <slot name="prefix"></slot>
        <div class="m-toolbar-item">
            <div class="u-item" v-for="(item, i) in types" :key="i" @click="changeType(item.value)">
                {{ item.label }}
            </div>
        </div>
        <slot name="prepend"></slot>
        <div class="m-toolbar-item" v-if="search">
            <slot name="filter"></slot>
            <div class="u-search">
                <el-input
                    placeholder="请输入搜索内容"
                    v-model="title"
                    suffix-icon="el-icon-search"
                    class="u-search-input"
                />
            </div>
        </div>
        <slot name="append"></slot>
    </div>
</template>

<script>
export default {
    name: "toolbar",
    props: {
        types: {
            type: Array,
            default: () => [],
        },
        search: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            type: "",
            title: "",
        };
    },
    computed: {
        params() {
            const _params = {
                type: this.type,
            };
            if (this.title) _params.search = this.title;
            return _params;
        },
    },

    methods: {
        changeType(type) {
            this.type = type;
        },
    },
    watch: {
        types: {
            immediate: true,
            handler: function (list) {
                if (list && list.length) this.type = list[0].value;
            },
        },
        params: {
            deep: true,
            handler: function (obj) {
                this.$emit("update", obj);
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/toolbar.less";
</style>
