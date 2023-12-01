<template>
    <div class="m-pet-tabs m-common-tabs">
        <div class="m-common-card">
            <template v-for="item in types">
                <div :key="item.type" class="u-tab" @click="clickTabs(item)" :class="item.class == active && 'active'">
                    {{ item.name }}
                </div>
            </template>
        </div>

        <!-- 地图筛选 -->
        <div class="m-common-card">
            <div class="u-maps">
                <el-select v-model="mapId" filterable placeholder="宠物地图" popper-class="u-select" clearable>
                    <el-option v-for="item in mapList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!-- <div class="u-maps">
                <el-select v-model="mapId" filterable placeholder="宠物地图" popper-class="u-select" clearable>
                    <el-option v-for="item in mapList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div> -->
            <!-- 
            <div class="u-map">
                <el-radio-group v-model="petSource" class="m-pet-filter m-common-filter">
                    <el-radio-button
                        class="u-filter"
                        v-for="(item, index) in Source"
                        :key="'laiyuan' + index"
                        :label="item.source"
                        size="mini"
                        >{{ item.name }}</el-radio-button
                    >
                </el-radio-group>
            </div> -->
        </div>

        <div class="u-search m-common-card">
            <el-input
                placeholder="请输入搜索内容"
                v-model="title"
                suffix-icon="el-icon-search"
                class="u-search-input"
            />
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

<style lang="less">
@import "~@/assets/css/common/tabs.less";
.m-pet-tabs {
    .u-tab {
        &.active,
        &:hover {
            background-color: @petColor;
        }
    }
    .u-filter {
        &:hover {
            background-color: @petColor;
        }
    }
    .u-maps {
        flex-shrink: 0;
        input {
            .r(30px);
        }
    }
}

.m-pet-filter {
    // .u-filter {
    //     .w(100px);
    //     .el-radio-button__inner {
    //         &:hover {
    //             background-color: @petColor;
    //             color: #fff;
    //         }
    //     }
    //     &.is-active {
    //         .el-radio-button__inner {
    //             background-color: @petColor;
    //             border-color: @petColor;
    //             color: #fff;
    //         }
    //     }
    // }
}
.u-filter-popover {
    width: 220px !important;
}
</style>
