<template functional>
    <div class="m-list-head list-sticky-head">
        <div>{{ parent.$t('名称') }}</div>
        <div>{{ parent.$t('类型') }}</div>
        <div>{{ parent.$t('套书') }}</div>
        <div>{{ parent.$t('描述') }}</div>
        <div style="color: #6f42c1">{{ parent.$t('来源') }}</div>
    </div>
</template>

<script>
export default {
    name: "ListHead",
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/book/result/list_head.less";
</style>
