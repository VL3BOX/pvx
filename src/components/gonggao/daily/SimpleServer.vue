<template>
    <div class="m-simple-server">
        <div class="m-my-server">
            <div class="u-server-title">
                <div class="u-name">{{ myServer.main_server }}</div>
                <div class="u-status" :class="myServer.connect_state_class">
                    {{ myServer.connect_state_name }}
                </div>
            </div>
            <div class="u-server-ip">IP:{{ (myServer.ip_address || 0) + ":" + (myServer?.ip_port || 0) }}</div>
            <div class="u-server-time">
                <span>最近维护时间:</span>{{ dayjs(myServer.maintain_time * 1000).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
        </div>
        <div class="m-fav-servers">
            <div class="m-server-item" v-for="item in list" :key="item.main_server">
                <div class="u-name">{{ item.main_server }}</div>
                <div class="u-status" :class="item.connect_state_class">
                    {{ item.connect_state_name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    name: "SimpleServer",
    data() {
        return {};
    },
    computed: {
        serverList() {
            return this.$store.state.serverList;
        },
        favList() {
            return this.$store.state.favList;
        },
        uid() {
            return this.$store.state.uid;
        },
        myServer() {
            // 当前服务器
            if (this.uid) {
                const myServer = this.serverList.find((item) => item.main_server === this.$store.state.server) || {};
                return myServer;
            } else {
                return this.serverList[0] || {};
            }
        },
        list() {
            // 收藏的服务器
            let list = [];
            if (this.serverList.length) {
                const favList = this.favList.filter((item) => item.main_server !== this.$store.state.server);
                const serverList = this.serverList.filter((item) => item.main_server !== this.myServer?.main_server);
                if (this.uid && favList.length > 3) {
                    list = favList.splice(0, 3);
                } else {
                    const len = favList.length;
                    const favKeys = favList.map((item) => item.main_server);
                    const remainServerList = serverList.filter((item) => !favKeys.includes(item.main_server));
                    list = favList.concat(remainServerList.splice(0, 3 - len));
                }
            }
            return list;
        },
    },
    watch: {
        myServer: {
            immediate: true,
            deep: true,
            handler(myServer) {
                if (!this.uid) {
                    this.$store.commit("setServer", myServer?.main_server);
                }
            },
        },
    },
    methods: {
        dayjs,
    },
    created() {
        if (this.uid) {
            this.$store.dispatch("getMyServer");
        }
    },
};
</script>
