<template>
    <a
        :class="['m-face-item', { noName }]"
        :href="`${link}/${item.id}`"
        target="_blank"
        v-reporter="{ data: { href: '/face/' + item.id, ...reporter }, caller: 'face_index' }"
    >
        <div class="m-img">
            <img class="u-pic" :src="showThumb(imgLink)" loading="lazy" />
            <i class="u-mark u-mark--star" v-if="!!item.star">编辑推荐</i>
            <i class="u-mark u-mark--pay" v-if="!!~~item.price_type && !!item.price_count">付费</i>
        </div>

        <div class="m-op">
            <div class="u-title">{{ item.title }}</div>
            <a class="u-author" v-if="item.user_id" :href="authorLink(item.user_id)" @click.stop="onAuthorClick">
                作者：{{ item.author_name || "匿名" }}
            </a>
            <span class="u-author" v-else> 作者：{{ item.author_name || "匿名" }}</span>
        </div>
    </a>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import { authorLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
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
.m-face-item {
    .pr;
    .flex;
    .pointer;
    .r(10px);
    .size(200px,264px);
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    box-sizing: border-box;
    background: rgba(36, 41, 46, 0.05);
    &.noName {
        .m-op {
            .u-title {
                .break(2);
            }
            .u-author {
                .none;
            }
        }
    }

    &:hover {
        filter: brightness(110%);
    }

    .m-img {
        .pr;
        .size(160px);
        .r(10px);
        .u-pic {
            .full;
            .r(10px);
            object-fit: cover;
        }
        .u-mark {
            .pa;
            .fz(12px,16px);
            .z(6);
            .r(3px);
            color: #fff;
            padding: 2px 8px;
            font-style: normal;
        }
        .u-mark--star {
            .lt(10px);
            background-color: @faceColor;
        }

        .u-mark--pay {
            .rt(10px);
            background-color: #ffad31;
        }
    }
    .m-op {
        .flex;
        flex-direction: column;
        gap: 10px;
        .u-title {
            .fz(20px,26px);
            .break(1);
            color: rgb(36, 41, 46);
        }
        .u-author {
            .fz(14px,1.5);
            .nobreak;
            color: rgb(36, 41, 46);
        }
    }
}
</style>
