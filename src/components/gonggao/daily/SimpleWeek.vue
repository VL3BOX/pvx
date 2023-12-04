<template>
    <div class="m-simple-week">
        <div class="m-week-item" v-for="(item, i) in item5" :key="item + i">
            <div class="u-name">五人</div>
            <div v-if="getItem(item)" class="u-val">英雄</div>
            <div class="u-val">{{ getItem(item) }}</div>
        </div>
        <div class="m-week-item" v-for="(item, i) in item10" :key="item + i">
            <div class="u-name">十人</div>
            <div class="u-val">{{ item }}</div>
        </div>
    </div>
</template>

<script>
import dailyKeys from "@/assets/data/daily_keys.json";
export default {
    name: "SimpleWeek",
    props: {
        activities: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        weeks() {
            const keys = dailyKeys.filter((item) => item.type === 2).map((item) => item.key);
            return this.activities.filter((item) => keys.includes(item.key) && item.val);
        },
        item5() {
            const val = this.weeks.find((item) => item.key === "wltj5")?.val || "";
            if (!val) {
                return [];
            } else {
                if (val.indexOf("、") > -1) {
                    return val.split("、");
                }
                return [];
            }
        },
        item10() {
            const val = this.weeks.find((item) => item.key === "wltj10")?.val || "";
            if (!val) {
                return [];
            } else {
                if (val.indexOf("、") > -1) {
                    return val.split("、");
                }
                return [];
            }
        },
    },
    methods: {
        getItem(val) {
            if (val.indexOf("英雄") > -1) {
                return val.split("英雄")[1];
            }
            return val;
        },
    },
};
</script>
