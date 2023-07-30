<template>
    <div class="m-systemgoods">
        <div class="m-systemgoods-group" v-for="group in data" :key="group.id">
            <div class="m-systemgoods-group-label">
                {{ group.label }}
            </div>
            <div class="m-systemgoods-list">
                <div
                    class="m-systemgoods-list-item"
                    v-for="item in filterSameItem(group.items)"
                    :key="item.item_id"
                    @click="goItemPage(item.item_id)"
                >
                    <img class="u-icon" :src="iconLink(item.icon)" alt="" />
                    <div class="m-systemgoods-list-item-info">
                        <div class="m-systemgoods-list-item-label">{{ item.label || "" }}</div>
                        <div class="m-systemgoods-list-item-money">
                            <GamePrice v-if="priceMap[item.item_id]" :price="priceMap[item.item_id].AvgPrice" />
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
            let arr = [];
            let obj = {};
            list.forEach((item) => {
                if (!obj[item.item_id]) {
                    arr.push(item);
                    obj[item.item_id] = true;
                }
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
    .m-systemgoods {
        display: flex;
        flex-direction: column;

        gap: 20px;
        .m-systemgoods-group {
            padding-left: 30px;
            .m-systemgoods-group-label {
                margin: 20px 0 20px 0;
                color: #24292e;
                font-size: 26px;
                font-weight: bold;
                line-height: 42px;
            }
            .m-systemgoods-list {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                gap: 20px;
                .m-systemgoods-list-item {
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
                    .m-systemgoods-list-item-info {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        width: 100%;
                        height: 100%;
                        padding: 10px 0;
                        .m-systemgoods-list-item-label {
                            flex: 1;
                            width: 100%;
                            padding-top: 7.5px;
                            font-size: 24px;
                            font-weight: 700;
                            line-height: 32px;
                        }
                        .m-systemgoods-list-item-money {
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
