<template>
    <div class="m-share-tabs m-common-tabs">
        <div class="m-common-button">
            <template v-for="item in body_types">
                <div
                    :key="item.value"
                    class="u-tab"
                    @click="clickTabs(item)"
                    :class="{
                        active: item.value == active,
                    }"
                    v-if="item.client && item.client.indexOf(client) != -1"
                >
                    {{ item.label }}
                </div>
            </template>
        </div>

        <div class="u-search">
            <el-input placeholder="输入关键词搜索" v-model="name" suffix-icon="el-icon-search" class="u-search-input" />
        </div>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
export default {
    name: "tabs",
    props: ["body_types", "active"],
    data: function () {
        return {
            name: "",
        };
    },
    computed: {
        params() {
            const _params = {};
            if (this.active) {
                _params.type = this.active;
            }
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
        clickTabs({ value }) {
            // this.active = value;
            this.$emit("setActive", value);
        },
        getThumbnail: function (filename) {
            return __imgPath + "image/adventure/" + filename + ".jpg";
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
<style lang="less">
@import "~@/assets/css/common/tabs.less";
.m-share-tabs {
    .u-tab {
        &.active,
        &:hover {
            background-color: @themeColor;
        }
    }
}
</style>
