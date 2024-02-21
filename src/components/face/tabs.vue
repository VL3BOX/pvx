<template>
    <CommonToolbar class="m-face-tabs" search :types="body_types" @update="updateToolbar">
        <template v-slot:filter>
            <div class="u-filter">
                <el-popover placement="bottom-end" trigger="click" v-model="filterOpen">
                    <div class="m-face-filter m-common-filter">
                        <el-radio-group v-model="is_new_face" v-if="client === 'std'">
                            <el-radio-button class="u-filter" :label="-1">全部</el-radio-button>
                            <el-radio-button class="u-filter" :label="1">写实</el-radio-button>
                            <el-radio-button class="u-filter" :label="0">写意</el-radio-button>
                        </el-radio-group>
                        <p>
                            <el-checkbox-button
                                @click.native="
                                    star = false;
                                    price_type = false;
                                    is_unlimited = false;
                                "
                                :value="star === false && price_type === false && is_unlimited === false"
                                class="u-filter"
                                >全部</el-checkbox-button
                            >
                            <el-checkbox-button v-model="star" class="u-filter">精选</el-checkbox-button>
                            <el-checkbox-button v-model="price_type" class="u-filter">免费</el-checkbox-button>
                            <el-checkbox-button v-model="is_unlimited" class="u-filter">可新建</el-checkbox-button>
                        </p>
                        <el-radio-group v-model="filter_empty_images">
                            <el-radio-button class="u-filter" :label="0">全部</el-radio-button>
                            <el-radio-button class="u-filter" :label="1">有图</el-radio-button>
                        </el-radio-group>
                    </div>
                    <img svg-inline src="@/assets/img/filter.svg" slot="reference" />
                </el-popover>
            </div>
        </template>
        <template v-slot:append>
            <div class="m-toolbar-item m-toolbar-publish">
                <a :href="link.data" target="_blank">
                    <el-button type="primary" size="medium" class="u-analysis"> 数据解析 </el-button>
                </a>
                <a :href="publish_link(link.key)" target="_blank">
                    <div class="u-face-publish">
                        <img svg-inline src="@/assets/img/face/face-publish.svg" class="u-img" />
                        <span>发布作品</span>
                    </div>
                </a>
            </div>
        </template>
    </CommonToolbar>
</template>

<script>
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import CommonToolbar from "@/components/common/toolbar.vue";
export default {
    name: "tabs",
    props: ["body_types", "active", "link"],
    components: { CommonToolbar },
    data: function () {
        return {
            all: true,
            star: false,
            is_unlimited: false,
            price_type: false,
            filter_empty_images: -1,
            is_new_face: -1,
            title: "",
            filterOpen: false,
            isPhone: document.documentElement.clientWidth <= 1024 ? true : false,
        };
    },
    computed: {
        params() {
            const _params = {};
            if (this.active) _params.body_type = this.active;
            if (this.star) _params.star = 1;
            if (this.is_unlimited) _params.is_unlimited = 1;
            if (this.title) _params.title = this.title;
            if (this.price_type) _params.price_type = 0;
            if (this.filter_empty_images) _params.filter_empty_images = true;
            _params.is_new_face = this.is_new_face;
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
        getThumbnail: function (filename) {
            return __imgPath + "image/face/" + filename + ".jpg";
        },
        publish_link(key) {
            return publishLink(key);
        },
        updateToolbar(data) {
            const { type, search } = data;
            this.title = search;
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

<style lang="less">
.m-face-tabs {
    .u-filter {
        .pointer;
        .size(40px);
        .r(30px);
        background-color: #fff;
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
    .u-analysis {
        .r(5px);
        .fz(16px);
        background-color: #e54059;
        border-color: #e54059;
        transition: 0.3s ease-out;
        &:hover {
            filter: brightness(1.1);
        }
    }
    .u-face-publish {
        .pr;
        .pointer;
        .bold;
        .pr(10px);
        .size(120px, 38px);
        .fz(16px, 38px);
        .r(5px);
        background: @faceColor;
        color: #fff;
        span {
            .fr;
        }
        .u-img {
            .pa;
            .lb(0);
            .w(65px);
        }
        &:hover {
            filter: brightness(1.1);
        }
    }
}
.m-face-filter {
    .flex;
    gap: 10px;
    flex-direction: column;
    .u-filter {
        .el-button,
        .el-checkbox-button__inner,
        .el-radio-button__inner {
            margin: 0 10px 0 10px;
            .db;
            .r(30px);
            border: 1px solid #dcdfe6;
            background-color: #e1dfdf;
            &:hover {
                color: #fff;
                background-color: @faceColor;
                border-color: @faceColor;
            }
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background-color: @faceColor;
            border-color: @faceColor;
        }
        .el-checkbox-button__inner {
            white-space: nowrap;
            transition: 0.3s ease-out;
            &:hover {
                background-color: @faceColor;
                color: #fff;
            }
        }
        &.is-checked {
            .el-checkbox-button__inner {
                border-color: @faceColor;
                background-color: @faceColor;
                color: #fff;
            }
        }
    }
}
@media screen and (max-width: @ipad) {
    .m-face-tabs {
        .m-toolbar-publish {
            order: -1;
            justify-content: space-between;
        }
    }
}
@media screen and (max-width: @phone) {
    .m-face-tabs .m-toolbar-item {
        &.m-toolbar-publish {
            a:first-child {
                order: 2;
            }
        }
    }
}
</style>
