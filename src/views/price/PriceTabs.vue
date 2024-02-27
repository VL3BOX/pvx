<template>
    <div class="m-price-tabs m-common-tabs">
        <template v-for="(tab, index) in tabs">
            <div :key="index" class="u-tab" @click="changeTab(tab)" :class="{ active: params.currentTab == tab.value }">
                {{ tab.label }}
            </div>
        </template>

        <div class="u-search">
            <el-input
                v-if="params.currentTab != 'gold'"
                v-model="params.keywords"
                :placeholder="$t('请输入')"
                suffix-icon="el-icon-search"
                class="u-search-input"
            />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        params: {},
    },
    data() {
        const { t } = this.$i18n;
        return {
            tabs: [
                {
                    label: t('总览'),
                    value: "",
                },
                {
                    label: t('金价'),
                    value: "gold",
                },
                {
                    label: t('物价'),
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
@import "~@/assets/css/common/tabs.less";
.m-price-tabs {
    .u-tab {
        &.active,
        &:hover {
            background-color: @activeColor;
        }
    }
}
</style>
