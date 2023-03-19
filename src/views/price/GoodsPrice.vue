<template>
  <div class="m-goodsPrice">
    <!-- <div class="m-my-care">
      <h1 class="u-title">我的关注</h1>
    </div> -->
    <div class="m-goods-List">
      <div class="goods-group" v-for="group in allGoodsData" :key="group.id">
        <h1 class="u-title">{{group.label}}</h1>
        <div class="group-list">
          <GoodItem v-for="(item,index) in group.items" :key="index" :data="item" @click="goItemPage(item.item_id)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodItem from "./GoodsItem.vue";
import { getItemPrice } from "@/service/item";
export default {
    name: "GoodsPrice",
    inject: ["pricePage"],
    components: { GoodItem },
    data: function () {
        return {
            allGoodsData: {}, // 所有商品数据
        };
    },
    methods: {
        // 获取商品数据
        getGoodsData() {
            this.loading = true;
            return new Promise((resolve, reject) => {
                getItemPrice({
                    server: this.pricePage.server,
                    limit: 18,
                })
                    .then((res) => {
                        const data = res.data.data || {};
                        let list = Object.values(data) || [];
                        this.allGoodsData = list;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            });
        },
    },
    mounted: function () {
        this.getGoodsData();
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/price/goodsPrice.less";
</style>