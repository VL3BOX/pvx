<template>
    <div class="m-simple-horse">
        <div class="u-horse">
            <template v-if="list.length">
                <div class="u-item" v-for="item in list" :key="item.id">
                    <div class="u-horse-name-wrap">
                        <el-carousel class="u-img-list" :autoplay="true" arrow="never" indicator-position="none">
                            <el-carousel-item v-for="horse in item.horses" :key="horse">
                                <a class="u-horse-name" :href="getLink(horse)" target="_blank">
                                    <el-tooltip class="item" effect="dark" :content="horse" placement="top">
                                        <el-image :src="getImgSrc(horse)" class="u-image"></el-image>
                                    </el-tooltip>
                                </a>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                    <div class="u-times-info">
                        <div class="u-map-name">{{ item.map_name }}</div>
                        <div class="u-times" :class="item.subtype === 'foreshow' && 'u-times-lately'">
                            <span>{{ item.fromTime }}</span>
                            <span> ~ </span>
                            <span>{{ item.toTime }}</span>
                        </div>
                    </div>
                </div>
            </template>
            <div v-else class="u-item">暂无播报</div>
        </div>
    </div>
</template>

<script>
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import horseSites from "@/assets/data/horse_sites.json";
import horseBroadcast from "@/assets/data/horse_broadcast.json";
import { getGameReporter } from "@/service/gonggao";
import dayjs from "dayjs";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "WorldHorse",
    data() {
        return {
            noList: [],
            list: [],
            params: {
                pageIndex: 1,
                pageSize: 50,
                server: "",
                type: "horse",
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
        server() {
            return this.$store.state.server;
        },
    },
    watch: {
        server: {
            immediate: true,
            handler(server) {
                if (server) {
                    this.params.server = server;
                    this.getGameReporter();
                }
            },
        },
    },
    methods: {
        getLink(horseName) {
            const itemId = horseBroadcast[horseName]?.itemId || 0;
            // 2 马具 1 坐骑
            const type = 1;
            return `/horse/${itemId}?type=${type}`;
        },
        getImgSrc(horseName) {
            const id = horseBroadcast[horseName]?.id || 0;
            return __imgPath + `horse/${this.client}/` + id + ".png";
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
