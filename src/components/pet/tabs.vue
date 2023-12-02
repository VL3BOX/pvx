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
        <div class="m-common-card m-maps-card">
            <el-select v-model="mapId" filterable class="u-select" clearable>
                <el-option label="全部地图" value=""></el-option>
                <el-option v-for="item in mapList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
                <template #prefix> 地图 </template>
            </el-select>
            <el-select v-model="petSource" filterable class="u-select" clearable>
                <el-option
                    v-for="(item, index) in Source"
                    :key="'laiyuan' + index"
                    :label="item.name"
                    :value="item.source"
                >
                </el-option>
                <template #prefix> 来源 </template>
            </el-select>
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
    .m-common-card .u-select {
        .el-input__suffix {
            .none;
        }
        input {
            .r(30px);
        }
    }
    .el-input__prefix {
        .lh(40px);
        padding: 0 10px;
    }
    .el-input__prefix,
    .el-input__suffix {
        color: #b0b0b0;
        &::placeholder {
            color: #b0b0b0;
        }
    }
    .is-focus .el-input__prefix {
        color: #d16400;
    }
    .el-input__inner {
        .pl(60px);
    }
    .m-maps-card {
        flex-wrap: nowrap;
    }
}
@media screen and (max-width: @phone) {
    .m-pet-tabs {
        .m-common-card .u-select {
            .el-input__prefix,
            .el-input__suffix {
                .none;
            }
            .el-input__inner {
                padding: 0 20px;
            }
        }
    }
}
</style>
