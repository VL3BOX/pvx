<template>
    <div class="m-simple-mp">
        <div class="m-mp-item" :class="item.current && 'is-active'" v-for="(item, index) in list" :key="index">
            <div class="u-mp-title">
                <div class="u-name">{{ item.name }}</div>
                <div class="u-map">{{ item.map }}</div>
            </div>
            <div class="u-mp-time">
                {{ item.time }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SimpleMp",
    data() {
        const t = this.$i18n.t.bind(this.$i18n);
        return {
            list: [
                {
                    name: t("事件名称"),
                    map: t("地图位置"),
                    time: `${t("周一")} 07:00 ~ ${t("周六")} 06:59`,
                    current: true,
                },
                {
                    name: t("事件名称"),
                    map: t("地图位置"),
                    time: "周六 12:00/14:00/16:00/18:00/20:00/22:00",
                },
                {
                    name: t("事件名称"),
                    map: t("地图位置"),
                    time: "周日 12:00/14:00/16:00/18:00/20:00/22:00",
                },
            ],
        };
    },
};
</script>
