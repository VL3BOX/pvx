<template>
    <div class="m-luckey-item">
        <a class="u-face" :href="getFaceLink(item)" target="_blank">
            <i class="u-img">
                <img class="u-pic" :src="item.img" loading="lazy" />
            </i>
        </a>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import { setPost } from "@/service/share";
import { showMinibanner, showBanner, showAvatar, authorLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "luckyItem",
    props: ["item"],
    data: function () {
        return {};
    },
    computed: {},
    methods: {
        getFaceLink(item) {
            return item.source_id ? `/face/${item.source_id}` : item.link;
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/pet/v2/item.less";
</style>
