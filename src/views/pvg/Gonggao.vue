<template>
    <div class="p-gonggao">
        <div class="m-nav">
            <div
                class="m-nav-item"
                v-for="tab in tabs"
                :key="tab.key"
                :class="active === tab.key && 'is-active'"
                @click="go(tab)"
            >
                {{ tab.label }}
            </div>
        </div>
        <div class="m-content">
            <!-- <component :is="tab"></component> -->
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { getMyFocusServers, getAllServers } from "@/service/server.js";
// import Daily from "@/components/gonggao/Daily.vue";
// import Calendar from "@/components/gonggao/Calendar.vue";
// import Server from "@/components/gonggao/Server.vue";
export default {
    name: "Gonggao",
    // components: {
    //     Daily,
    //     Calendar,
    //     Server,
    // },
    data() {
        return {
            tabs: [
                {
                    key: "daily",
                    label: "速览",
                },
                {
                    key: "calendar",
                    label: "日历",
                },
                {
                    key: "server",
                    label: "开服状态",
                },
            ],
            serverList: [],
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
        active() {
            return this.$route.name;
        },
        tab() {
            return this.tabs[this.active].key;
        },
        uid() {
            return this.$store.state.uid;
        },
    },
    methods: {
        go(tab) {
            this.$router.push({
                path: `/gonggao/${tab.key}`,
            });
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
                this.$store.commit("setServerList", this.serverList);
                if (this.uid) {
                    getMyFocusServers().then((data) => {
                        this.serverFav(data);
                    });
                }
            });
        },
        //转服务器数据 str转换成obj
        serverFav(data) {
            if (!data) return;
            data = data.split(",");
            const favList = [];
            this.serverList.forEach((k) => {
                if (data.includes(k.main_server)) {
                    favList.push(k);
                }
            });
            this.$store.commit("setFavList", favList);
        },
    },
    created() {
        if (this.active !== 1) {
            this.loadAllServers();
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/gonggao/gonggao.less";
</style>
