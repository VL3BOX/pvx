<template functional>
    <div class="m-list-head list-sticky-head">
        <div>{{ $t('名称') }}</div>
        <div>{{ $t('类型') }}</div>
        <div>{{ $t('套书') }}</div>
        <div>{{ $t('描述') }}</div>
        <div style="color: #6f42c1">{{ $t('来源') }}</div>
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
