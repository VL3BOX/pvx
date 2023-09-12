<template>
    <div class="m-horse-broadcast">
        <div class="m-horse-broadcast__header">
            <div class="u-title">抓马播报</div>
            <el-select class="u-select" v-model="params.server" placeholder="请选择服务器" size="mini">
                <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
            </el-select>
        </div>
        <list-cross v-if="list.length" class="m-horse-broadcast__list" :list="list">
            <template v-slot="data">
                <div class="m-horse-broadcast__item">
                    <jx3box-map
                        class="u-horse-map"
                        :mapId="Number(data.item.map_id)"
                        :key="data.item.map_id"
                        :overview="false"
                        :datas="data.item.mapDatas[String(data.item.map_id)]"
                    ></jx3box-map>
                    <div class="u-horse-mapinfo">
                        <div class="u-horses">
                            <div class="u-horses-content">
                                <div class="u-horse" v-for="horse in data.item.horses" :key="horse" @click="go(horse)">
                                    <el-tooltip class="item" effect="dark" :content="horse" placement="top">
                                        <el-image :src="getImgSrc(horse)" class="u-image">
                                            <div slot="error" class="image-slot">
                                                <img :src="getImgSrc(horse, true)" @error="replaceByDefault" />
                                            </div>
                                        </el-image>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="u-times-info">
                            <div class="u-map-name">{{ data.item.map_name }}</div>
                            <div class="u-times" :class="data.item.subtype === 'foreshow' && 'u-times-lately'">
                                <span>{{ data.item.fromTime }}</span>
                                <span> ~ </span>
                                <span>{{ data.item.toTime }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </list-cross>
        <div v-else class="w-no-data">{{ params.server }} 暂无播报</div>
    </div>
</template>

<script>
import Jx3boxMap from "@jx3box/jx3box-map/src/components/Map.vue";
import ListCross from "@/components/ListCross.vue";
import User from "@jx3box/jx3box-common/js/user";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import horseSites from "@/assets/data/horse_sites.json";
import horseBroadcast from "@/assets/data/horse_broadcast.json";
import { getGameReporter, getUserInfo } from "@/service/horse";
import dayjs from "dayjs";
export default {
    name: "HorseBroadcast",
    components: {
        Jx3boxMap,
        ListCross,
    },
    inject: ["__imgRoot2"],
    data() {
        return {
            list: [],
            params: {
                pageIndex: 1,
                pageSize: 50,
                server: "",
                type: "horse",
                // subtype: "", // foreshow,npc_chat
                // start: dayjs(new Date().valueOf() - 15 * 60 * 1000).format("YYYYMMDDHHmm"),
                // end: dayjs(new Date()).format("YYYYMMDDHHmm"),
            },
            timer: null,
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        servers: function () {
            if (this.client == "std") {
                return servers_std;
            } else {
                return servers_origin;
            }
        },
    },
    watch: {
        "params.server"() {
            this.list = []; // 需要置空后重新计算cross的scrollWidth
            this.getGameReporter();
        },
    },
    methods: {
        replaceByDefault(e) {
            e.target.src = require("../../assets/img/horse_item_bg_sm.jpg");
        },
        go(horseName) {
            const itemId = horseBroadcast[horseName]?.itemId || 0;
            // 2 马具 1 坐骑
            const type = 1;
            this.$router.push({ path: `${itemId}`, query: { type } });
        },
        getImgSrc(horseName, isAuto = false) {
            // const client = this.client
            const client = isAuto ? this.client : "std"; // 怀旧服的坐骑图片取正式服的, 没有再根据client获取
            const id = horseBroadcast[horseName]?.id || 0;
            return this.__imgRoot2 + `${client}/` + id + ".png";
        },
        getOriginDatas(item) {
            let mapId = "";
            let mapName = "";
            let coordinates = [];
            let result = {};
            let horses = [];
            if (item.subtype === "npc_chat") {
                // 预测
                mapId = String(item.map_id);
                mapName = item.map_name;
                coordinates = horseSites[mapId].coordinates;
                horses = horseSites[mapId].horses[item.horseIndex];
            } else {
                // 播报
                mapName = item.content.match(/在(\S*)出没/) ? item.content.match(/在(\S*)出没/)[1] : "";
                for (let key in horseSites) {
                    if (horseSites[key].mapName === mapName) {
                        mapId = key;
                        coordinates = horseSites[key].coordinates;
                        horses = horseSites[mapId].horses.flat();
                    }
                }
            }
            const coor = coordinates[0];
            result[mapId] = [
                {
                    content: `${horses.join()}
                    <br />坐标：(${coor.x},${coor.y},${coor.z})`,
                    ...coor,
                },
            ];
            const obj = {
                mapDatas: result,
                map_id: mapId,
                map_name: mapName,
                horses: horses,
            };
            return obj;
        },
        getGameReporter() {
            const params = this.params;
            getGameReporter(params).then((res) => {
                const data = res?.data?.data;
                const list = data?.list || [];
                // 三大马场只各取一条
                const myMap = new Map();
                const threeList = list.filter(
                    (item) => item.map_id && !myMap.has(item.map_id) && myMap.set(item.map_id, 1)
                );
                // 播报列表, 且取上报时间距离现在在15分钟之内的
                const bList = list.filter(
                    (item) =>
                        !item.map_id && (new Date().valueOf() - new Date(item.created_at).valueOf()) / 1000 / 60 <= 15
                );
                const newThreeList = [];
                threeList.forEach((item) => {
                    // 三大马场拆分成四条
                    item.content.split("\n\n").forEach((content, index) => {
                        if (content && (content.match(/还有(\S*)分钟/) || content.match("即将出世"))) {
                            // 还有多少分钟
                            const minute = content.match(/还有(\S*)分钟/)
                                ? Number(content.match(/还有(\S*)分钟/)[1])
                                : 0;
                            // 如果上报时间+出现时间+15分钟在当前时间之前则过滤掉
                            const bol =
                                new Date(item.created_at).valueOf() + (minute + 15) * 60 * 1000 >= new Date().valueOf();
                            if (bol) {
                                newThreeList.push({
                                    ...item,
                                    id: index ? Number(index + item.id.toString()) : item.id,
                                    content: content,
                                    minute: minute,
                                    horseIndex: index,
                                });
                            }
                        }
                    });
                });
                const newList = newThreeList.concat(bList);
                this.list = newList
                    .map((item) => {
                        let fromTime = "";
                        let toTime = "";
                        if (!!("minute" in item)) {
                            fromTime = dayjs(
                                new Date(item.created_at).valueOf() + (item.minute + 5) * 60 * 1000
                            ).format("HH:mm");
                            toTime = dayjs(new Date(item.created_at).valueOf() + (item.minute + 10) * 60 * 1000).format(
                                "HH:mm"
                            );
                        } else {
                            fromTime = dayjs(new Date(item.created_at).valueOf() + 5 * 60 * 1000).format("HH:mm");
                            toTime = dayjs(new Date(item.created_at).valueOf() + 10 * 60 * 1000).format("HH:mm");
                        }
                        return {
                            ...item,
                            ...this.getOriginDatas(item),
                            fromTime: fromTime,
                            toTime: toTime,
                        };
                    })
                    .sort(function (a, b) {
                        return dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf();
                    });
            });
        },
    },
    mounted() {
        if (User.isLogin()) {
            getUserInfo().then((res) => {
                this.params.server = res.data?.data?.jx3_server || "梦江南";
            });
        } else {
            this.params.server = "梦江南";
        }
        this.timer = setInterval(() => {
            this.getGameReporter();
        }, 30 * 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/broadcast.less";
</style>
