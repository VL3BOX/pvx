<template>
    <div class="m-horse-broadcast">
        <div class="m-horse-broadcast__header">
            <div class="u-title"></div>
        </div>
        <div class="m-horse-broadcast__list">
            <div class="m-horse-broadcast__item"></div>
        </div>
    </div>
</template>

<script>
import { getGameReporter } from "@/service/horse";
export default {
    name: "HorseBroadcast",
    data() {
        return {
            list: [],
        };
    },
    methods: {
        getGameReporter() {
            getGameReporter().then((res) => {
                const data = res?.data?.data;
                this.list = data?.list || [];
            });
        },
    },
    mounted() {
        this.getGameReporter();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/broadcast.less";
</style>
