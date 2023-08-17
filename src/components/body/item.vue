<template>
    <div class="m-body-item">
        <router-link
            class="u-body"
            :to="`/${item.id}`"
            target="_blank"
            v-reporter="{
                data: {
                    href: '/body/' + item.id,
                    ...reporter,
                },
                caller: 'face_index',
            }"
        >
            <i class="u-img">
                <img class="u-pic" :src="showThumb(imgLink)" loading="lazy" />
                <i class="u-mark u-mark--star" v-if="!!item.star">编辑推荐</i>
                <i class="u-mark u-mark--pay" v-if="!!~~item.price_type && !!item.price_count">付费</i>
            </i>
        </router-link>
        <span class="u-op">
            <div class="u-body-title">{{ item.title }}</div>
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
import { setPost } from "@/service/body";
import { showAvatar, authorLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "item",
    props: ["item", "reporter"],
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
            return this.item.images?.[0] || __imgPath + "image/face/null.png";
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

<style lang="less">
.m-body-item {
    .pr;
    .flex;
    .pointer;
    .mr(20px);
    .size(200px,368px);
    box-sizing: border-box;
    flex-direction: column;
    background: #f9f9f9;

    &:hover {
        background: #ffffff;
    }
    border-radius: 10px;
    padding: 20px;
    .u-img {
        .db;
        .pr;
        .size(160px,264px);
        .r(4px);
        .u-pic {
            .full;
            .r(10px);
            .size(100%);
        }
        .mb(10px);
        img {
            object-fit: cover;
            .size(100%);
        }
    }

    .u-author-box {
        display: flex;
        align-items: center;
        flex: 1;
        overflow: hidden;
    }

    .u-author {
        .fz(12px,2);
        color: #aaa;
        cursor: pointer;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
            // color: #409eff;
        }
    }

    .u-avatar {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
    }
    .u-mark {
        .fz(12px,16px);
        .z(1);
        position: absolute;
        color: #fff;
        padding: 2px 8px;
        font-style: normal;
        .r(5px);
    }
    .u-mark--star {
        .lt(10px);
        background-color: @faceColor;
    }

    .u-mark--pay {
        .rt(10px);
        background-color: #ffad31;
    }

    .clearfix;
    .u-item {
        .fl;
        .mr(15px);
        .mb(15px);
        .db;
        .pr;
    }
    .u-op {
        .u-body-title {
            .w(100%);
            .fz(20px,26px);
            .bold(700);
            .mb(10px);
            .nobreak;
        }
        i {
            .pointer;
            font-style: normal;
            color: #eee;
            .ml(1px);
            transition: 0.1s ease-in-out;
            padding: 2px;

            &:hover,
            &.on {
                color: #ff76ba;
            }
        }
    }
    .u-readOnly {
        i {
            cursor: default;
        }
    }
}
</style>
