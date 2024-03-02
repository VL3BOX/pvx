<template>
    <div class="m-daily">
        <div class="m-daily-item">
            <div class="u-title">公告</div>
            <SimpleNotice class="m-daily-content"></SimpleNotice>
        </div>
        <div class="m-daily-item">
            <div class="u-title">{{ $t('服务器状态') }}</div>
            <SimpleServer class="m-daily-content"></SimpleServer>
        </div>
        <template v-if="!isOrigin">
            <div class="m-daily-item">
                <div class="u-title">{{ $t('日常') }}&{{ $t('福缘') }}</div>
                <SimpleDaily class="m-daily-content" :activities="activities"></SimpleDaily>
            </div>
            <div class="m-daily-item">
                <div class="u-title">
                    <div>{{ !currentCelebrity ? $t('楚天社') : $t('云从社') }}</div>
                    <span @click="switchCelebrity">{{ $t('切换') }}</span>
                </div>
                <SimpleCelebrity :type="currentCelebrity" class="m-daily-content"></SimpleCelebrity>
            </div>
            <div class="m-daily-item">
                <div class="u-title">{{ $t('武林通鉴') }}</div>
                <SimpleWeek class="m-daily-content" :activities="activities"></SimpleWeek>
            </div>
            <div class="m-daily-item">
                <div class="u-title">{{ $t('家园') }}</div>
                <SimpleReputation :activities="activities"></SimpleReputation>
                <SimpleFurniture :furniture="currentFurniture" :nextFurniture="nextFurniture"></SimpleFurniture>
            </div>
            <div class="m-daily-item">
                <div class="u-title">{{ $t('抓马播报') }}</div>
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
import SimpleWeek from "./daily/SimpleWeek.vue";
import SimpleCelebrity from "./daily/SimpleCelebrity.vue";
import SimpleReputation from "./daily/SimpleReputation.vue";
import SimpleFurniture from "./daily/SimpleFurniture.vue";
import SimpleHorse from "./daily/SimpleHorse.vue";
import dailyKeys from "@/assets/data/daily_keys.json";
export default {
    name: "Daily",
    components: {
        SimpleNotice,
        SimpleServer,
        SimpleDaily,
        SimpleReputation,
        SimpleCelebrity,
        SimpleWeek,
        SimpleFurniture,
        SimpleHorse,
    },
    data() {
        return {
            currentCelebrity: 1, // 楚天社0 云从社1
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
        date() {
            // 当7点以前，请求前面一天的日常 当7~24点，请求当天的日常
            const hour = dayjs.tz().get("hours");
            return 0 <= hour && hour < 7
                ? dayjs.tz().subtract(1, "day").format("YYYY-MM-DD")
                : dayjs.tz().format("YYYY-MM-DD");
        },
        isCurrentWeek() {
            let week = dayjs.tz(this.date).isoWeek();
            let currentWeek = dayjs.tz().isoWeek();
            return week === currentWeek;
        },
    },
    methods: {
        switchCelebrity() {
            this.currentCelebrity = ~~!this.currentCelebrity;
        },
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
                const start = this.isCurrentWeek
                    ? dayjs.tz().startOf("isoWeek").format("YYYY-MM-DD")
                    : dayjs.tz().add(-1, "week").startOf("isoWeek").format("YYYY-MM-DD");
                const end = this.isCurrentWeek
                    ? dayjs.tz().endOf("isoWeek").format("YYYY-MM-DD")
                    : dayjs.tz().add(-1, "week").endOf("isoWeek").format("YYYY-MM-DD");
                const params = {
                    subtypes: "category,property,next_match",
                    start,
                    end,
                };
                getFurniture(params).then((res) => {
                    const list = res.data?.data || [];
                    if (list.some((item) => !item)) return;
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
