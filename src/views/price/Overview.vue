<template>
  <div class="p-price-overview">
    <div class="m-overview-gold-charts">
      <list-cross :list="currentServerGoldPriceData" :radius="0" v-if="currentServerGoldPriceData.length">
        <template v-slot="data">
          <DataPlane :item="data.item" />
        </template>
      </list-cross>
    </div>
    <div class="m-my-care">
      <div class="u-header">
        <h1 class="u-title">我的关注
          <i class="u-btn el-icon-setting" v-popover:myPlans title="我的清单"></i>
        </h1>
      </div>
      <div class="u-group-list">
        <GoodItem v-for="(item,index) in careGoods" :key="index" :data="item" @click="goItemPage(item.item_id)" />
      </div>
    </div>
    <div class="m-overview-goods-List">
      <div class="goods-group" v-for="group in filterGoodsData" :key="group.id">
        <h1 class="u-title">{{group.label}}</h1>
        <div class="u-group-list">
          <GoodItem v-for="(item,index) in group.items" :key="index" :data="item" @click="goItemPage(item.item_id)" />
        </div>
      </div>
    </div>
    <el-popover ref="myPlans" popper-class="m-myPlans-popper" placement="left-start" title="我的清单" width="200" trigger="click">
      <div class="myPlans-list" v-loading="loading">
        <el-checkbox-group v-model="carePlansId" @change="setCareList">
          <div class="myPlans-item" v-for="(item,index) in myPlans" :key="index">
            <el-checkbox :label="item.id">{{item.title}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </el-popover>
  </div>
</template>

<script>
import DataPlane from "./DataPlane.vue";
import { getAuctionPrice } from "@/service/manufacture";
import { getGoodsData } from "@/service/item";
import GoodItem from "./GoodsItem.vue";
import ListCross from "@/components/ListCross.vue";
import { axios } from "@/service/api.js";
import { $cms, $helper, $next } from "@jx3box/jx3box-common/js/https";
import { getGoldPriceData, getMyPlans } from "@/service/price.js";
export default {
    name: "Overview",
    inject: ["pricePage"],
    props: [],
    components: { DataPlane, GoodItem, ListCross },
    data: function () {
        return {
            loading: false,
            allGoldPriceData: {}, // 所有服务器金价数据
            allGoodsData: [], // 所有商品数据
            myPlans: [], // 我的清单数据
            carePlansId: [], // 我关注的清单
            carePlansGoodsIds: [], // 关注清单的物品id
            carePlansGoodsData: [], // 关注清单的物品数据
            goodPriceMap: {},
        };
    },
    computed: {
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
            return sortArr;
        },
        // 经过keyword过滤之后的商品数据
        filterGoodsData() {
            let resArr = []; // 过滤之后的商品数据
            let goodsArr = [];
            const keyword = this.pricePage.search.keyword;
            if (keyword) {
                this.allGoodsData.forEach((item) => {
                    goodsArr = item.items.filter((goodsItem) => goodsItem.label.indexOf(keyword) !== -1);
                    if (goodsArr.length > 0) {
                        resArr.push({
                            ...item,
                            items: goodsArr,
                        });
                    }
                });
            } else {
                resArr = this.allGoodsData;
            }
            return resArr;
        },
        careGoods() {
            let list = [];
            this.myPlans
                .filter((item) => this.carePlansId.includes(item.id))
                .forEach((item) => {
                    item.relation.forEach((relation) => {
                        relation.data.forEach((good) => {
                            list.push({
                                ...good,
                                value: this.goodPriceMap[good.id] && this.goodPriceMap[good.id].AvgPrice,
                                label: good.Name,
                                icon: good.IconID,
                            });
                        });
                    });
                });
            list = Array.from(new Set(list));
            return list;
        },
    },
    watch: {
        "pricePage.server": {
            handler: async function () {
                this.getGoodsData(); // 获取商品数据
            },
        },
    },
    methods: {
        // 获取全服金价
        async getGoldPriceData() {
            this.allGoldPriceData = await getGoldPriceData();
        },
        // 获取物品数据
        getGoodsData() {
            getGoodsData({
                server: this.pricePage.server,
                limit: 18,
            }).then((res) => {
                const data = res.data.data || {};
                const list = Object.values(data) || [];
                this.allGoodsData = list;
            });
        },
        // 获取清单数据
        async getPlans() {
            await this.getMyPlans(); // 我的清单
            await this.getCarePlansId(); // 关注的清单id
            this.checkPlans();
            this.getCarePlansGoodsData(); // 获取关注清单中所有物品的id
        },
        // 获取我的清单
        getMyPlans() {
            return new Promise((resolve, reject) => {
                $cms()
                    .get(`api/cms/app/item_plans/mine`, {
                        params: {
                            page: 1,
                            per: 10,
                        },
                    })
                    .then((res) => {
                        const data = res.data.data.list || [];
                        this.myPlans = data;
                        console.log(
                            "%c 🍛 this.myPlans: ",
                            "font-size:20px;background-color: #F5CE50;color:#fff;",
                            this.myPlans
                        );
                        resolve();
                    });
            });
        },
        // 获取关注的清单的id集合
        getCarePlansId() {
            return new Promise((resolve, reject) => {
                $cms()
                    .get(`api/cms/user/my/meta?key=focus_price`)
                    .then((res) => {
                        if (res.data.data) {
                            const data = res.data.data.split(",").map(Number);
                            this.carePlansId = data;
                        } else {
                            this.carePlansId = [];
                        }
                        resolve();
                    });
            });
        },
        // 检查关注的清单是否有效
        checkPlans() {
            const myPlansIdMap = {}; // 我的清单id{}
            this.myPlans.forEach((item) => (myPlansIdMap[item.id] = true));
            const validCareIds = this.carePlansId.filter((id) => myPlansIdMap[id]); // 有效的关注清单id
            if (validCareIds.length !== this.carePlansId.length) {
                console.log("存在无效清单，需要更新关注清单");
                this.carePlansId = validCareIds;
                this.setCareList(); // 更新关注清单
            }
        },
        // 设置关注的清单
        setCareList() {
            const val = this.carePlansId.join(",");
            $cms()
                .post(`api/cms/user/my/meta?key=focus_price`, {
                    val,
                })
                .then((res) => {
                    this.getCarePlansGoodsData(); // 获取关注清单的物品数据
                });
        },
        // 获取关注清单中所有物品的数据
        getCarePlansGoodsData() {
            console.log(
                "%c 🥨  this.careGoods: ",
                "font-size:20px;background-color: #33A5FF;color:#fff;",
                this.careGoods
            );
            const itemIds = this.careGoods.map((item) => item.id);
            $next()
                .get("api/item-price/list", {
                    params: {
                        itemIds: itemIds.join(","),
                        server: this.pricePage.server,
                    },
                })
                .then((res) => {
                    this.goodPriceMap = res.data.data || {};
                });

            // this.getCarePlansGoodsIds().then((res) => {
            //     const goodsIds = res;
            //     const goodsData = [];
            //     const allPromise = [];
            //     goodsIds.forEach((id) => {
            //         const p = getItemPrice({
            //             server: this.pricePage.server,
            //             item_id: id,
            //         });
            //         allPromise.push(p);
            //     });
            //     Promise.all(allPromise).then((resArr) => {
            //         resArr.forEach((item) => {
            //             const data = item.data.data || {};
            //             const list = Object.values(data) || [];
            //             goodsData.push(...list);
            //         });
            //         this.carePlansGoodsData = goodsData;
            //     });
            // });
        },
        // 获取关注清单中所有物品的id
        getCarePlansGoodsIds() {
            return new Promise((resolve, reject) => {
                const carePlansId = this.carePlansId; // 关注的清单id
                const allPromise = [];
                carePlansId.forEach((id) => {
                    const p = $cms().get(`api/cms/app/item_plan/${id}`);
                    allPromise.push(p);
                });
                Promise.all(allPromise).then((resArr) => {
                    const plansInfoArr = resArr.map((item) => item.data.data); // 所有清单集合
                    const subPlansArr = plansInfoArr.map((item) => item.relation); // 所有子清单集合
                    const idSet = new Set(); // 物品id集合
                    for (let i = 0; i < subPlansArr.length; i++) {
                        for (let j = 0; j < subPlansArr[i].length; j++) {
                            const data = subPlansArr[i][j].data;
                            for (let k = 0; k < data.length; k++) {
                                const id = data[k].id;
                                idSet.add(id);
                            }
                        }
                    }
                    const goodsIdArr = Array.from(idSet);
                    this.carePlansGoodsIds = goodsIdArr;
                    const itemIds = this.carePlansGoodsIds.join(",");
                    getAuctionPrice({
                        itemIds,
                        server: this.pricePage.server,
                    });
                    resolve(goodsIdArr);
                });
            });
        },
        // 物品详情页
        goItemPage(id) {
            let host = location.origin;
            window.open(`${host}/item/view/${id}`, "_blank");
            sessionStorage.setItem("server_name", this.server);
        },
    },
    mounted: async function () {
        this.getGoldPriceData();
        this.getGoodsData();

        this.getPlans();
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/price/overview.less";
</style>
