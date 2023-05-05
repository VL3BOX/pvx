<template>
    <div class="m-server">
        <div v-if="favList.length" class="m-fav-list">
            <h2 class="u-title">我的关注</h2>
            <div class="m-server-list">
                <ServerItem
                    v-for="server in favList"
                    :key="server.server_name"
                    :server="server"
                    :favList="favList"
                    @clickServer="clickServer"
                ></ServerItem>
            </div>
        </div>
        <div class="m-zone-list" v-for="zone in zones" :key="zone">
            <h2 class="u-title">{{ zone }}</h2>
            <div class="m-server-list">
                <ServerItem
                    v-for="server in serverData[zone]"
                    :key="server.server_name"
                    :server="server"
                    :favList="favList"
                    @clickServer="clickServer"
                ></ServerItem>
            </div>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { getMyFocusServers, setMyFocusServers, getAllServers } from "@/service/server.js";
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
            favList: [],
            heatStateArr: [
                {
                    value: "6",
                    label: "良好",
                    class: "is-open",
                },
                {
                    value: "7",
                    label: "繁忙",
                    class: "is-busy",
                },
                {
                    value: "8",
                    label: "爆满",
                    class: "is-full-load",
                },
                {
                    value: "3",
                    label: "维护",
                    class: "is-close",
                },
            ],
        };
    },
    computed: {
        zones() {
            return Object.keys(this.serverData);
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
            getAllServers().then((res) => {
                let mainServerList = res.data?.map((server) => {
                    return {
                        ...server,
                        connect_state_name: this.heatStateArr.find((item) => item.value === server.heat)?.label || "",
                        connect_state_class: this.heatStateArr.find((item) => item.value === server.heat)?.class || "",
                    };
                });

                this.serverList = mainServerList;
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
            const obj = {};
            list.forEach((item) => {
                if (obj[item.zone_name]) {
                    obj[item.zone_name].push(item);
                } else {
                    obj[item.zone_name] = [item];
                }
            });
            this.serverData = obj;
        },

        //转服务器数据 str转换成obj
        serverFav(data) {
            if (!data) return;
            data = data.split(",");
            this.serverList.forEach((k) => {
                if (data.includes(k.main_server)) this.favList.push(k);
            });
        },

        //登录状态存服务器，未登录跳转
        setSavedServers() {
            if (this.uid) {
                let list = this.favList.map((el) => el.main_server);

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
