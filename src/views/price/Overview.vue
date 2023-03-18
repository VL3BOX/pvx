<template>
  <div class="p-overview">
    <div class="m-gold-charts">
      <list-cross :list="currentServerGoldPriceData" :radius="0">
        <template v-slot="data">
          <DataPlane :item="data.item" />
        </template>
      </list-cross>
    </div>
    <div class="m-my-care">
      <div class="u-header">
        <h1 class="u-title">我的关注
          <i class="u-btn el-icon-setting" v-popover:itemPlans title="我的清单"></i>
        </h1>
      </div>
    </div>
    <div class="m-goods-List">
      <div class="goods-group" v-for="group in filterGoodsData" :key="group.id">
        <h1 class="u-title">{{group.label}}</h1>
        <div class="group-list">
          <GoodItem v-for="(item,index) in group.items" :key="index" :data="item" @click="goItemPage(item.item_id)" />
        </div>
      </div>
    </div>
    <el-popover ref="itemPlans" popper-class="m-itemPlans-popper" placement="left-start" title="我的清单" width="200" trigger="click">
      <div class="itemPlans-list">
        <el-checkbox-group v-model="checkList" @change="setMyCare">
          <div class="itemPlans-item" v-for="(item,index) in itemPlans" :key="index">
            <el-checkbox :label="item.id">{{item.title}}</el-checkbox>
          </div>
        </el-checkbox-group>

      </div>
    </el-popover>
  </div>
</template>

<script>
import { axios, realUrl } from "@/service/api.js";
import DataPlane from "./DataPlane.vue";
import { getProfile, getItemPrice } from "@/service/item";
import GoodItem from "./GoodsItem.vue";
import ListCross from "@/components/ListCross.vue";
import { $cms, $helper } from "@jx3box/jx3box-common/js/https";

export default {
    name: "Overview",
    inject: ["pricePage"],
    props: [],
    components: { DataPlane, GoodItem, ListCross },
    data: function () {
        return {
            loading: false,
            myChart: null,
            allGoldPriceData: {}, // 所有服务器金价数据
            allGoodsData: [], // 所有商品数据
            itemPlans: [], // 我的清单
            checkList: [], // 选中的我的清单
        };
    },
    computed: {
        // 由金价数据 得到 的服务器列表
        serverListFromGoldPriceData() {
            return Object.keys(this.allGoldPriceData);
        },
        // 当前服务器,按渠道分组的金价数据
        currentServerGoldPriceData() {
            let sortArr = [];
            const data = this.allGoldPriceData[this.pricePage.server] || {};
            for (const key in data) {
                const list = data[key];
                const lastDay = list[list.length - 1].average.toFixed(2);
                const yesterday = list[list.length - 2].average.toFixed(2);
                const beforeYesterday = list[list.length - 3].average.toFixed(2);
                const sum = list.reduce((total, item) => total + item.average, 0);
                let recommend;
                if (key === "DD373") {
                    recommend = ((+lastDay + +yesterday + +beforeYesterday) / 0.9405 / 3).toFixed(2);
                } else {
                    recommend = ((+lastDay + +yesterday + +beforeYesterday) / 3).toFixed(2);
                }
                sortArr.push({
                    name: key === "WBL" ? "万宝楼" : key,
                    key,
                    sum,
                    recommend,
                    data: [
                        {
                            name: "前日",
                            value: beforeYesterday,
                        },
                        {
                            name: "昨日",
                            value: yesterday,
                        },
                        {
                            name: "今日",
                            value: lastDay,
                        },
                    ],
                });
            }
            sortArr = sortArr.sort((a, b) => b.sum - a.sum);
            if (sortArr.length == 0) sortArr = [{}, {}, {}, {}, {}];
            return sortArr;
        },
        // 经过keyword过滤之后的商品数据
        filterGoodsData() {
            let arr = [];
            let goodsArr = [];
            const keyword = this.pricePage.search.keyword;
            if (keyword) {
                this.allGoodsData.forEach((item) => {
                    goodsArr = item.items.filter((goodsItem) => goodsItem.label.indexOf(keyword) !== -1);
                    if (goodsArr.length > 0) {
                        arr.push({
                            ...item,
                            items: goodsArr,
                        });
                    }
                });
            } else {
                arr = this.allGoodsData;
            }
            return arr;
        },
    },
    watch: {
        "pricePage.server": {
            handler: function (newVal, oldVal) {
                // this.getGoldPriceData();
                this.getGoodsData();
            },
        },
    },
    methods: {
        //  获取金价数据
        getGoldPriceData() {
            this.loading = true;
            return new Promise((resolve, reject) => {
                const priceUrl = "https://spider2.jx3box.com/api/spider/gold/trend";
                axios(priceUrl, "GET", false, {}, {}, {})
                    .then((res) => {
                        this.allGoldPriceData = res;
                    })
                    .catch((err) => {})
                    .finally(() => {
                        this.loading = false;
                        resolve();
                    });
            });
        },
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
        // 将数组转为4个一组的二维数组
        toGroup(arr, num) {
            let newArr = [];
            for (let i = 0; i < arr.length; i += num) {
                newArr.push(arr.slice(i, i + num));
            }
            return newArr;
        },
        goItemPage: function (id) {
            let host = location.origin;
            window.open(`${host}/item/view/${id}`, "_blank");
            sessionStorage.setItem("server_name", this.server);
        },
        // 获取我的关注
        getCareList() {
            $cms()
                .get(`api/cms/user/my/meta`, {
                    params: {
                        key: "focus_price",
                    },
                })
                .then((res) => {});
        },
        // 获取我的清单
        getItemPlans() {
            $helper()
                .get(`api/my/item_plans`, {
                    params: {
                        limit: "10",
                    },
                })
                .then((res) => {
                    this.itemPlans = res.data.data.data || [];
                    console.log(
                        "%c 🥛  this.itemPlans: ",
                        "font-size:20px;background-color: #7F2B82;color:#fff;",
                        this.itemPlans
                    );
                });
        },
        // 设置我关注的清单
        setMyCare() {
            const val = this.checkList;
            $cms()
                .post(
                    `api/cms/user/my/meta`,
                    {
                        val,
                    },
                    {
                        params: {
                            key: "focus_price",
                        },
                    }
                )
                .then((res) => {
                    console.log("%c 🌮 res: ", "font-size:20px;background-color: #4b4b4b;color:#fff;", res);
                });
        },
    },
    created: function () {},
    mounted: function () {
        this.getGoldPriceData();
        this.getGoodsData();
        this.getItemPlans();
        // this.getCareList();
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/price/overview.less";
</style>
<style lang="less">
.m-itemPlans-popper {
    .itemPlans-list {
    }
}
</style>
