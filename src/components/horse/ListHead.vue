<template functional>
  <div class="m-list-head list-sticky-head">
    <div>{{ $t('名称') }}</div>
    <div>{{ $t('类型') }}</div>
    <div>{{ $t('骑乘') }}</div>
    <div>{{ $t('品质等级') }}</div>
    <div>{{ $t('跑速') }}</div>
    <div>{{ $t('喂食饲料') }}</div>
    <div>{{ $t('获取方式') }}</div>
    <div>{{ $t('属性') }}</div>
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
