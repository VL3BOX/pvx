<template>
    <div class="p-homeland">
        <div class="m-buttons">
            <a
                href="javascript:;"
                :class="active === item.value && 'is-active'"
                v-for="item in tabs"
                :key="item.value"
                @click="active = item.value"
                >{{ item.label }}
            </a>
            <a href="https://jx3.xoyo.com/zt/2020/09/24/blueprint/#/" target="_blank">蓝图导入</a>
            <a href="javascript:;" @click="toTip">藏品蓝图</a>
        </div>
        <div class="m-homeland-content">
            <!-- 家园信息 -->
            <Tutorial v-if="active === 0"></Tutorial>
            <!-- 家园地图 -->
            <Maps v-if="active === 1"></Maps>
            <!-- 家园花价 -->
            <Flower v-if="active === 2"></Flower>
            <!-- 家园攻略 -->
            <Bbs v-if="active === 3"></Bbs>
        </div>
    </div>
</template>

<script>
import Tutorial from "./Tutorial.vue";
import Maps from "./Maps.vue";
import Flower from "./Flower.vue";
import Bbs from "./Bbs.vue";
export default {
    name: "Index",
    components: {
        Tutorial,
        Maps,
        Flower,
        Bbs,
    },
    data() {
        return {
            active: 0,
            tabs: [
                {
                    label: "家园信息",
                    value: 0,
                },
                {
                    label: "家园地图",
                    value: 1,
                },
                {
                    label: "家园花价",
                    value: 2,
                },
                {
                    label: "家园攻略",
                    value: 3,
                },
            ],
        };
    },
    methods: {
        toTip() {
            return this.$message({
                type: "success",
                message: "即将上线，敬请期待！",
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/homeland/index.less";
</style>
