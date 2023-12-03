<template>
    <div class="m-daily">
        <div class="m-daily-item">
            <div class="u-title">公告</div>
            <SimpleNotice class="m-daily-content"></SimpleNotice>
        </div>
        <div class="m-daily-item">
            <div class="u-title">服务器状态</div>
            <SimpleServer class="m-daily-content"></SimpleServer>
        </div>
        <template v-if="!isOrigin">
            <div class="m-daily-item">
                <div class="u-title">日常&福缘</div>
                <SimpleDaily class="m-daily-content" :activities="activities"></SimpleDaily>
            </div>
            <div class="m-daily-item">
                <div class="u-title">楚天社</div>
                <SimpleCelebrity class="m-daily-content"></SimpleCelebrity>
            </div>
        </template>

        <!-- <div class="m-daily-item is-disabled"></div> -->
        <!-- <div class="m-daily-item is-disabled">
            <div class="u-title">武林通鉴·秘境</div>
            <SimpleFb :list="fbList"></SimpleFb>
        </div>
        <div class="m-daily-item is-disabled">
            <div class="u-title">武林通鉴·团队秘境</div>
            <SimpleFb :list="teamFbList"></SimpleFb>
        </div>
        <div class="m-daily-item is-disabled">
            <div class="u-title">门派事件</div>
            <SimpleMp></SimpleMp>
        </div> -->
        <template v-if="!isOrigin">
            <div class="m-daily-item">
                <div class="u-title">园宅会赛</div>
                <div class="m-child-item">
                    <SimpleFurniture :furniture="currentFurniture" title="本期"></SimpleFurniture>
                </div>
                <div class="m-child-item">
                    <SimpleFurniture :furniture="nextFurniture" title="下期"></SimpleFurniture>
                </div>
            </div>
            <div class="m-daily-item">
                <div class="u-title">抓马播报</div>
                <SimpleHorse class="m-daily-content"></SimpleHorse>
            </div>
        </template>
    </div>
</template>

<script>
import dayjs from "@/plugins/day";
import { getFurniture, getDailyFromOs } from "@/service/gonggao";
import SimpleNotice from "./daily/SimpleNotice.vue";
import SimpleServer from "./daily/SimpleServer.vue";
import SimpleDaily from "./daily/SimpleDaily.vue";
import SimpleCelebrity from "./daily/SimpleCelebrity.vue";
// import SimpleFb from "./daily/SimpleFb.vue";
// import SimpleMp from "./daily/SimpleMp.vue";
import SimpleFurniture from "./daily/SimpleFurniture.vue";
// import SimpleMrt from "./daily/SimpleMrt.vue";
import SimpleHorse from "./daily/SimpleHorse.vue";
import dailyKeys from "@/assets/data/daily_keys.json";
export default {
    name: "Daily",
    components: {
        SimpleNotice,
        SimpleServer,
        SimpleDaily,
        SimpleCelebrity,
        // SimpleFb,
        // SimpleMp,
        SimpleFurniture,
        // SimpleMrt,
        SimpleHorse,
    },
    data() {
        return {
            fbList: [
                {
                    name: "英雄刀轮海厅(完善中...)",
                    isDone: true,
                },
                {
                    name: "英雄空雾峰(完善中...)",
                    isDone: false,
                },
                {
                    name: "英雄毒神殿(完善中...)",
                    isDone: false,
                },
            ],
            teamFbList: [
                {
                    name: "西津渡(完善中...)",
                    isDone: false,
                },
                {
                    name: "持国天王回忆录(完善中...)",
                    isDone: true,
                },
                {
                    name: "血战天策(完善中...)",
                    isDone: false,
                },
            ],
            currentFurniture: {},
            nextFurniture: {},
            activities: [], // 日常配置列表
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        server() {
            return this.$store.state.server;
        },
        isOrigin() {
            return location.href.includes("origin");
        },
        dailyKeyMap() {
            return dailyKeys.reduce((acc, cur) => {
                return { ...acc, [cur["key"]]: cur.name };
            }, {});
        },
    },
    methods: {
        loadDailyNew() {
            const params = {
                client: this.client,
            };
            getDailyFromOs(params).then((res) => {
                let list = res.data.data || [];
                const activities = list.filter((item) => {
                    return item.client === this.client;
                });
                this.activities = activities.map((item) => {
                    return {
                        ...item,
                        name: this.dailyKeyMap[item.key],
                    };
                });
            });
        },
        getFurniture() {
            if (!this.isOrigin) {
                const params = {
                    subtypes: "category,property,next_match",
                    start: dayjs.tz().startOf("isoWeek").format("YYYY-MM-DD"),
                    end: dayjs.tz().endOf("isoWeek").format("YYYY-MM-DD"),
                };
                getFurniture(params).then((res) => {
                    const list = res.data?.data;
                    this.currentFurniture = {
                        property: list.find((item) => item.subtype === "property")?.content || "",
                        category: list.find((item) => item.subtype === "category")?.content || "",
                    };
                    const nextContent = list.find((item) => item.subtype === "next_match")?.content || "";
                    const reg = nextContent.indexOf("：") > -1 ? /.*：/g : /.*:/g;
                    const nextArr = nextContent ? nextContent.replace(reg, "").split("\n") : [];
                    this.nextFurniture = {
                        property: nextArr[0] || "",
                        category: nextArr[1] || "",
                    };
                });
            }
        },
    },
    created() {
        this.loadDailyNew();
    },
    mounted() {
        this.getFurniture();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/gonggao/daily.less";
</style>
