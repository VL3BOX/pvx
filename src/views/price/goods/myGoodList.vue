<template>
  <div class="m-mygoods">
    <div class="m-mygoods-plan" v-for="plan in data" :key="plan.id">
      <div class="m-mygoods-plan-label">
        {{plan.title}}
      </div>
      <div class="m-mygoods-list">
        <div class="m-mygoods-list-item" v-for="item in  mergeData(plan.relation)" :key="item.id" @click="goItemPage(item.id)">
          <img class="u-icon" :src="iconLink(item.IconID)" alt="">
          <div class="m-mygoods-list-item-info">
            <div class="m-mygoods-list-item-label">{{item.Name||""}}</div>
            <div class="m-mygoods-list-item-money">
              <GamePrice v-if="priceMap[item.id]" :price="priceMap[item.id].AvgPrice||0" />
              <div v-else class="is-null">暂无价目</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-backtop />
  </div>
</template>
<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";
export default {
    props: {
        data: {},
        priceMap: {},
    },
    components: { GamePrice },
    methods: {
        iconLink,
        // 去重item
        filterSameItem(list) {
            console.log("%c 🍈 list: ", "font-size:20px;background-color: #FFDD4D;color:#fff;", list);
            let arr = [];
            let obj = {};
            list.forEach((item) => {
                if (!obj[item.id]) {
                    arr.push(item);
                    obj[item.id] = true;
                }
            });
            return arr;
        },
        // 合并数据
        mergeData(list) {
            let arr = [];
            list.forEach((item) => {
                item.data.forEach((item2) => {
                    arr.push(item2);
                });
            });
            return arr;
        },
        // 物品详情页
        goItemPage(id) {
            let host = location.origin;
            window.open(`${host}/item/view/${id}`, "_blank");
            sessionStorage.setItem("server_name", this.server);
        },
    },
};
</script>
<style lang="less">
.p-price-goods {
    * {
        box-sizing: border-box;
    }
    .m-mygoods {
        display: flex;
        flex-direction: column;

        gap: 20px;
        .m-mygoods-plan {
            padding-left: 30px;
            .m-mygoods-plan-label {
                margin: 20px 0 20px 0;
                color: #24292e;
                font-size: 26px;
                font-weight: bold;
                line-height: 42px;
            }
            .m-mygoods-list {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                gap: 20px;
                .m-mygoods-list-item {
                    display: flex;
                    align-items: center;
                    width: 384px;
                    height: 100px;
                    padding: 0 10px;
                    background-color: #fff;
                    border-radius: 10px;
                    cursor: pointer;

                    gap: 10px;
                    .u-icon {
                        width: 80px;
                        height: 80px;
                    }
                    .m-mygoods-list-item-info {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        width: 100%;
                        height: 100%;
                        padding: 10px 0;
                        .m-mygoods-list-item-label {
                            flex: 1;
                            width: 100%;
                            padding-top: 7.5px;
                            font-size: 24px;
                            font-weight: 700;
                            line-height: 32px;
                        }
                        .m-mygoods-list-item-money {
                            flex: 1;
                            width: 100%;
                            font-size: 24px;
                            font-weight: 700;
                            line-height: 32px;
                            text-align: right;
                            .is-null {
                                color: #999;
                                font-size: 12px;
                                font-weight: normal;
                            }
                            .c-game-price {
                                display: flex;
                                justify-content: flex-end;
                                align-items: center;
                                width: 100%;
                                height: 100%;
                                font-size: 20px;
                                font-weight: 700;
                                line-height: 26px;

                                gap: 4px;
                                & > span {
                                    display: flex;
                                    justify-content: flex-end;
                                    align-items: center;

                                    gap: 4px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>