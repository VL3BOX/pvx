<template>
    <div class="m-daily">
        <div class="m-daily-item">
            <div class="u-title">服务器状态</div>
            <SimpleServer></SimpleServer>
        </div>
        <div class="m-daily-item">
            <div class="u-title">日常</div>
            <SimpleDaily></SimpleDaily>
        </div>
        <div class="m-daily-item">
            <div class="u-title">楚天社</div>
            <SimpleCelebrity></SimpleCelebrity>
        </div>
        <div class="m-daily-item">
            <div class="u-title">今日福源</div>
            <SimplePet></SimplePet>
        </div>
        <div class="m-daily-item is-disabled">
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
        </div>
        <div class="m-daily-item">
            <div class="m-child-item">
                <div class="u-title">园宅会赛</div>
                <SimpleFurniture></SimpleFurniture>
            </div>
            <div class="m-child-item">
                <div class="u-title">美人图</div>
                <SimpleMrt></SimpleMrt>
            </div>
        </div>
    </div>
</template>

<script>
import SimpleServer from "./SimpleServer.vue";
import SimpleDaily from "./SimpleDaily.vue";
import SimpleCelebrity from "./SimpleCelebrity.vue";
import SimplePet from "./SimplePet.vue";
import SimpleFb from "./SimpleFb.vue";
import SimpleMp from "./SimpleMp.vue";
import SimpleFurniture from "./SimpleFurniture.vue";
import SimpleMrt from "./SimpleMrt.vue";
export default {
    name: "Daily",
    components: {
        SimpleServer,
        SimpleDaily,
        SimpleCelebrity,
        SimplePet,
        SimpleFb,
        SimpleMp,
        SimpleFurniture,
        SimpleMrt,
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
        };
    },
};
</script>

<style lang="less">
@import "~@/assets/css/gonggao/daily.less";
</style>
