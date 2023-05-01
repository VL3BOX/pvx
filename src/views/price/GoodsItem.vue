<template>
  <div class="m-goodsItem" v-on="$listeners">
    <img :src="icon_url(data.icon)" class="goods-logo" />
    <div class="goods-info">
      <div class="info-name" v-text="data.label"></div>
      <div class="info-price">
        <template v-if="data.sub_days_0_price">
          <GamePrice :price="data.sub_days_0_price" />
        </template>
        <template v-else-if="!data.sub_days_0_price && data.sub_days_1_price">
          <GamePrice :price="data.sub_days_1_price" />
        </template>
        <template v-else-if="!data.sub_days_0_price && !data.sub_days_1_price && data.sub_days_2_price">
          <GamePrice :price="data.sub_days_2_price" />
        </template>
        <div v-else class="is-null">暂无价目</div>
      </div>
    </div>
  </div>
</template>
<script>
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

export default {
    props: ["data"],
    components: { GamePrice },
    methods: {
        icon_url: function (id) {
            return iconLink(id, this.client);
        },
    },
};
</script>
<style lang="less" scoped>
.m-goodsItem {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 384px;
    height: 100px;
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;

    gap: 20px;
    .goods-logo {
        overflow: hidden;
        width: 60px;
        height: 60px;
        background: #000;
        border-radius: 10px;
    }
    .goods-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
        padding: 0;

        gap: 7px;
        .info-name {
            font-size: 18px;
            font-weight: bold;
            line-height: 32px;
        }
        .info-price {
            display: flex;
            justify-content: flex-end;
            width: 100%;
            font-size: 16px;
            font-weight: bold;
            line-height: 26px;

            .is-null{
                color:#999;
                font-weight: normal;
                .fz(12px);
            }
        }
    }
}
</style>
