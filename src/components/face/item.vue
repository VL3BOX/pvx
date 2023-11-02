<template>
    <a
        :class="['m-face-item', { noName }]"
        :href="`${link}/${item.id}`"
        target="_blank"
        v-reporter="{ data: { href: '/face/' + item.id, ...reporter }, caller: 'face_index' }"
    >
        <div class="m-img">
            <img class="u-pic" :src="showThumb(imgLink)" loading="lazy" />
            <div class="u-mask"></div>
            <div class="m-mark-left">
                <template v-if="client === 'std'">
                    <i class="u-mark u-mark--type u-new-face" v-if="item.is_new_face">写实</i>
                    <i class="u-mark u-mark--type" v-else>写意</i>
                </template>
                <i class="u-mark u-mark--new" v-if="!!item.is_unlimited">可新建</i>
            </div>
            <i class="u-mark u-mark--star" v-if="!!item.star">
                <img :src="require('@/assets/img/face/star.svg')" alt="">
            </i>
            <i class="u-mark u-mark--pay" v-if="!!~~item.price_type && !!item.price_count">
                <img :src="require('@/assets/img/face/coin.svg')" alt="">
            </i>
        </div>

        <div class="m-op">
            <div class="u-title">{{ item.title }}</div>
            <div class="m-author" @click.stop="onAuthorClick">
                <img class="u-avatar" :src="showAvatar(item.user_avatar)" :alt="author" />
                <span class="u-name"> {{ item.author_name || "匿名" }} </span>
            </div>
        </div>
    </a>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import { showAvatar, getThumbnail } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "faceItem",
    props: ["item", "reporter", "noName"],
    data: function () {
        return {
            markmap: {
                newbie: "热门",
                advanced: "推荐",
                recommended: "精选",
            },
        };
    },
    computed: {
        author: function () {
            return this.item.display_name || "匿名";
        },
        imgLink: function () {
            return this.item.images?.[0] || __imgPath + "image/face/null2.png";
        },
        client() {
            return location.href.includes("origin") ? "origin" : "std";
        },
        link() {
            return location.origin + "/face";
        },
    },
    methods: {
        showThumb: function (url) {
            return getThumbnail(url, 360);
        },
        showAvatar,
        onAuthorClick() {
            if (!this.item.original) {
                window.open(this.item.author_link, "_blank");
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/face/item.less";
</style>
