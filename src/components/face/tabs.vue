<template>
    <div class="m-face-tabs">
        <div class="u-tabs">
            <div v-for="item in body_types" :key="item.value">
                <div
                    class="u-tab"
                    @click="clickTabs(item)"
                    :class="{
                        active: item.value == active,
                    }"
                    v-if="item.client && item.client.indexOf(client) != -1"
                >
                    <span class="u-tab-label">{{ item.label }}</span>
                </div>
            </div>
        </div>

        <div class="u-filter">
            <el-popover placement="bottom-end" trigger="click" width="90" v-model="filterOpen">
                <div class="m-face-filter">
                    <el-checkbox-button v-model="star" class="u-star">只看精选</el-checkbox-button>
                    <el-checkbox-button v-model="price_type" class="u-star">只看免费</el-checkbox-button>
                    <el-checkbox-button v-model="filter_empty_images" class="u-star">不看无图片</el-checkbox-button>
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

        <div class="u-buttons">
            <a href="/face/facedata" target="_blank">
                <el-button type="primary" size="medium" icon="el-icon-c-scale-to-original" class="u-analysis"
                    >数据解析</el-button
                >
            </a>
            <a :href="publish_link" target="_blank">
                <el-button type="primary" size="medium" class="u-btn" icon="el-icon-edit">发布</el-button>
            </a>
        </div>
    </div>
</template>

<script>
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
export default {
    name: "tabs",
    props: ["body_types", "active"],
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
        publish_link() {
            return publishLink("face");
        },
        params() {
            const _params = {};
            if (this.active) {
                _params.body_type = this.active;
            }
            if (this.star) {
                _params.star = 1;
            }
            if (this.title) {
                _params.title = this.title;
            }
            if (this.price_type) {
                _params.price_type = 0;
            }
            if (this.filter_empty_images) {
                _params.filter_empty_images = true;
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
        test(v) {
            console.log(v);
        },
        getThumbnail: function (filename) {
            return __imgPath + "image/face/" + filename + ".jpg";
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
.m-face-tabs {
    /* 兼容chorme */
    position: -webkit-sticky;
    position: sticky;
    top: 64px;
    z-index: 3;
    background-color: #f3f5f6;
    .flex;
    overflow-x: auto;
    overflow-y: hidden;
    padding:20px 0;

    .u-tabs {
        .flex;
        flex-wrap: nowrap;
    }

    .u-tab {
        .size(100px,40px);
        .flex;
        .flex(x);
        align-items: center;
        .pr;
        .pointer;
        .fz(16px,20px);
        .mr(20px);
        background-color: #fff;
        .r(30px);
        color:#949494;
        &.active,
        &:hover {
            background-color: @faceColor;
            .u-tab-label {
                color: #fff;
            }
        }
    }

    .u-filter {
        .pointer;
        .size(40px);
        .r(30px);
        background-color: #fff;
        &.right {
            .ml(20px);
            .mr(10px);
        }
        svg {
            fill: #949494;
        }
        &:hover {
            background-color: @faceColor;
            i {
                color: #fff;
            }
            svg {
                fill: #fff;
            }
        }
    }

    .u-search {
        .ml(20px);
        .mr(20px);
        .w(100%);
        min-width: 180px;
        flex: 1;
        .u-search-input input {
            border: none;
            background-color: #fff;
            padding: 0 40px 0 20px;
            .r(30px);
            .fz(16px,40px);
            .size(100%,40px);
            color: #000;
            &::placeholder {
                .fz(14px);
                color: #b0b0b0;
            }
        }
    }

    .u-buttons {
        .u-analysis {
            .r(5px);
            .fz(16px);
            font-style: normal;
            .mr(20px);
            background-color: #e54059;
            border-color: #e54059;
        }

        .u-btn {
            .r(5px);
            .w(120px);
            .fz(16px);
            font-style: normal;
            background-color: @faceColor;
            border-color: @faceColor;
        }
    }
}
@media screen and (max-width: 1670px) {
    .m-face-tabs {
        flex-wrap: wrap;
        .u-tabs {
            .mb(20px);
        }
    }
}
@media screen and (max-width: @ipad) {
    .m-face-tabs {
        .u-buttons {
            .none;
        }
    }
}
.m-face-filter {
    text-align: center;
    .u-star {
        .mb(10px);
        .w(100%);
        white-space: nowrap;
        .el-checkbox-button__inner {
            .db;
            .r(30px);
            border: 1px solid #dcdfe6;
            &:hover {
                background-color: @faceColor;
                color: #fff;
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
