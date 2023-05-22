<template>
    <a class="m-adventure-item" :href="`/adventure/${item.dwID}`" target="_blank">
        <!-- @click="getLink(item.dwID)" -->
        <img class="u-default" :src="defaultImg" />
        <img class="u-title" :src="titleImg" :style="titleStyle" />
        <span class="u-img" :style="`backgroundImage: url(${imgName})`"></span>
        <span class="u-icon"></span>
    </a>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "item",
    props: ["item"],
    inject: ["__imgRoot"],
    components: {},
    data: function () {
        return {};
    },
    computed: {
        link: function () {
            return "/adventure/" + this.item.dwID;
        },
        client: function () {
            return this.$store.state.client;
        },
        imgName: function () {
            let img = this.item.szOpenRewardPath?.toLowerCase().match(/.*[\/,\\]adventure(.*?).tga/) || "";
            let name = "";
            if (img[1]) name = img[1].replace(/\\/g, "/");
            return this.__imgRoot + `adventure/${this.client}` + name + ".png";
        },
        defaultImg: function () {
            return __imgPath + "image/pvx/bg.png";
        },
        titleImg: function () {
            return this.__imgRoot + `image_ui/${this.client}/luckymeeting7_` + this.item.nOpenFrame + ".png";
        },
        titleStyle: function () {
            return {};
        },
    },
    methods: {
        getLink(adventure_id) {
            this.$router.push({ name: "single", params: { id: adventure_id } });
        },
    },
    filters: {},
    mounted: function () {},
};
</script>
<style lang="less">
@import "~@/assets/css/adventure/item.less";
</style>
