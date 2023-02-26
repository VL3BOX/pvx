<template>
    <div class="horse-single-wrapper">
        <div class="back-wrap">
            <el-button @click="goBack">返回列表</el-button>
        </div>
        <div class="horse-single-content" v-loading="loading">
            <!-- 主要信息 -->
            <div class="main-info-wrapper">
                <div v-if="item.ID" class="title">{{ item.Name }} 的信息</div>
                <div v-if="item.ID" class="main-info-wrap">
                    <div class="img-wrap" :class="`u-quality-bg--` + item.Quality">
                        <img v-if="item.SubType === 15" :src="getImgSrc(item)" class="u-image" />
                        <!-- <item-icon v-else :item_id="String(item.ItemID)" :size="410" :onlyIcon="true"></item-icon> -->
                    </div>
                    <div class="info-wrap">
                        <div class="info-item">ID: {{ item.ID }}</div>
                        <div class="info-item name">{{ item.Name }}</div>
                        <div class="info-item desc">
                            分类:
                            {{ typeName + (type !== "2" ? ` · ${modeName} · ${item.GetType}` : "") }}
                        </div>
                        <div class="info-item desc">品质: {{ item.Level }}</div>
                        <div v-if="type !== '2'" class="info-item desc">跑速: {{ speedName }}</div>
                        <div v-if="type !== '2'" class="info-item desc">饲料: {{ feedName }}</div>
                        <div class="info-list">
                            <div class="title">基础属性</div>
                            <!-- <div v-if="basicAttrs.length" class="basic-list">
                                <div class="item" v-for="item in basicAttrs" :key="item.id">
                                    {{ item.desc }}
                                </div>
                            </div> -->
                            <div v-if="basicAttrs.length" class="list">
                                <div class="u-attr" v-for="attr in basicAttrs" :key="attr.id">
                                    <el-tooltip trigger="hover" placement="top">
                                        <div class="u-attr-pop" slot="content">
                                            <div class="u-attr-name" v-if="attr.name">
                                                {{ (attr.name || "") + (Number(attr.level) ? attr.level + "级" : "") }}
                                            </div>
                                            <div class="u-attr-desc">{{ attr.desc }}</div>
                                        </div>
                                        <img class="u-attr-icon" :src="attr.iconUrl" :alt="attr.name" />
                                    </el-tooltip>
                                </div>
                            </div>
                            <div v-else class="no-data">无</div>
                        </div>
                        <div class="info-list">
                            <div class="title">特殊属性</div>
                            <div v-if="magicAttrs.length" class="list">
                                <div class="u-attr" v-for="(attr, index) in magicAttrs" :key="index">
                                    <el-tooltip trigger="hover" placement="top">
                                        <div class="u-attr-pop" slot="content">
                                            <div class="u-attr-name" v-if="attr.name">
                                                {{ (attr.name || "") + (Number(attr.level) ? attr.level + "级" : "") }}
                                            </div>
                                            <div class="u-attr-desc">{{ attr.desc }}</div>
                                        </div>
                                        <img class="u-attr-icon" :src="attr.iconUrl" :alt="attr.name" />
                                    </el-tooltip>
                                </div>
                            </div>
                            <div v-else class="no-data">无</div>
                        </div>
                        <a class="u-link" :href="getLink('item', this.id)" target="_blank">
                            <i class="el-icon-collection-tag"></i>
                            物品信息
                        </a>
                    </div>
                </div>
                <div v-else>无此信息</div>
            </div>
            <!-- 同类坐骑 - 普通坐骑 -->
            <div v-if="sameList.length" class="same-list-container" v-loading="sameLoading">
                <div class="title">同类坐骑</div>
                <horse-cross :width="30" :list="sameList">
                    <template v-slot="data">
                        <same-item :item="data.item" @click.native="getHorse(data.item.ItemID)"></same-item>
                    </template>
                </horse-cross>
            </div>
            <!-- 捕获地图 -->
            <div v-if="originDatas.length" class="catch-container">
                <div class="title">捕获地图</div>
                <!-- 地图组件 -->
                <horse-map :name="item.Name" :list="originDatas" />
            </div>
            <!--攻略-->
            <div class="m-wiki-post-panel" v-if="wiki_post && wiki_post.post">
                <WikiPanel :wiki-post="wiki_post">
                    <template slot="head-title">
                        <img class="u-icon" svg-inline src="@/assets/img/item.svg" />
                        <span class="u-txt">坐骑攻略</span>
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
                            postType="item"
                            :postTitle="wiki_post.source.Name"
                            :userId="author_id"
                            :adminBoxcoinEnable="false"
                            :userBoxcoinEnable="false"
                            :authors="authors"
                            mode="wiki"
                            :key="'item-thx-' + id"
                            :client="client"
                        />
                    </template>
                </WikiPanel>

                <!-- 历史版本 -->
                <WikiRevisions type="item" :source-id="id" />

                <!-- 百科评论 -->
                <WikiComments type="item" :source-id="id" />
            </div>
            <div class="m-wiki-post-empty" v-else>
                <i class="el-icon-s-opportunity"></i>
                <span>暂无攻略，我要</span>
                <a class="s-link" :href="publish_url(`item/${id}`)">完善攻略</a>
            </div>
        </div>
    </div>
</template>

<script>
import { getHorse, getHorses } from "@/service/horse";
import { iconLink, getLink, publishLink, ts2str } from "@jx3box/jx3box-common/js/utils";
import SameItem from "@/components/horse/SameItem.vue";
import HorseCross from "@/components/horse/HorseCross.vue";

import horseMapList from "@/assets/data/horse_map.json";
import horseSites from "@/assets/data/horse_sites.json";
import HorseMap from "@/components/horse/HorseMap.vue";

import { postStat } from "@jx3box/jx3box-common/js/stat.js";
import { wiki } from "@jx3box/jx3box-common/js/wiki.js";

import Article from "@jx3box/jx3box-editor/src/Article.vue";
import WikiPanel from "@jx3box/jx3box-common-ui/src/wiki/WikiPanel";
import WikiRevisions from "@jx3box/jx3box-common-ui/src/wiki/WikiRevisions";
import WikiComments from "@jx3box/jx3box-common-ui/src/wiki/WikiComments";
export default {
    name: "Single",
    inject: ["__imgRoot", "__imgRoot2"],
    components: { SameItem, HorseCross, HorseMap, WikiPanel, WikiRevisions, WikiComments, Article },
    data() {
        return {
            loading: false,
            sameLoading: false,
            item: {},
            sameList: [],

            wiki_post: {
                source: {},
                post: null,
            },
            compatible: false,
            is_empty: true,
        };
    },
    computed: {
        originDatas() {
            const name = this.item.Name;
            if (name) {
                let mapList = horseMapList.find((item) => name.indexOf(item.name) > -1)
                    ? horseMapList.find((item) => name.indexOf(item.name) > -1).mapList
                    : [];
                const arr = [];
                if (mapList.length) {
                    mapList.forEach((mapId) => {
                        arr.push({
                            mapId: mapId,
                            mapName: horseSites[mapId].mapName,
                            coordinates: horseSites[mapId].coordinates,
                        });
                    });
                }
                return arr;
            } else {
                return [];
            }
        },
        id() {
            return this.$route.params.id;
        },
        type() {
            return this.$route.params.type;
        },
        client() {
            return this.$store.state.client;
        },
        basicAttrs() {
            const attrs = this.item.MagicAttributes;
            return attrs && attrs.length
                ? attrs
                      .filter((item) => !item.level || item.level === "0")
                      .map((mItem) => {
                          mItem.iconUrl = iconLink(mItem.icon);
                          return mItem;
                      })
                : [];
        },
        magicAttrs() {
            const attrs = this.item.MagicAttributes;
            return attrs && attrs.length
                ? attrs
                      .filter((item) => item.icon && item.level !== "0")
                      .map((mItem) => {
                          mItem.iconUrl = iconLink(mItem.icon);
                          return mItem;
                      })
                : [];
        },
        typeName() {
            const item = this.item;
            // SubType 15为坐骑 23 为马具
            // DetailType 0普通坐骑，非0奇趣坐骑
            // DetailType 0头饰，1鞍饰，2足饰，3马饰
            let type = "";
            if (item.SubType === 15) {
                if (item.DetailType === 0) {
                    type = "普通坐骑";
                } else {
                    type = "奇趣坐骑";
                }
            } else if (item.SubType === 23) {
                if (item.DetailType === 0) {
                    type = "头饰";
                } else if (item.DetailType === 1) {
                    type = "鞍饰";
                } else if (item.DetailType === 2) {
                    type = "足饰";
                } else if (item.DetailType === 3) {
                    type = "马饰";
                } else {
                    type = "马具";
                }
            }
            return type;
        },
        modeName() {
            // 双骑
            let name = "";
            const item = this.item;
            if (item.SubType === 15) {
                if (item.MagicAttributes && item.MagicAttributes.length) {
                    name = item.MagicAttributes.find((attr) => attr.id === "15650")
                        ? item.MagicAttributes.find((attr) => attr.id === "15650").name
                        : "单骑";
                }
            }
            return name;
        },
        feedName() {
            const item = this.item;
            let feed = "";
            if (item.SubType === 15 && item.Feed) {
                const start = item.Feed.FeedTip.indexOf("【");
                const end = item.Feed.FeedTip.indexOf("】");
                feed = item.Feed.FeedTip.slice(start, end + 1);
            }
            return feed;
        },
        speedName() {
            const item = this.item;
            let speed = "";
            if (item.MoveSpeed) {
                speed = item.MoveSpeedDesc.split("移动速度提高")[1];
            }
            return speed;
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
        id: {
            handler() {
                this.loadData();
            },
        },
        post_id: {
            handler() {
                this.loadRevision();
            },
        },
    },
    methods: {
        goBack() {
            this.$router.push({ path: "/" });
        },
        getHorse(id) {
            const params = {
                id: id || this.id,
                client: this.client,
            };
            if (this.type === "2") {
                params.type = 2;
            }
            this.loading = true;
            getHorse(params)
                .then((res) => {
                    this.loading = false;
                    this.item = res.data || {};
                    let name = res.data.Name;
                    if (this.typeName === "普通坐骑") {
                        name = res.data.Name.split("·")[0];
                    }
                    if (this.type !== "2" && name) {
                        this.getSameHorses(name);
                    }
                })
                .catch(() => {
                    this.loading = false;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getSameHorses(name) {
            const params = {
                page: 1,
                pageSize: 50,
                client: this.client,
                keyword: name,
            };
            this.sameLoading = true;
            getHorses(params)
                .then((res) => {
                    this.sameLoading = false;
                    this.sameList = res.data.list
                        .filter((item) => item.ID !== this.item.ID)
                        .map((item) => {
                            item.imgUrl = this.getImgSrc(item);
                            if (item.MagicAttributes && item.MagicAttributes.length) {
                                item.MagicAttributes.map((mItem) => {
                                    mItem.iconUrl = iconLink(mItem.icon);
                                    return mItem;
                                });
                            }
                            return item;
                        });
                })
                .catch(() => {
                    this.sameLoading = false;
                });
        },
        getImgSrc(item) {
            const path = item.ImgPath;
            if (path) {
                let img = path.toLowerCase().match(/.*[\/,\\]homeland(.*?).tga/);
                let name = img[1].replace(/\\/g, "/");

                if (img[1] == "default") return this.__imgRoot + `homeland/${this.client}` + "/default/default.png";
                return this.__imgRoot + `homeland/${this.client}` + name + ".png";
            } else {
                return this.__imgRoot2 + `${this.client}/` + item.ID + ".png";
            }
        },
        getLink,
        //百科相关
        publish_url: publishLink,
        loadData: function () {
            // 获取最新攻略
            if (this.id) {
                wiki.mix({ type: "item", id: this.id, client: this.client }, { supply: 1 }).then((res) => {
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
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_item", this.id);
            } else {
                postStat("item", this.id);
            }
        },
    },
    mounted() {
        this.getHorse();
        if (this.post_id) {
            this.loadRevision();
        } else {
            this.loadData();
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/single.less";
@import "~@/assets/css/horse/map.less";
@import "~@/assets/css/common/wiki.less";
</style>
