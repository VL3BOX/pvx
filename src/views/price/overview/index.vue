<template>
  <div class="p-price-overview">
    <div class="m-price-overview-header">
      <div class="u-title">走势速览</div>
      <div class="u-servers">
        <el-select v-model="server" placeholder="请选择" :default-first-option="true" @change="serverChange">
          <div slot="prefix">区服价格</div>
          <el-option v-for="server in server_cn" :key="server" :label="server" :value="server">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="m-price-overview-body">
      <goldCharts :server="server" v-if="server" />
      <goods ref="goods" :server="server" v-if="server" />
    </div>
  </div>
</template>
<script>
import server_cn from "@jx3box/jx3box-data/data/server/server_cn.json";
import { getUserInfo } from "@/service/price.js"; // 系统关注物品类型
import goods from "./goods.vue";
import goldCharts from "./goldCharts.vue";
import User from "@jx3box/jx3box-common/js/user";
export default {
    components: { goods, goldCharts },
    data() {
        return {
            server_cn,
            server: "",
        };
    },
    methods: {
        serverChange() {
            this.$nextTick(() => {
                this.$refs.goods.updatePrice();
            });
        },
    },
    created() {
        if (User.isLogin()) {
            getUserInfo().then((res) => {
                this.server = res.data?.data?.jx3_server || "梦江南";
            });
        } else {
            this.server = "梦江南";
        }
    },
};
</script>
<style lang="less" >
@import "~@/assets/css/price/overview.less";
</style>