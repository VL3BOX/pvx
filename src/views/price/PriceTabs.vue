<template>
  <div class="m-price-tabs">
    <div class="u-tabs">
      <div class="u-tab" v-for="(tab,index) in tabs" :class="{active:params.currentTab == tab.value}" :key="index" @click="changeTab(tab)">
        <div class="u-tab-label">{{tab.label}}</div>
      </div>
    </div>
    <div class="u-search">
      <el-input v-if="params.currentTab!='gold'" v-model="params.keywords" placeholder="请输入" suffix-icon="el-icon-search" class="u-search-input" />
    </div>
  </div>
</template>
<script>
export default {
    props: {
        params: {},
    },
    data() {
        return {
            tabs: [
                {
                    label: "总览",
                    value: "",
                },
                {
                    label: "金价",
                    value: "gold",
                },
                {
                    label: "物价",
                    value: "goods",
                },
            ],
        };
    },
    watch: {
        // 监听搜索条件变化
        "params.keywords": {
            handler: function (val, oldVal) {
                if (this.params.currentTab === "") {
                    this.params.currentTab = "goods";
                }
            },
            deep: true,
        },
    },
    methods: {
        changeTab(tab) {
            this.params.currentTab = tab.value;
            this.$emit("changeTab", tab.value);
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/price/priceTabs.less";
</style>