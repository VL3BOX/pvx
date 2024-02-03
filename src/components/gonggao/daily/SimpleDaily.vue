<template>
    <div class="m-simple-daily is-disabled">
        <div class="m-simple-daily-item" :class="item.isDone && 'is-done'" v-for="item in daily" :key="item.type">
            <div class="u-name">
                <span>{{ item.type }}</span>
            </div>
            <div v-if="~~item.name" class="u-times">
                <div class="u-time" :class="index <= ~~item.name && 'is-active'" v-for="index in 3" :key="index">
                    {{ index }}
                </div>
            </div>
            <div v-else class="u-desc">{{ item.name }}</div>
            <img
                class="u-icon"
                svg-inline
                src="@/assets/img/gonggao/check.svg"
                :fill="item.isDone ? '#fff' : '#949494'"
            />
        </div>
        <el-tooltip effect="dark" :content="(meirentu && meirentu.desc) || $t('无')" placement="bottom">
            <div class="m-simple-daily-item">
                <div class="u-name">
                    <span>{{ $t('美人图') }}</span>
                    <span class="u-week">{{ week }}</span>
                </div>
                <span class="u-desc">{{ (meirentu && meirentu.name) || $t('今日暂无画像') }}</span>
            </div>
        </el-tooltip>
    </div>
</template>

<script>
import { getMeirentu } from "@/service/gonggao";
import { getDaily } from "@/service/gonggao";
import dayjs from "@/plugins/day";
export default {
    name: "SimpleDaily",
    data() {
        return {
            defaultDaily: [
                {
                    type: "据点贸易",
                    name: "2",
                },
                {
                    type: "茶馆",
                    name: "晟江",
                },
                // {
                //     type: "家园送信",
                //     name: "广陵邑/枫叶泊/九寨沟",
                // },
            ],
            daily: [],
            meirentu: {},
        };
    },
    computed: {
        date() {
            // 当7点以前，请求前面一天的日常 当7~24点，请求当天的日常
            const hour = dayjs.tz().get("hours");
            return 0 <= hour && hour < 7
                ? dayjs.tz().subtract(1, "day").format("YYYY-MM-DD")
                : dayjs.tz().format("YYYY-MM-DD");
        },
        client() {
            return this.$store.state.client;
        },
        isCurrentWeek() {
            let week = dayjs.tz(this.date).isoWeek();
            let currentWeek = dayjs.tz().isoWeek();
            return week === currentWeek;
        },
        server() {
            return this.$store.state.server;
        },
        week() {
            var datas = dayjs.tz(this.meirentu?.date || new Date()).day();
            var week = ["日", "一", "二", "三", "四", "五", "六"];
            return "周" + week[datas];
        },
    },
    watch: {
        server: {
            handler(val) {
                val && this.loadMeirentu();
            },
        },
    },
    methods: {
        loadDaily() {
            getDaily({ date: this.date }).then((res) => {
                let list = res.data.data || [];
                this.daily = list
                    .map((item) => {
                        return {
                            type: item.task_type,
                            name: item.activity_name,
                        };
                    })
                    .concat(this.defaultDaily);
            });
        },
        // 获取美人图
        loadMeirentu() {
            getMeirentu(this.server).then((res) => {
                this.meirentu = res.data?.data || {};
            });
        },
    },
    mounted() {
        this.loadMeirentu();
        this.loadDaily();
    },
};
</script>
