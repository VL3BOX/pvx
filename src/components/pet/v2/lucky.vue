<template>
    <div class="m-luckey-item">
        <a class="u-pet" :href="getPetLink(item)" target="_blank">
            <i class="u-img">
                <img class="u-pic" :src="resolveImagePath(item.img)" loading="lazy" />
            </i>
        </a>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import {resolveImagePath} from '@jx3box/jx3box-common/js/utils'
export default {
    name: "luckyItem",
    props: ["item"],
    data: function () {
        return {};
    },
    computed: {},
    methods: {
        getPetLink(item) {
            return item.source_id ? `/pet/${item.source_id}` : item.link;
        },
        resolveImagePath
    },
};
</script>
<style lang="less">
@import "~@/assets/css/pet/v2/item.less";
</style>
