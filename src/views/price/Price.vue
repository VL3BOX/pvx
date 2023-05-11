<template>
  <div class="p-price">
    <div class="m-price-search">
      <PvxSearch ref="search" :items="searchProps" :initValue="initValue" @search="searchEvent($event)"></PvxSearch>
    </div>
    <div class="m-price-header">
      <h1 class="u-title">{{titleMap[search.type]}}</h1>
      <div class="u-select--round">
        <el-select v-model="server" placeholder="请选择" :default-first-option="true">
          <div slot="prefix">区服价格</div>
          <el-option v-for="server in server_std" :key="server" :label="server" :value="server">
          </el-option>
        </el-select>
      </div>
      <div class="u-tips" v-if="search.type!='goods'">
        ♥ 请选择正规平台！警惕交易陷阱！部分虚假交易平台会用低价骗取您购买，但充值后又提示该订单已被出售或无货，导致你的钱在一段时间无法及时提现，而且你提现时又要再次收取手续费。
        <span class="strong">单价越高，表示1元能买到更多的金，也就说明金价越便宜喔！</span>
      </div>区别
    </div>
    <div class="m-price-body">
      <!-- 总览 -->
      <Overview v-if="search.type === ''" />
      <!-- 金价 -->
      <GoldPrice v-else-if="search.type === 'gold'" />
      <!-- 物价 -->
      <GoodsPrice v-else-if="search.type === 'goods'" />
    </div>
  </div>
</template>

<script>
import server_std from "@jx3box/jx3box-data/data/server/server_std.json";
import server_cn from "@jx3box/jx3box-data/data/server/server_cn.json";
import PvxSearch from "@/components/PvxSearch.vue";
import Overview from "./Overview.vue"; // 总览组件
import GoldPrice from "./GoldPrice.vue"; // 金价组件
import GoodsPrice from "./GoodsPrice.vue"; // 物价组件
export default {
    name: "PriceIndex",
    props: [],
    provide() {
        return {
            pricePage: this,
        };
    },
    components: { PvxSearch, Overview, GoldPrice, GoodsPrice },
    data: function () {
        return {
            server_std,
            // 金价数据
            goldPrice: {},
            // 我的关注(清单)
            myFollow: [],
            // 热门物品
            hotGoods: [],
            server: "蝶恋花", // 服务器
            // 搜索框配置
            search: {}, // 搜索条件
            // 初始化值
            initValue: {
                type: "",
            },
            searchProps: [
                {
                    key: "type",
                    name: "类型",
                    type: "radio",
                    options: [
                        {
                            type: "",
                            name: "全部",
                        },
                        {
                            type: "gold",
                            name: "金价",
                        },
                        {
                            type: "goods",
                            name: "物价",
                        },
                    ],
                },
                {
                    key: "keyword",
                    name: "关键字",
                },
            ],
            // 渠道颜色映
            colorMap: {
                WBL: "#F8B238",
                UU898: "#AA66FF",
                5173: "#5DA0ED",
                DD373: "#30C7C7",
                7881: "#FF768B",
            },
            titleMap: {
                "": "走势速览",
                gold: "金价走势",
                goods: "物价走势",
            },
            no2replace: true, // 防止searchEvent 初始化触发重定向
        };
    },
    watch: {
        // 监听搜索条件变化
        "search.keyword": {
            handler: function (val, oldVal) {
                if (this.search.type === 0) {
                    this.$refs.search.formData.type = 1;
                }
            },
            deep: true,
        },
    },
    computed: {
        servers: function () {
            if (this.search.type == "gold") {
                return server_cn;
            } else {
                return server_std;
            }
        },
    },
    methods: {
        // 字段变化
        searchEvent(data) {
            this.search = data; // 更新搜索条件
            if (this.no2replace) {
                this.no2replace = false;
                return;
            }
            const query = {};
            if (this.search.type !== "") {
                query.tab = this.search.type;
            }

            this.$router.replace({ path: "/price", query });
        },
    },
    created: function () {
        const tab = this.$route.query.tab;
        if (tab) {
            this.initValue.type = tab;
            this.search.type = tab;
        }
    },
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/price/index.less";
@import "~@/assets/css/app.less";
</style>
