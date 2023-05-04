<template>
    <div class="p-gonggao">
        <div class="m-nav">
            <div
                class="m-nav-item"
                v-for="tab in tabs"
                :key="tab.key"
                :class="active === tab.value && 'is-active'"
                @click="go(tab.value)"
            >
                {{ tab.label }}
            </div>
        </div>
        <div class="m-content">
            <component :is="tab"></component>
        </div>
    </div>
</template>

<script>
import Daily from "@/components/gonggao/Daily.vue";
import Calendar from "@/components/gonggao/Calendar.vue";
import Server from "@/components/gonggao/Server.vue";
export default {
    name: "Gonggao",
    components: {
        Daily,
        Calendar,
        Server,
    },
    data() {
        return {
            tabs: [
                {
                    key: "Daily",
                    value: 0,
                    label: "速览",
                },
                {
                    key: "Calendar",
                    value: 1,
                    label: "日历",
                },
                {
                    key: "Server",
                    value: 2,
                    label: "开服状态",
                },
            ],
        };
    },
    computed: {
        active() {
            return ~~this.$route.query?.tab || 0;
        },
        tab() {
            return this.tabs[this.active].key;
        },
    },
    methods: {
        go(tab) {
            this.$router.push({
                path: "/gonggao",
                query: {
                    tab: tab,
                },
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/gonggao/gonggao.less";
</style>
