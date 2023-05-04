<template>
    <div class="m-server-item" :class="server.connectState ? 'on' : 'off'">
        <div class="u-server-title">
            <div class="u-name">{{ server.serverName }}</div>
            <div class="u-status">{{ server.connectState ? "开服" : "维护" }}</div>
        </div>
        <div class="u-server-ip">IP:{{ server.ipAddress + ":" + server.ipPort }}</div>
        <div class="u-server-fav">
            <img svg-inline :src="require(`@/assets/img/gonggao/${pinned ? 'unfav' : 'fav'}.svg`)" />
        </div>
    </div>
</template>

<script>
export default {
    name: "ServerItem",
    props: {
        server: {
            type: Object,
            required: true,
        },
        pinned: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
