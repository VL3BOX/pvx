<template>
    <div class="m-daily-activity">
        <div class="m-daily-content">
            <div class="m-daily-item" v-for="(item, i) in daily" :key="i">
                <div class="u-label">{{ item.type }}</div>
                <div class="u-value">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDaily } from "@/service/gonggao";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);
dayjs.extend(isToday);
export default {
    name: "daily-activity",
    props: {
        date: {
            type: String,
            default: dayjs().format("YYYY-MM-DD"),
        },
    },
    data() {
        return {
            daily: [],
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        today: function () {
            return dayjs(this.date).isToday();
        },
        isCurrentWeek() {
            let week = dayjs(this.date).isoWeek();
            let currentWeek = dayjs().isoWeek();

            return week === currentWeek;
        },
    },
    watch: {
        date: {
            immediate: true,
            handler() {
                this.client === "std" && this.loadDaily();
            },
        },
    },
    methods: {
        // =========== 数据获取==========
        // 获取每日活动
        loadDaily() {
            let date = dayjs(this.date).format("YYYY-MM-DD");
            if (this.today) {
                const hour = dayjs().hour();
                if (0 <= hour && hour < 7) {
                    date = dayjs(date).subtract(1, "day").format("YYYY-MM-DD");
                }
            }
            getDaily({ date }).then((res) => {
                let list = res.data.data || [];
                this.daily = list.map((item) => {
                    return {
                        type: item.task_type,
                        zone: "全服",
                        name: item.activity_name,
                    };
                });
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/calendar/daily.less";
</style>
