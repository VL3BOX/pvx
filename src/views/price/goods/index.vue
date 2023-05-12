<template>
  <div class="p-price-goods">
    <div class="m-price-goods-header">
      <div class="u-title">物价总览</div>
      <div class="u-servers">
        <el-select v-model="server" placeholder="请选择" :default-first-option="true" @change="updatePrice">
          <div slot="prefix">区服价格</div>
          <el-option v-for="server in server_std" :key="server" :label="server" :value="server">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="m-price-goods-body">
      <div class="m-my-follow-goods">
        <div class="u-title">我的关注
          <i v-if="myFollowData.length" class="u-btn el-icon-setting" v-popover:myPlans title="设置清单" @click="openAddDialog"></i>
        </div>
        <div class="m-empty-follow" v-if="myFollowData.length==0">
          <div class="m-empty-follow-title" v-loading="loading">
            暂无关注
            <span class="m-empty-follow-add" @click="openAddDialog">去添加</span>
          </div>
        </div>
        <myGoodList v-else :data="myFollowPlanFilter" :priceMap="priceMap"></myGoodList>
      </div>
      <div class="m-system-goods">
        <div class="u-title">系统关注</div>
        <systemGoodList :data="systemGoodsDataFilter" :priceMap="priceMap"></systemGoodList>
      </div>
    </div>
    <myGoodsDialog v-if="showMyGoods" @close="showMyGoods=false" :myFollowData="myFollowData" @setMyFollowList="setMyFollowList"></myGoodsDialog>
  </div>
</template>
<script>
import server_std from "@jx3box/jx3box-data/data/server/server_std.json";
import systemGoodsType from "./systemGoodsType.json";
import {
    getSystemGoodsData,
    getServerPriceData,
    getUserInfo,
    getMyFollowList,
    setMyFollowList,
    getMyGoodsDetail,
} from "@/service/price.js"; // 系统关注物品类型
import systemGoodList from "./systemGoodList.vue";
import myGoodList from "./myGoodList.vue";
import myGoodsDialog from "./myGoodsDialog.vue";
import User from "@jx3box/jx3box-common/js/user";

export default {
    props: { keywords: {} },
    components: { systemGoodList, myGoodsDialog, myGoodList },
    data() {
        return {
            server_std,
            server: "梦江南",
            systemGoodsType,
            systemGoodsData: [], // 系统关注物品
            priceMap: {}, // 物品id和价格的映射
            myFollowData: [], // 我的关注清单id
            myFollowPlan: [], // 我的关注清单
            showMyGoods: false,
            loading: false,
        };
    },
    computed: {
        myFollowPlanFilter() {
            let data = JSON.parse(JSON.stringify(this.myFollowPlan));
            if (this.keywords) {
                data.forEach((item) => {
                    item.relation.forEach((item2) => {
                        item2.data = item2.data.filter((item3) => {
                            return item3.Name && item3.Name.indexOf(this.keywords) > -1;
                        });
                    });
                });
            }
            data = data.filter((item) => {
                return item.relation.some((item2) => {
                    return item2.data.length > 0;
                });
            });

            return data;
        },
        systemGoodsDataFilter() {
            let data = JSON.parse(JSON.stringify(this.systemGoodsData));
            if (this.keywords) {
                data.forEach((item) => {
                    item.items = item.items.filter((item2) => {
                        return item2.label && item2.label.indexOf(this.keywords) > -1;
                    });
                });
            }
            data = data.filter((item) => {
                return item.items.length > 0;
            });
            return data;
        },
    },
    methods: {
        getSystemGoodsData() {
            getSystemGoodsData().then((res) => {
                this.systemGoodsData = res.data.data;
                this.getServerPriceData();
            });
        },
        getServerPriceData() {
            const flatList = [];
            this.systemGoodsData.forEach((group) => {
                group.items.forEach((item) => {
                    flatList.push(item.item_id);
                });
            });
            const itemIds = flatList.join(",");
            getServerPriceData({
                itemIds,
                server: this.server,
            }).then((res) => {
                this.priceMap = Object.assign({}, this.priceMap, res.data.data);
            });
        },
        getMyFollowList() {
            this.loading = true;
            getMyFollowList().then((res) => {
                if (res.data.data) {
                    this.myFollowData = res.data.data.split(",").map((item) => +item);
                } else {
                    this.myFollowData = [];
                }
                const allPromises = [];
                this.myFollowData.forEach((id) => {
                    const p = getMyGoodsDetail(id);
                    allPromises.push(p);
                });
                Promise.all(allPromises).then((res) => {
                    this.myFollowPlan = res.map((item) => {
                        return item.data.data;
                    });
                    this.getMyFollowGoodsPrice();
                });
                this.loading = false;
            });
        },
        getMyFollowGoodsPrice() {
            const ids = [];
            const idsMap = {};
            this.myFollowPlan.forEach((plan) => {
                plan.relation.forEach((item) => {
                    item.data.forEach((good) => {
                        const id = good.id;
                        if (this.priceMap[id] == undefined && idsMap[id] == undefined) {
                            ids.push(id);
                            idsMap[id] = true;
                        }
                    });
                });
            });
            const itemIds = ids.join(",");
            getServerPriceData({
                itemIds,
                server: this.server,
            }).then((res) => {
                this.priceMap = Object.assign({}, this.priceMap, res.data.data);
            });
        },
        openAddDialog() {
            this.showMyGoods = true;
        },
        setMyFollowList(val) {
            setMyFollowList({ val }).then((res) => {
                this.showMyGoods = false;
                this.$message.success("设置成功");
                this.getMyFollowList();
            });
        },
        updatePrice() {
            this.priceMap = {};
            this.getServerPriceData();
            this.getMyFollowGoodsPrice();
        },
    },
    created() {
        if (User.isLogin()) {
            getUserInfo().then((res) => {
                this.server = res.data?.data?.jx3_server || "梦江南";
                this.getSystemGoodsData();
                this.getMyFollowList();
            });
        } else {
            this.server = "梦江南";
            this.getSystemGoodsData();
        }
    },
};
</script>
<style lang="less" >
.p-price-goods {
    position: relative;
    .m-price-goods-header {
        display: flex;
        align-items: center;

        gap: 20px;
        .u-title {
            margin: 20px 0 20px 0;
            color: #24292e;
            font-size: 32px;
            font-weight: bold;
            line-height: 42px;
        }
        .u-servers {
            position: relative;
            width: 200px;
            background-color: #fff;
            border-radius: 40px;
            .el-input__prefix {
                display: flex;
                align-items: center;
                padding-left: 15px;
                color: #949494;
                font-size: 16px;
                font-weight: bold;
                line-height: 40px;
            }

            .el-input__inner {
                height: 40px;
                padding-left: 100px;
                color: #24292e;
                font-size: 16px;
                font-weight: bold;
                line-height: 40px;
                border: none;
                border-radius: 40px;
            }
        }
    }
    .m-price-goods-body {
        .u-title {
            margin: 20px 0 20px 0;
            color: #24292e;
            font-size: 32px;
            font-weight: bold;
            line-height: 42px;
        }
        .m-my-follow-goods {
            .u-btn {
                cursor: pointer;
            }
            .m-empty-follow {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 384px;
                height: 100px;
                padding: 0 10px;
                color: #999;
                border: 1px dashed #999;
                border-radius: 10px;
                .m-empty-follow-title {
                    font-size: 20px;
                    .m-empty-follow-add {
                        color: #ff9a00;
                        font-weight: bold;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
@media screen and (max-width: @ipad) {
    .p-price-goods:not(.overview) {
        padding-top: 84px;
        .u-title {
            margin: 0;
            font-size: 24px;
        }
    }
    .m-price-goods-header {
        flex-wrap: wrap;
        margin-bottom: 20px;
    }
}
@media screen and (max-width: @phone) {
    .p-price-goods:not(.overview) {
        padding-top: 84px;
        .u-title {
            margin: 0;
            font-size: 24px;
        }
    }

    .m-price-goods-header {
        flex-wrap: wrap;
        margin-bottom: 20px;
    }
}
</style>