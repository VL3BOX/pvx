<template>
    <div class="m-share-tabs">
        <div class="u-tabs">
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
            <div class="u-tabs-search">
                <el-input placeholder="请输入搜索内容" v-model="name" suffix-icon="el-icon-search" class="u-search" />
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
        test(v) {
            console.log(v);
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
