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
            <div class="u-list">
                <div class="u-item"></div>
            </div>
        </div>
        <div class="m-daily-item">
            <div class="u-title">今日福源</div>
            <div class="u-list">
                <div class="u-item"></div>
            </div>
        </div>
        <div class="m-daily-item">
            <div class="u-title">武林通鉴·秘境</div>
            <div class="u-list">
                <div class="u-item"></div>
            </div>
        </div>
        <div class="m-daily-item">
            <div class="u-title">武林通鉴·团队秘境</div>
            <div class="u-list">
                <div class="u-item"></div>
            </div>
        </div>
        <div class="m-daily-item">
            <div class="u-title">门派事件</div>
            <div class="u-list">
                <div class="u-item"></div>
            </div>
        </div>
        <div class="m-daily-item">
            <div class="u-title">园宅会赛</div>
            <div class="u-list">
                <div class="u-item"></div>
            </div>
            <div class="u-title">美人图</div>
            <div class="u-list">
                <div class="u-item"></div>
            </div>
        </div>
    </div>
</template>

<script>
import SimpleServer from "./SimpleServer.vue";
import SimpleDaily from "./SimpleDaily.vue";
export default {
    name: "Daily",
    components: { SimpleServer, SimpleDaily },
};
</script>

<style lang="less">
@import "~@/assets/css/gonggao/daily.less";
</style>
