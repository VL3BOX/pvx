<template>
    <a
        :class="['m-body-item', { onlyPic, noName }]"
        :href="`${link}/${item.id}`"
        target="_blank"
        v-reporter="{
            data: {
                href: '/body/' + item.id,
                ...reporter,
            },
            caller: 'body_index',
        }"
    >
        <img class="u-pic" v-if="imgLink" :src="showThumb(imgLink)" loading="lazy" />
        <img class="u-pic" v-else src="../../assets/img/body_null.png" />

        <i class="u-mark u-mark--star" v-if="!!item.star">编辑推荐</i>
        <i class="u-mark u-mark--pay" v-if="!!~~item.price_type && !!item.price_count">付费</i>
        <div class="m-op">
            <div class="u-title">{{ item.title }}</div>
            <a class="u-author" :href="authorLink(item.user_id)" @click.stop="onAuthorClick">
                作者: {{ !item.original ? item.author_name || "匿名" : author }}
            </a>
        </div>
    </a>
</template>

<script>
import { __imgPath, __Root } from "@jx3box/jx3box-common/data/jx3box";
import { authorLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "item",
    props: ["item", "reporter", "onlyPic", "noName"],
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
            return this.item.images?.[0];
        },
        link() {
            return __Root + "/body";
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
.m-body-item {
    .flex;
    .pr;
    .pointer;
    .size(200px,374px);
    .r(10px);
    padding: 20px;
    gap: 10px;
    box-sizing: border-box;
    flex-direction: column;
    background: rgba(36, 41, 46, 0.05);

    &.onlyPic {
        .size(160px,264px);
        padding: 0;

        .u-pic {
            .full;
        }

        .u-mark--star {
            .lt(10px);
        }
        .u-mark--pay {
            .rt(10px);
        }
        .m-op {
            .none;
        }
    }
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

    .u-pic {
        .size(160px,264px);
        .r(10px);
    }

    .u-mark {
        .pa;
        .fz(12px,16px);
        .z(6);
        .r(5px);
        color: #fff;
        padding: 2px 8px;
        font-style: normal;
    }
    .u-mark--star {
        .lt(30px);
        background-color: @faceColor;
    }
    .u-mark--pay {
        .rt(30px);
        background-color: #ffad31;
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
