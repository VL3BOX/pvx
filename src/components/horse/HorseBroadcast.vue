<template>
    <div class="m-horse-broadcast">
        <!-- <div class="m-horse-broadcast__header">
            <div class="u-title">抓马播报</div>
            <el-select class="u-select" v-model="params.server" placeholder="请选择服务器" size="mini">
                <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
            </el-select>
        </div>
        <div class="m-horse-broadcast__list">
            <div class="m-horse-broadcast__item"></div>
        </div> -->
    </div>
</template>

<script>
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import horseSites from "@/assets/data/horse_sites.json";
import { getGameReporter } from "@/service/horse";
import dayjs from "dayjs";
export default {
    name: "HorseBroadcast",
    data() {
        return {
            list: [],
            params: {
                pageIndex: 1,
                pageSize: 30,
                server: "梦江南",
                type: "horse",
                // subtype: "", // foreshow,npc_chat
                start: dayjs(new Date() - 0.5 * 60 * 60 * 1000).format("YYYYMMDDHHmm"),
                end: dayjs(new Date()).format("YYYYMMDDHHmm"),
            },
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
            this.getGameReporter();
        },
    },
    methods: {
        getOriginDatas(item) {
            let mapId = "";
            let mapName = "";
            let coordinates = [];
            if (item.subtype === "npc_chat") {
                // 预测
                mapId = String(item.map_id);
                mapName = item.map_name;
                coordinates = horseSites[mapId].coordinates;
            } else {
                // 播报
                mapName = item.content.match(/在(\S*)出没/)[1];
                for (let key in horseSites) {
                    if (horseSites[key].mapName === mapName) {
                        mapId = key;
                        coordinates = horseSites[key].coordinates;
                    }
                }
            }
            return [
                {
                    mapId: mapId,
                    mapName: mapName,
                    coordinates: coordinates,
                },
            ];
        },
        getGameReporter() {
            const params = this.params;
            getGameReporter(params).then((res) => {
                const data = res?.data?.data;
                this.list =
                    data?.list.map((item) => {
                        return {
                            ...item,
                            originDatas: this.getOriginDatas(item),
                        };
                    }) || [];
            });
        },
    },
    mounted() {
        this.getGameReporter();
        setInterval(() => {
            this.getGameReporter();
        }, 30 * 1000);
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/broadcast.less";
</style>
