<template>
    <div class="m-pet-tabs">
        <div class="u-tabs">
            <!-- <div class="u-tabs-btn">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="u-tabs-btn right">
                <i class="el-icon-arrow-right"></i>
            </div> -->
            <div v-for="item in types" :key="item.type">
                <div
                    class="u-tab-item"
                    @click="clickTabs(item)"
                    :class="{
                        active: item.class == active,
                    }"
                >
                    <!-- <img class="u-icon-img" :src="getThumbnail(item.label)" :alt="item.label" /> -->
                    <span class="u-tabs-span">{{ item.name }}</span>
                </div>
            </div>
            <!-- 地图筛选 -->
            <div class="u-mapList">
                <el-select v-model="mapId" filterable placeholder="宠物地图" popper-class="u-select" clearable>
                    <el-option v-for="item in mapList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="u-tabs-filter">
                <el-popover
                    placement="bottom-end"
                    trigger="click"
                    width="90"
                    v-model="filterOpen"
                    popper-class="u-filter-popover"
                >
                    <div class="u-tabs-marks">
                        <el-radio-group v-model="petSource">
                            <el-radio-button
                                class="u-source"
                                v-for="(item, index) in Source"
                                :key="'laiyuan' + index"
                                :label="item.source"
                                size="mini"
                                >{{ item.name }}</el-radio-button
                            >
                        </el-radio-group>
                    </div>
                    <img svg-inline src="@/assets/img/filter.svg" slot="reference" />
                </el-popover>
            </div>
            <div class="u-tabs-search">
                <el-input placeholder="请输入搜索内容" v-model="title" suffix-icon="el-icon-search" class="u-search" />
            </div>
        </div>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
export default {
    name: "tabs",
    props: ["types", "Source", "active", "mapList"],
    data: function () {
        return {
            petSource: "",
            title: "",
            mapId: "",
            filterOpen: false,
        };
    },
    computed: {
        params() {
            const _params = {};
            if (this.active) {
                _params.Class = this.active;
            }
            if (this.petSource) {
                _params.Source = this.petSource;
            }
            if (this.title) {
                _params.Name = this.title;
            }
            if (this.mapId) {
                _params.map = this.mapId;
            }
            return _params;
        },
    },
    methods: {
        //切换数据
        clickTabs(item) {
            // this.active = value;
            this.$emit("setActive", item.class);
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
