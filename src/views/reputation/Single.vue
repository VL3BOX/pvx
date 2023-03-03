<template>
    <div class="m-reputation-wrapper">
        <div class="back-wrap">
            <el-button @click="goBack">返回列表</el-button>
        </div>
        <div class="m-reputation-content">
            <div class="info-wrapper">
                <div class="title">
                    {{ reputation.szName }}
                    <span>ID:{{ reputation.dwForceID }}</span>
                </div>
                <div class="info-content">
                    <div class="img-wrap">
                        <img
                            v-if="reputation.servant && reputation.servant.szImagePath"
                            :src="getIcon(reputation.servant.szImagePath, 'partner')"
                        />
                        <!-- 默认图片 -->
                        <img v-else class="default-img" src="@/assets/img/reputation/sw-null.jpg" />
                    </div>
                    <div class="switch-wrap">
                        <div class="switch-btns">
                            <div class="item" :class="activeTab === 0 && 'active'" @click="activeTab = 0">声望</div>
                            <div class="item" :class="activeTab === 1 && 'active'" @click="activeTab = 1">知交</div>
                        </div>
                        <div class="content-detail">
                            <div v-show="activeTab === 0" class="detail-wrap">
                                <div class="sub-title">{{ reputation.szName }}</div>
                                <div class="u-desc" v-html="reputation.szDesc"></div>
                                <template v-if="reputation.szMapNames && reputation.szMapNames.length">
                                    <div class="sub-title2">
                                        <img src="@/assets/img/reputation/reputation_map.svg" width="15" svg-inline />
                                        声望地图
                                    </div>
                                    <div class="u-desc">{{ reputation.szMapNames[0] }}</div>
                                </template>
                                <template v-if="reputation.GroupName">
                                    <div class="sub-title2">
                                        <img src="@/assets/img/reputation/reputation_title.svg" width="15" svg-inline />
                                        势力类型
                                    </div>
                                    <div class="u-desc">{{ reputation.GroupName }}</div>
                                </template>
                                <template>
                                    <div class="sub-title2">
                                        <img src="@/assets/img/reputation/reputation_path.svg" width="15" svg-inline />
                                        遗失的尊敬
                                    </div>
                                    <div class="u-desc">
                                        {{ getPath(reputation.szName) || "无法使用遗失的尊敬来提高该声望等级进度" }}
                                    </div>
                                </template>
                            </div>
                            <div v-if="reputation.servant" v-show="activeTab === 1" class="detail-wrap">
                                <div class="sub-title">{{ reputation.servant.szNpcName }}</div>
                                <div class="u-desc" v-html="reputation.servant.szDescBrief"></div>
                                <div
                                    class="u-desc"
                                    v-html="reputation.servant.szDescPersonality.replace(/\\n/g, '<br>')"
                                ></div>
                                <template>
                                    <div class="sub-title2">
                                        <img
                                            src="@/assets/img/reputation/reputation_title2.svg"
                                            width="15"
                                            svg-inline
                                        />
                                        知交祝福
                                    </div>
                                    <div class="u-desc">
                                        <span>{{ reputation.servant.szBuffName }}</span>
                                        {{ reputation.servant.szBuffDesc }}
                                    </div>
                                </template>
                            </div>
                            <div class="detail-wrap" v-if="activeTab === 1 && !reputation.servant">
                                <div class="u-desc">无</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="current-progress">
                    <div class="progress-num"><span>当前进度：中立</span><span>0</span></div>
                    <div class="progress-wrap">
                        <div class="progress-value"></div>
                    </div>
                </div>
            </div>
            <div class="map-wrapper" v-if="reputation.szMapNames && reputation.szMapNames.length">
                <div class="title">
                    声望商人
                    <span>{{ reputation.Guides[0].npcName }}</span>
                </div>
                <div class="map-content">
                    <reputation-map ref="map" :name="reputation.szMapNames[0]" :list="reputation.points" />
                </div>
            </div>
        </div>
        <div v-if="showPath" class="reputation-reward-wrapper">
            <div class="title">声望奖励</div>
            <div class="reward-content">
                <div class="reward-desc-list">
                    <div
                        class="item"
                        :class="stage === index && 'active'"
                        v-for="(item, index) in reputation.gainList"
                        :key="index"
                        @click="stage = index"
                    >
                        <div class="from-to">{{ item.from }}<i class="el-icon-caret-right"></i>{{ item.to }}</div>
                        <div class="desc">
                            <div class="desc-title">提升方式</div>
                            <div class="desc-content">{{ item.desc }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="reputation.gainList" class="stage-reward-list">
                    <div class="stage-title">
                        <span
                            >阶段奖励（{{
                                stage === -1 ? reputation.gainList[0].from : reputation.gainList[stage].to
                            }}）</span
                        >
                        <div class="page-list" v-if="stageList.length && stageList[0].length">
                            <div
                                class="page-item"
                                :class="page === currentPage && 'active'"
                                v-for="page in pageLen"
                                :key="page"
                                @click="currentPage = page"
                            >
                                {{ page }}
                            </div>
                        </div>
                    </div>
                    <template v-if="stageList.length && stageList[0].length">
                        <div class="list">
                            <item-icon
                                v-for="reward in stageList[currentPage - 1]"
                                :key="reward"
                                :item_id="reward"
                                :onlyIcon="true"
                                :size="36"
                                class="u-item-icon"
                            ></item-icon>
                        </div>
                    </template>
                    <div v-else class="no-data">无</div>
                </div>
            </div>
        </div>
        <!-- <div class="m-comment">
            <el-divider content-position="left">讨论</el-divider>
            <Comment :id="id" category="reputation" />
        </div> -->
        <!--攻略-->
        <div class="m-wiki-post-panel" v-if="wiki_post && wiki_post.post">
            <WikiPanel :wiki-post="wiki_post">
                <template slot="head-title">
                    <img class="u-icon" svg-inline src="@/assets/img/item.svg" />
                    <span class="u-txt">声望攻略</span>
                </template>
                <template slot="head-actions">
                    <a class="el-button el-button--primary" :href="publish_url(`achievement/${id}`)">
                        <i class="el-icon-edit"></i>
                        <span>完善声望攻略</span>
                    </a>
                </template>
                <template slot="body">
                    <div class="m-wiki-compatible" v-if="compatible">
                        <i class="el-icon-warning-outline"></i> 暂无缘起攻略，以下为重制攻略，仅作参考，<a
                            class="s-link"
                            :href="publish_url(`achievement/${id}`)"
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
                        postType="achievement"
                        :postTitle="wiki_post.source.Name"
                        :userId="author_id"
                        :adminBoxcoinEnable="false"
                        :userBoxcoinEnable="false"
                        :authors="authors"
                        mode="wiki"
                        :key="'achievement-thx-' + id"
                        :client="client"
                    />
                </template>
            </WikiPanel>

            <!-- 历史版本 -->
            <WikiRevisions type="achievement" :source-id="id" />

            <!-- 百科评论 -->
            <WikiComments type="achievement" :source-id="id" />
        </div>
        <div class="m-wiki-post-empty" v-else>
            <i class="el-icon-s-opportunity"></i>
            <span>暂无攻略，我要</span>
            <a class="s-link" :href="publish_url(`achievement/${id}`)">完善攻略</a>
        </div>
    </div>
</template>

<script>
import reputationMap from "@/components/reputation/ReputationMap.vue";
import ItemIcon from "@/components/common/item_icon.vue";
import paths from "@/assets/data/reputation_exchange_path.json";
import levelList from "@/assets/data/reputation_level.json";

import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

import { postStat } from "@jx3box/jx3box-common/js/stat.js";
import { wiki } from "@jx3box/jx3box-common/js/wiki.js";

import { publishLink, ts2str } from "@jx3box/jx3box-common/js/utils";

import { getInfo } from "@/service/reputation";
// import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";

import Article from "@jx3box/jx3box-editor/src/Article.vue";
import WikiPanel from "@jx3box/jx3box-common-ui/src/wiki/WikiPanel";
import WikiRevisions from "@jx3box/jx3box-common-ui/src/wiki/WikiRevisions";
import WikiComments from "@jx3box/jx3box-common-ui/src/wiki/WikiComments";

export default {
    name: "reputationSingle",
    components: {
        reputationMap,
        ItemIcon,
        // Comment,
        WikiPanel,
        WikiRevisions,
        WikiComments,
        Article,
    },
    data() {
        return {
            wiki_post: {
                source: {},
                post: null,
            },
            compatible: false,
            is_empty: true,

            activeTab: 0,
            stage: -1,
            currentPage: 1,
            pageLen: 0,
            stageList: [],

            reputation: {
                dwForceID: -1,
                szName: "",
                szDesc: "",
            },
            loading: false,
        };
    },
    watch: {
        id() {
            this.getData();
            this.loadData();
        },
        post_id: {
            handler() {
                this.loadRevision();
            },
        },
        stage: {
            immediate: true,
            handler(stage) {
                this.currentPage = 1;
                this.stageList = [];
                const reputation = this.reputation;
                const gainList = reputation.gainList;
                if (gainList && gainList.length) {
                    const id = gainList[stage].toID;
                    const stageList = reputation.RewardItems[id] || [];
                    const sLen = stageList.length;
                    if (sLen > 48) {
                        const len = Math.ceil(sLen / 48);
                        this.pageLen = len;
                        for (let i = 0; i < len; i++) {
                            this.stageList.push(stageList.slice(48 * i, 48 * (i + 1)));
                        }
                    } else {
                        this.stageList = [stageList];
                    }
                }
            },
        },
    },
    methods: {
        goBack() {
            this.$router.push({ path: "/" });
        },
        getPath(name) {
            return paths.find((item) => item.reputations.includes(name))
                ? paths.find((item) => item.reputations.includes(name)).path
                : "";
        },
        getIcon(iconPath, type = "icon") {
            const iconName = iconPath ? iconPath.split("\\")[iconPath.split("\\").length - 1].split(".")[0] : "";
            const path = "reputation/reputation/std/" + type + "/";
            if (iconName) {
                return __imgPath + path + iconName.toLowerCase() + ".png";
            } else {
                return "";
            }
        },
        getLevelDesc(level) {
            return levelList.find((item) => item.level === Number(level))
                ? levelList.find((item) => item.level === Number(level)).name
                : "未知";
        },
        getData() {
            this.loading = true;
            getInfo({
                id: this.id,
                client: this.client,
            })
                .then((res) => {
                    const data = res.data;
                    data.szDesc = data.szDesc.replace(/\\n/g, "<br>");
                    data.gainList = data.GainDesc
                        ? data.GainDesc.map((item) => {
                              return {
                                  fromID: Number(item.from),
                                  toID: Number(item.to),
                                  from: this.getLevelDesc(item.from),
                                  to: this.getLevelDesc(item.to),
                                  desc: item.desc,
                              };
                          })
                        : [];
                    data.rewards = data.RewardItems
                        ? Object.keys(data.RewardItems).map((item) => {
                              return {
                                  level: `【${this.getLevelDesc(item)}】声望奖励：`,
                                  list: data.RewardItems[item].map((reward) => {
                                      return {
                                          id: reward,
                                          amount: 1,
                                      };
                                  }),
                              };
                          })
                        : [];
                    data.points = [
                        {
                            mapId: data.szMapIDs,
                            guides: data.Guides && data.Guides.length && data.Guides[0],
                        },
                    ];
                    // console.log(data)
                    this.reputation = data;
                })
                .finally(() => {
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        handleTabClick(tab, event) {
            if (tab.name == "map") {
                setTimeout(() => {
                    this.$refs.map && this.$refs.map.updateSize();
                }, 100);
            }
        },
        //百科相关
        loadData: function () {
            // 获取最新攻略
            if (this.id) {
                wiki.mix({ type: "achievement", id: this.id, client: this.client }, { supply: 1 }).then((res) => {
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
            wiki.getById(this.post_id, { type: "achievement" }).then((res) => {
                this.wiki_post = res?.data?.data;
            });
            this.triggerStat();
        },
        publish_url: publishLink,
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_achievement", this.id);
            } else {
                postStat("achievement", this.id);
            }
        },
    },
    mounted() {
        this.getData();
        if (this.post_id) {
            this.loadRevision();
        } else {
            this.loadData();
        }
    },
    computed: {
        id_str: function () {
            return String(this.id);
        },
        id: function () {
            return parseInt(this.$route.params.id);
        },
        showReward: function () {
            return this.reputation.RewardItems;
        },
        showPath() {
            return this.reputation.gainList && this.reputation.gainList.length;
        },
        client() {
            return this.$store.state.client;
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
};
</script>

<style lang="less">
@import "~@/assets/css/reputation/single.less";
</style>
