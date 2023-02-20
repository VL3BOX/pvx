<template>
    <div class="m-share-item">
        <router-link class="u-face" :to="`/${item.id}`" target="_blank">
            <i class="u-img">
                <img class="u-pic" :src="showThumb(imgLink)" loading="lazy" />
                <i class="u-star-mark" v-if="!!item.star">编辑推荐</i>
            </i>
        </router-link>
        <span class="u-op">
            <div class="u-face-title">{{ item.title }}</div>
            <!-- 非原创显示名称，原创显示头像+作者 -->
            <span class="u-author" :title="item.author_name" v-if="!item.original" @click="onAuthorClick">{{
                item.author_name || "匿名"
            }}</span>
            <a class="u-author-box" :href="authorLink(item.user_id)" @click="onAuthorClick" v-else>
                <img class="u-avatar" :src="showAvatar(item.user_avatar)" :alt="author" />
                <span class="u-author">{{ author }}</span>
            </a>
        </span>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import User from "@jx3box/jx3box-common/js/user";
import { setPost } from "@/service/share";
import { showMinibanner, showBanner, showAvatar, authorLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "item",
    props: ["item"],
    data: function () {
        return {
            search: "",
            markmap: {
                newbie: "热门",
                advanced: "推荐",
                recommended: "精选",
            },
            isEditor: User.isEditor(),
        };
    },
    computed: {
        author: function () {
            return this.item.display_name || "匿名";
        },
        imgLink: function () {
            return this.item.images?.[0] || __imgPath + "image/face/null2.png";
        },
    },
    methods: {
        hasMark: function (item, key) {
            return item.mark?.includes(key);
        },
        setMark: function (item, key) {
            let hasKey = item.mark?.includes(key);
            item.mark = hasKey ? [] : [key];
            let msg = hasKey ? "取消" : "设置";
            msg += this.markmap[key];
            msg += "成功";

            setPost(item.ID, {
                mark: item.mark,
            }).then((res) => {
                this.$notify({
                    title: "成功",
                    message: msg,
                    type: "success",
                });
            });
        },
        showThumb: function (url) {
            return getThumbnail(url, 360);
        },
        showAvatar,
        authorLink,
        onAuthorClick() {
            if (!this.item.original) {
                window.open(this.item.author_link, "_blank");
            }
        },
    },
};
</script>
