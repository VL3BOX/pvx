<template>
    <div class="m-share-tabs">
        <div class="u-tabs p-animation fadeInDown">
            <!-- <div class="u-tabs-btn">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="u-tabs-btn right">
                <i class="el-icon-arrow-right"></i>
            </div> -->
            <div v-for="item in body_types" :key="item.value">
                <div
                    class="u-tab-item"
                    @click="clickTabs(item)"
                    :class="{
                        active: item.value == active,
                    }"
                    v-if="item.client && item.client.indexOf(client) != -1"
                >
                    <!-- <img class="u-icon-img" :src="getThumbnail(item.label)" :alt="item.label" /> -->
                    <span class="u-tabs-span">{{ item.label }}</span>
                </div>
            </div>

            <div class="u-tabs-filter">
                <el-popover placement="bottom-end" trigger="click" width="90" v-model="filterOpen">
                    <div class="u-tabs-marks">
                        <el-checkbox-button v-model="star" class="u-star">只看精选</el-checkbox-button>
                        <el-checkbox-button v-model="price_type" class="u-star">只看免费</el-checkbox-button>
                        <el-checkbox-button v-model="filter_empty_images" class="u-star">不看无图片</el-checkbox-button>
                    </div>
                    <img svg-inline src="@/assets/img/filter.svg" slot="reference" />
                </el-popover>
            </div>
            <div class="u-tabs-search">
                <el-input placeholder="请输入搜索内容" v-model="title" suffix-icon="el-icon-search" class="u-search" />
            </div>
            <div class="u-right-btn">
                <a href="/publish/#/face">
                    <el-button type="primary" size="medium" class="u-btn" icon="el-icon-edit">发布</el-button>
                </a>
            </div>
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
