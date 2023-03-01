<template>
    <div v-loading="loading" class="m-book-view">
        <div class="m-search">
            <search-input></search-input>
        </div>
        <div class="m-book-content">
            <div class="w-book" v-if="book">
                <p class="u-title__warpper">
                    <span class="u-name-icon">
                        <item-icon v-if="book.ItemID" :item_id="book.ItemID" :size="36"></item-icon>
                    </span>
                    <span class="u-title-id"> ID:{{ book.idKey }} </span>
                    <span class="u-desc" v-html="book.Desc"></span>
                </p>
                <div class="vertical-item u-info__wrapper">
                    <div class="u-header">
                        <img class="u-icon" svg-inline src="../../assets/img/achievement.svg" />
                        <span class="u-txt">书籍内容</span>
                    </div>
                    <div class="u-content">
                        <div v-if="book.contentInfo" class="book-info__content">
                            <div
                                v-if="/^\d+$/g.test(book.contentInfo)"
                                class="book-content"
                                :class="/^\d+$/g.test(book.contentInfo) && 'hidden'"
                            >
                                <img
                                    :src="iconLink(book.contentInfo, client)"
                                    :alt="iconLink(book.contentInfo, client)"
                                />
                            </div>
                            <div v-else class="book-content" v-html="book.contentInfo"></div>
                        </div>
                        <div class="common-info__content">
                            <p class="u-subtitle">【书籍信息】</p>
                            <div class="u-book-info">
                                <div class="u-item">书籍类型：{{ getProfessionType(book.ExtendProfessionID1) }}</div>
                                <div v-if="!['其它', '碑铭'].includes(getOrigin(book))" class="u-item book-origin">
                                    书籍来源：
                                    <el-tooltip placement="top" popper-class="book-notice-tooltip">
                                        <div slot="content">
                                            <template v-if="getOrigin(book).indexOf('秘境') > -1">
                                                <div class="u-detail-item">秘境</div>
                                                <div class="book-fb" v-html="getBossOrigin(book)"></div>
                                            </template>
                                            <template v-if="getOrigin(book).indexOf('商店') > -1">
                                                <div class="u-detail-item">商店</div>
                                                <div class="book-shop" v-html="getShopOrigin(book)"></div>
                                            </template>
                                            <template v-if="getOrigin(book).indexOf('任务') > -1">
                                                <div class="u-detail-item">任务</div>
                                                <div class="book-quest">
                                                    <div
                                                        class="quest-item"
                                                        v-for="item in getQuestOrigin(book)"
                                                        :key="item.questId"
                                                    >
                                                        <a target="_blank" :href="getLink('quest', item.questId)">
                                                            [{{ item.questName }}]</a
                                                        >
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                        <span>{{ getOrigin(book) }}</span>
                                    </el-tooltip>
                                </div>
                                <div v-else class="u-item">书籍来源：{{ getOrigin(book) }}</div>
                                <div class="u-item">所属套书：{{ book.BookName }}</div>
                                <div v-if="book.AchievementID" class="u-item">
                                    套书成就：
                                    <a
                                        class="book-achievement"
                                        target="_blank"
                                        :href="getLink('achievement', book.AchievementID)"
                                    >
                                        [{{ book.achievement ? book.achievement.Name : "" }}]</a
                                    >
                                </div>
                                <div class="u-item">阅读等级：{{ book.RequireLevel }}级</div>
                            </div>
                            <template v-if="book.copy && book.copy.ID">
                                <p class="u-subtitle">【抄录信息】</p>
                                <div class="u-book-info">
                                    <div class="u-item">
                                        <span>需求阅读：</span>
                                        <span>{{ book.copy.RequireLevel }}级</span>
                                    </div>
                                    <div class="u-item">
                                        <span>需求{{ getProfessionType(book.ExtendProfessionID1) }}：</span>
                                        <span>{{ book.copy.RequireLevelExt }}级</span>
                                    </div>
                                    <div class="u-item">
                                        <span>角色等级：</span>
                                        <span>{{ book.copy.RequirePlayerLevel }}级</span>
                                    </div>
                                    <div class="u-item">
                                        <span>消耗精力：</span>
                                        <span>{{ book.copy.CostVigor }}点</span>
                                    </div>
                                    <div v-if="book.copyList.length" class="u-item">
                                        <span>消耗材料：</span>
                                        <item-icon
                                            v-for="meterial in book.copyList"
                                            :key="meterial.item_id"
                                            :item_id="meterial.item_id"
                                            :size="28"
                                            :amount="meterial.count"
                                            :onlyIcon="true"
                                        ></item-icon>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="bookMapSite.length" class="vertical-item book-map">
                <div class="u-header">
                    <!-- <img class="u-icon" svg-inline src="../../assets/img/achievement.svg" /> -->
                    <span class="u-txt">碑铭信息</span>
                </div>
                <jx3box-map
                    class="u-content"
                    :map-id="parseInt(bookMapSite[0].map)"
                    :datas="bookMapSite[0].position"
                ></jx3box-map>
            </div>
        </div>
        <div class="m-wiki-post-panel" v-if="wiki_post && wiki_post.post">
            <WikiPanel :wiki-post="wiki_post">
                <template slot="head-title">
                    <img class="u-icon" svg-inline src="@/assets/img/item.svg" />
                    <span class="u-txt">书籍（物品）攻略</span>
                </template>
                <template slot="head-actions">
                    <a class="el-button el-button--primary" :href="publish_url(`item/${id}`)">
                        <i class="el-icon-edit"></i>
                        <span>完善物品攻略</span>
                    </a>
                </template>
                <template slot="body">
                    <div class="m-wiki-compatible" v-if="compatible">
                        <i class="el-icon-warning-outline"></i> 暂无缘起攻略，以下为重制攻略，仅作参考，<a
                            class="s-link"
                            :href="publish_url(`item/${id}`)"
                            >参与修订</a
                        >。
                    </div>
                    <Article :content="wiki_post.post.content" />
                    <div class="m-wiki-signature">
                        <i class="el-icon-edit"></i>
                        本次修订由 <b>{{ user_name }}</b> 提交于{{ updated_at }}
                    </div>
                    <Thx
                        class="m-thx"
                        :postId="id"
                        postType="book"
                        :postTitle="wiki_post.source.Name"
                        :userId="author_id"
                        :adminBoxcoinEnable="true"
                        :userBoxcoinEnable="true"
                        :authors="authors"
                        mode="wiki"
                        :key="'book-thx-' + id"
                        :client="client"
                    />
                </template>
            </WikiPanel>
        </div>
        <div class="m-wiki-post-empty" v-else>
            <i class="el-icon-s-opportunity"></i>
            <span>暂无攻略，我要</span>
            <a class="s-link" :href="publish_url(`item/${id}`)">完善攻略</a>
        </div>
        <div class="m-comment">
            <el-divider content-position="left">讨论</el-divider>
            <Comment :id="id" category="book" />
        </div>
    </div>
</template>

<script>
import Jx3boxMap from "@jx3box/jx3box-map/src/components/Map.vue";
import ItemIcon from "@/components/book/common/item_icon.vue";
import SearchInput from "@/components/book/common/search_input.vue";
import bookProfession from "@/assets/data/book_profession.json";
// 碑铭坐标json
import bookMapInfoStd from "@/assets/data/stele_std_fwd.json";
import bookMapInfoOrigin from "@/assets/data/stele_origin_fwd.json";

// 副本地图json
import maps_std from "@jx3box/jx3box-data/data/fb/fb_map.json";
import maps_orgin from "@jx3box/jx3box-data/data/fb/fb_map_origin.json";

import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

import { postStat } from "@jx3box/jx3box-common/js/stat.js";
import { wiki } from "@jx3box/jx3box-common/js/wiki.js";
// import { getAppIcon } from "@jx3box/jx3box-common/js/utils";

import { publishLink, ts2str, getLink, showAvatar, iconLink } from "@jx3box/jx3box-common/js/utils";

import { getInfo } from "@/service/book";
// import isArray from "lodash/isArray";
import WikiPanel from "@jx3box/jx3box-common-ui/src/wiki/WikiPanel";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import Article from "@jx3box/jx3box-editor/src/Article.vue";

export default {
    name: "bookSingle",
    components: { Jx3boxMap, ItemIcon, SearchInput, WikiPanel, Article, Comment },
    data() {
        return {
            wiki_post: {
                source: {},
                post: null,
            },
            compatible: false,
            is_empty: true,

            book: {
                idKey: "",
                Name: "",
                Desc: "",
                BookName: "",
                contentInfo: "",
            },
            loading: false,
            bookMapSite: [], // 碑铭点位信息
        };
    },
    methods: {
        iconLink,
        getBossOrigin(book) {
            const fbMaps = this.client === "std" ? maps_std : maps_orgin;
            const maps = Object.values(fbMaps)
                .map((item) => Object.values(item.dungeon))
                .reduce(function (a, b) {
                    return a.concat(b);
                })
                .map((item) => {
                    return item.maps.map((mItem) => {
                        return {
                            map_id: Number(mItem.map_id),
                            name: mItem.mode + item.name,
                        };
                    });
                })
                .flat();
            const drops = book?.drops;
            if (drops && drops.length) {
                let orgin = "";
                drops.forEach((item) => {
                    orgin =
                        orgin +
                        (orgin ? "<br />" : "") +
                        ("[" + item.BossName + "]") +
                        (maps.find((mItem) => mItem.map_id === item.MapID)
                            ? "(" + maps.find((mItem) => mItem.map_id === item.MapID).name + ")"
                            : "");
                });
                return orgin;
            }
            return "";
        },
        getShopOrigin(book) {
            let shopNames = book?.ShopNames;
            if (shopNames) {
                shopNames = shopNames.replace(/\|/g, "<br />");
            }
            return shopNames;
        },
        getQuestOrigin(book) {
            const quests = book?.Quests;
            let questList = [];
            if (quests) {
                questList = quests.split(";").map((item) => {
                    if (item.indexOf(":") > -1) {
                        return {
                            questId: item.split(":")[0],
                            questName: item.split(":")[1],
                        };
                    }
                });
            }
            return questList;
        },
        getOrigin(item) {
            const tempId = item.DoodadTemplateID;
            const ShopNames = item?.ShopNames;
            const drops = item.drops || [];
            const quests = item?.Quests;
            let orgin = "";
            if (tempId) {
                orgin = orgin + (orgin ? "/" : "") + (this.bookMapInfo[tempId] ? "碑铭" : "其它");
            }
            if (ShopNames) {
                orgin = orgin + (orgin ? "/" : "") + "商店";
            }
            if (drops.length) {
                orgin = orgin + (orgin ? "/" : "") + "秘境";
            }
            if (quests) {
                orgin = orgin + (orgin ? "/" : "") + "任务";
            }
            if (!orgin) {
                orgin = "其它";
            }
            return orgin;
        },
        getProfessionType(type) {
            return bookProfession.find((item) => item.id === Number(type))
                ? bookProfession.find((item) => item.id === Number(type)).name
                : "";
        },
        getData() {
            this.loading = true;
            getInfo({
                id: this.idKey,
                client: this.client,
            })
                .then((res) => {
                    const data = res.data;
                    data.contentInfo = data.contents.map((item) => item.content.replace(/\\n/g, "<br>")).join("<br>");
                    if (data.DoodadTemplateID && this.bookMapInfo[data.DoodadTemplateID]) {
                        this.bookMapSite = this.bookMapInfo[data.DoodadTemplateID];
                        this.bookMapSite[0].position[0] = Object.assign(this.bookMapSite[0].position[0], {
                            title: data.Name,
                            content: `坐标：(${this.bookMapSite[0].position[0].x},${this.bookMapSite[0].position[0].y},${this.bookMapSite[0].position[0].z})`,
                        });
                    }
                    if (data?.copy?.ID) {
                        const keyArr = Object.keys(data.copy).filter((key) => key.indexOf("RequireItem") > -1);
                        let len = parseInt(keyArr.length / 3);
                        data.copyList = [];
                        for (let i = 1; i <= len; i++) {
                            if (data.copy["RequireItemType" + i]) {
                                data.copyList.push({
                                    item_id: data.copy["RequireItemType" + i] + "_" + data.copy["RequireItemIndex" + i],
                                    count: data.copy["RequireItemCount" + i],
                                });
                            }
                        }
                    }
                    this.book = data;
                })
                .finally(() => {
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        getLink,
        //百科相关
        loadData: function () {
            // 获取最新攻略
            if (this.id) {
                wiki.mix({ type: "item", id: this.book.ItemID, client: this.client }, { supply: 1 }).then((res) => {
                    const { post, source, compatible, isEmpty, users } = res;
                    this.wiki_post = {
                        post: post,
                        source: source,
                        users,
                    };
                    this.is_empty = isEmpty;
                    this.compatible = compatible;
                });
            }
            this.triggerStat();
        },
        loadRevision: function () {
            // 获取指定攻略
            wiki.getById(this.post_id, { type: "item" }).then((res) => {
                this.wiki_post = res?.data?.data;
            });
            this.triggerStat();
        },
        publish_url: publishLink,
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_book", this.id);
            } else {
                postStat("book", this.id);
            }
        },
    },
    mounted() {
        this.getData();
    },
    computed: {
        idKey: function () {
            return this.$route.params.book_id;
        },
        id: function () {
            return parseInt(this.$route.params.book_id);
        },
        client() {
            return this.$store.state.client;
        },
        bookMapInfo() {
            return this.client === "std" ? bookMapInfoStd : bookMapInfoOrigin;
        },

        //wiki相关
        post_id: function () {
            return this.$route.params.post_id;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.wiki_post?.post?.user_id;
        },
        user_name: function () {
            return this.wiki_post?.post?.user_nickname;
        },
        updated_at: function () {
            return ts2str(this.wiki_post?.post?.updated);
        },
        fav_title: function () {
            return this.wiki_post?.source?.Name;
        },
        authors: function () {
            if (!this.isRevision) {
                return (
                    this.wiki_post?.users
                        ?.filter((user) => user.id)
                        ?.map((user) => {
                            return {
                                user_id: user.id,
                                user_avatar: user.avatar,
                                display_name: user.nickname,
                            };
                        }) || []
                );
            }
            return [];
        },
    },
    watch: {
        id() {
            this.getData();
        },
        "book.ItemID"() {
            if (this.post_id) {
                this.loadRevision();
            } else {
                this.loadData();
            }
        },
        post_id: {
            handler() {
                this.loadRevision();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/book/single.less";
</style>
