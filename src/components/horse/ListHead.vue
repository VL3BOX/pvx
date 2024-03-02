<template functional>
    <div class="m-list-head list-sticky-head">
        <div>{{ parent.$t('名称') }}</div>
        <div>{{ parent.$t('类型') }}</div>
        <div>{{ parent.$t('骑乘') }}</div>
        <div>{{ parent.$t('品质等级') }}</div>
        <div>{{ parent.$t('跑速') }}</div>
        <div>{{ parent.$t('喂食饲料') }}</div>
        <div>{{ parent.$t('获取方式') }}</div>
        <div>{{ parent.$t('属性') }}</div>
    </div>
</template>

<script>
export default {
    name: "ListHead",
};
</script>

<style lang="less">
@import "~@/assets/css/horse/list_head.less";
</style>
