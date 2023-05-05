<template>
    <div class="m-server-item hvr-float-shadow" :class="server.connect_state_class">
        <div class="u-server-title">
            <div class="u-name">{{ server.main_server }}</div>
            <div class="u-status">{{ server.connect_state_name }}</div>
        </div>
        <div class="u-server-ip">IP:{{ server.ip_address + ":" + server.ip_port }}</div>
        <div class="u-server-time">
            <span>最近维护时间:</span>{{ dayjs(server.maintain_time * 1000).format("YYYY-MM-DD HH:mm:ss") }}
        </div>
        <div class="u-server-fav hvr-icon-push" :class="isSaved && 'is-saved'" @click="favHandle">
            <img class="hvr-icon" svg-inline :src="require(`@/assets/img/gonggao/${isSaved ? 'unfav' : 'fav'}.svg`)" />
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    name: "ServerItem",
    props: {
        server: {
            type: Object,
            required: true,
        },
        favList: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        isSaved() {
            return this.favList.filter((item) => item.main_server.indexOf(this.server.main_server) !== -1).length > 0;
        },
    },
    methods: {
        dayjs,
        favHandle() {
            this.$emit("clickServer", this.server);
        },
    },
};
</script>
