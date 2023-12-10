<template>
    <div class="m-face-tabs m-common-tabs">
        <template v-if="isPhone">
            <div class="m-box">
                <a :href="link.data" target="_blank">
                    <el-button type="primary" size="medium" class="u-analysis">
                        数据解析
                    </el-button>
                </a>
                <a :href="publish_link(link.key)" target="_blank">
                    <div class="u-face-publish" style="float: right">
                        <img svg-inline src="@/assets/img/face/face-publish.svg" class="u-img" />
                        <span>发布作品</span>
                    </div>
                </a>
            </div>
        <div class="m-box">
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

        <div class="m-box">
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

            <div class="u-search">
                <el-input
                    placeholder="请输入搜索内容"
                    v-model="title"
                    suffix-icon="el-icon-search"
                    class="u-search-input"
                />
            </div>
        </div>
        </template>
        <template v-else>
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

                <div class="u-search">
                    <el-input
                        placeholder="请输入搜索内容"
                        v-model="title"
                        suffix-icon="el-icon-search"
                        class="u-search-input"
                    />
                </div>
                <a :href="link.data" target="_blank">
                    <el-button type="primary" size="medium" class="u-analysis">
                        数据解析
                    </el-button>
                </a>
                <a :href="publish_link(link.key)" target="_blank">
                    <div class="u-face-publish">
                        <img svg-inline src="@/assets/img/face/face-publish.svg" class="u-img" />
                        <span>发布作品</span>
                    </div>
                </a>
        </template>
    </div>
</template>

<script>
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import { isPhone } from "@/utils";
export default {
    name: "tabs",
    props: ["body_types", "active", "link"],
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
            isPhone: isPhone()
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
    }
};
</script>

<style lang="less">
@import "~@/assets/css/common/tabs.less";

.m-face-tabs {
    overflow: visible;
    .m-box {
        .flex;
        .w(100%);
        .r(10px);
        box-sizing: border-box;
        gap: 10px;
        flex-wrap: wrap;
        padding: 10px 15px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    .u-tab {
        transition: 0.3s ease-out;

        &.active,
        &:hover {
            background-color: @faceColor;
            color: #fff;
        }
    }
    .u-filter {
        transition: 0.3s ease-out;
        &:hover {
            background-color: @faceColor;
            color: #fff;
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

    .u-btn {
        .r(5px);
        .w(120px);
        .fz(16px);
        background-color: @faceColor;
        border-color: @faceColor;
        transition: 0.3s ease-out;
        &:hover {
            filter: brightness(1.1);
        }
    }
}

.m-face-filter {
    flex-direction: column;
    .u-filter {
        .el-checkbox-button__inner {
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
</style>
