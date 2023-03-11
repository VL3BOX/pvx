<template>
    <div class="m-pet-tabs">
        <div class="u-tabs">
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
        </div>
        <!-- 地图筛选 -->
        <div class="u-maps">
            <el-select v-model="mapId" filterable placeholder="宠物地图" popper-class="u-select" clearable>
                <el-option v-for="item in mapList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="u-filter">
            <el-popover
                placement="bottom-end"
                trigger="click"
                width="90"
                v-model="filterOpen"
                popper-class="u-filter-popover"
            >
                <div class="m-pet-filter">
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
        <div class="u-search">
            <el-input placeholder="请输入搜索内容" v-model="title" suffix-icon="el-icon-search" />
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

<style lang="less">
//顶部按钮+搜索区域等
.m-pet-tabs {
    /* 兼容chorme */
    position: -webkit-sticky;
    position: sticky;
    top: 64px;
    z-index: 8;
    background-color: #f3f5f6;
    padding: 20px 0;
    .flex;
    flex-wrap: wrap;
    gap: 20px;
    overflow-x: auto;
    overflow-y: hidden;

    .u-tabs {
        .flex;
        gap: 20px;
    }
    .u-tabs-btn,
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
            background-color: @petColor;
            i {
                color: #fff;
            }
            svg {
                fill: #fff;
            }
        }
    }

    .u-tab-item {
        .size(100px,40px);
        .flex;
        .flex(x);

        align-items: center;
        .pr;
        .pointer;
        .fz(16px,20px);
        background-color: #fff;
        .r(30px);
        // letter-spacing: 5px;
        &.active,
        &:hover {
            background-color: @petColor;
            .u-tabs-span {
                color: #fff;
            }
        }
    }
    .u-maps {
        input {
            .r(30px);
        }
    }
    .u-search {
        // .w(100%);
        min-width: 160px;
        flex: 1;
    }
    .el-input__inner {
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
.m-pet-filter {
    text-align: center;
    .u-source {
        .mb(10px);
        .mr(10px);
        .w(100px);
        white-space: nowrap;
        .el-radio-button__inner {
            .db;
            .r(30px);
            border: 1px solid #e1dfdf;
            background-color: #e1dfdf;
            color: #949494;
            &:hover {
                background-color: @petColor;
                color: #fff;
            }
        }
        &.is-active {
            .el-radio-button__inner {
                background-color: @petColor;
                border-color: @petColor;
                color: #fff;
            }
        }
    }
}
.u-filter-popover {
    width: 240px !important;
}
@media screen and (max-width:@phone){
    .m-pet-tabs{
        .u-maps,.u-search,.u-filter{
            .none;
        }
    }
}
</style>
