<template>
    <div class="m-server">
        <div v-if="uid && favList.length" class="m-fav-list">
            <h2 class="u-title">我的关注</h2>
        </div>
        <div class="m-zone-list" v-for="zone in zones" :key="zone">
            <h2 class="u-title">{{ zone }}</h2>
            <div class="m-server-list">
                <ServerItem v-for="server in serverData[zone]" :key="server.serverName" :server="server"></ServerItem>
            </div>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { getMyFocusServers, setMyFocusServers, getAllServers } from "@/service/server.js";
import server_map from "@jx3box/jx3box-data/data/server/server_map.json";
import ServerItem from "./ServerItem.vue";
export default {
    name: "Server",
    components: {
        ServerItem,
    },
    data() {
        return {
            serverData: {},
            serverList: [],
            serverAllList: [],
            favList: [],
        };
    },
    computed: {
        zones() {
            return Object.keys(this.serverData).sort();
        },
        uid() {
            return User.getInfo().uid || 0;
        },
    },
    methods: {
        // 点击收藏服务器和取消服务器收藏
        clickServer(server) {
            let list = new Set(this.favList);
            let fav = [];
            list.has(server) ? list.delete(server) : list.add(server);
            for (let key of list.keys()) {
                fav.push(key);
            }
            this.favList = fav;
            this.setSavedServers();
        },

        // 获取服务器列表
        loadAllServers() {
            getAllServers().then((data) => {
                let mainServerList = [];
                let list = data?.filter((server) => {
                    if (server.serverName === server.mainServer) {
                        mainServerList.push(server);
                    }
                    return server.serverName !== server.mainServer;
                });

                this.serverList = mainServerList;
                this.serverAllList = mainServerList.concat(list);
                this.sortServer(mainServerList);

                if (this.uid) {
                    getMyFocusServers().then((data) => {
                        this.serverFav(data);
                    });
                }
            });
        },

        // 将获取的服务器分类
        sortServer(list) {
            const serverKeys = Object.keys(server_map);
            const obj = {};
            list.filter((item) => serverKeys.includes(item.serverName)).forEach((item) => {
                if (obj[item.zoneName]) {
                    obj[item.zoneName].push(item);
                } else {
                    obj[item.zoneName] = [item];
                }
            });
            this.serverData = obj;
        },

        //转服务器数据 str转换成obj
        serverFav(data) {
            if (!data) return;
            data = data.split(",");
            this.serverList.forEach((k) => {
                if (data.includes(k.mainServer)) this.favList.push(k);
            });
        },

        //登录状态存服务器，未登录跳转
        setSavedServers() {
            if (this.uid) {
                let list = this.favList.map((el) => el.serverName);

                setMyFocusServers(list.join(","))
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            } else {
                return User.toLogin();
            }
        },
    },
    created() {
        this.loadAllServers();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/gonggao/server.less";
</style>
