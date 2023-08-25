<template>
    <div class="m-face-tabs m-common-tabs">
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

        <div class="u-filter">
            <el-popover placement="bottom-end" trigger="click" width="90" v-model="filterOpen">
                <div class="m-face-filter m-common-filter">
                    <el-checkbox-button v-model="star" class="u-filter">只看精选</el-checkbox-button>
                    <el-checkbox-button v-model="price_type" class="u-filter">只看免费</el-checkbox-button>
                    <el-checkbox-button v-model="filter_empty_images" class="u-filter">不看无图片</el-checkbox-button>
                </div>
                <img svg-inline src="@/assets/img/filter.svg" slot="reference" />
            </el-popover>
        </div>

        <div class="u-search">
            <el-input
                placeholder="请输入搜索内容"
                v-model="title"
                suffix-icon="el-icon-search"
                class="u-search-input"
            />
        </div>

        <a :href="link.data" target="_blank">
            <el-button type="primary" size="medium" icon="el-icon-c-scale-to-original" class="u-analysis">
                数据解析
            </el-button>
        </a>
        <a :href="publish_link(link.key)" target="_blank">
            <el-button type="primary" size="medium" class="u-btn" icon="el-icon-edit">发布</el-button>
        </a>
    </div>
</template>

<script>
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
export default {
    name: "tabs",
    props: ["body_types", "active", "link"],
    data: function () {
        return {
            star: false,
            price_type: false,
            filter_empty_images: true,
            title: "",
            filterOpen: false,
        };
    },
    computed: {
        params() {
            const _params = {};
            if (this.active) _params.body_type = this.active;
            if (this.star) _params.star = 1;
            if (this.title) _params.title = this.title;
            if (this.price_type) _params.price_type = 0;
            if (this.filter_empty_images) _params.filter_empty_images = true;
            return _params;
        },
        client() {
            return this.$store.state.client;
        },
    },

    methods: {
        //切换数据
        clickTabs({ value }) {
            this.$emit("setActive", value);
        },
        getThumbnail: function (filename) {
            return __imgPath + "image/face/" + filename + ".jpg";
        },
        publish_link(key) {
            return publishLink(key);
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

.m-face-tabs {
    .u-tab {
        &.active,
        &:hover {
            background-color: @faceColor;
        }
    }
    .u-filter {
        &:hover {
            background-color: @faceColor;
        }
    }
    .u-analysis {
        .r(5px);
        .fz(16px);
        background-color: #e54059;
        border-color: #e54059;
        &:hover {
            filter: brightness(110%);
        }
    }

    .u-btn {
        .r(5px);
        .w(120px);
        .fz(16px);
        background-color: @faceColor;
        border-color: @faceColor;
        &:hover {
            filter: brightness(110%);
        }
    }
}

.m-face-filter {
    flex-direction: column;
    .u-filter {
        .el-checkbox-button__inner {
            &:hover {
                background-color: @faceColor;
            }
        }
        &.is-checked {
            .el-checkbox-button__inner {
                background-color: @faceColor;
                border-color: @faceColor;
            }
        }
    }
}
</style>
