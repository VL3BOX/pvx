<template>
  <div class="p-price">
    <div class="m-search">
      <PvxSearch ref="search" :items="searchProps" :initValue="initValue" @search="searchEvent($event)"></PvxSearch>
    </div>
    <div class="m-header">
      <h1 class="u-title">{{titleMap[search.type]}}</h1>
      <div class="u-select--round">
        <el-select v-model="server" placeholder="请选择" :default-first-option="true">
          <!-- <div slot="prefix">区服价格</div> -->
          <el-option v-for="server in servers" :key="server" :label="server" :value="server">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="m-body">
      <!-- 总览 -->
      <Overview v-if="search.type === ''" />
      <!-- 金价 -->
      <GoldPrice v-else-if="search.type === 0" />
      <!-- 物价 -->
      <GoodsPrice v-else-if="search.type === 1" />
    </div>
  </div>
</template>

<script>
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
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
                            type: 0,
                            name: "金价",
                        },
                        {
                            type: 1,
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
                0: "金价走势",
                1: "物价走势",
            },
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
            return this.$store.state.client == "origin" ? servers_origin : servers_std;
        },
    },
    methods: {
        // 字段变化
        searchEvent(data) {
            this.search = data; // 更新搜索条件
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/price/index.less";
</style>
