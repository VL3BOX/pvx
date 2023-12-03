<template>
    <div class="p-face-single" v-loading="loading">
        <div class="m-navigation">
            <div class="u-goback" @click="goBack">返回列表</div>
            <!-- 操作tool -->
            <div class="u-right-btn">
                <div class="m-face-btn-box">
                    <a v-if="isSinglePage && isEditor" href="/os/#/omp/pvx/bodydata" target="_blank">
                        <el-button type="primary" size="medium" icon="el-icon-setting" class="u-manage">
                            管理
                        </el-button>
                    </a>
                    <a :href="publish_link">
                        <div class="u-face-publish">
                            <img svg-inline src="@/assets/img/face/face-publish.svg" class="u-img" />
                            <span>发布体型</span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <!-- 基本信息 -->
        <div class="m-header">
            <div class="m-header-info">
                <h2>
                    {{ post.title || "无标题" }}
                    <el-tag class="u-status" v-if="post.status != 1" effect="dark" type="danger">已下架</el-tag>
                </h2>
                <div class="u-author">
                    <img class="u-avatar" :src="showAvatar(post.user_avatar)" :alt="post.user_avatar_frame" />
                    <a class="u-name" :href="authorLink(post.user_id)" target="_blank" v-if="!!post.original">{{
                        post.display_name
                    }}</a>
                    <a class="u-name" :href="post.author_link" target="_blank" v-else-if="post.author_link">{{
                        post.author_name
                    }}</a>
                    <span class="u-name" v-else>{{ post.author_name }}</span>
                    <time class="u-time">{{ post.updated_at }}</time>
                    <a class="u-edit" v-if="canEdit" :href="editLink('body', post.id)" target="_blank">
                        <i class="el-icon-edit-outline u-edit-icon"></i>
                        编辑
                    </a>
                </div>
                <div class="u-meta">
                    <i class="u-mark" v-if="!!post.star">★ 编辑推荐</i>
                    <i class="u-fr" v-if="!!post.is_fr">首发</i>
                    <i class="u-original" v-if="!!post.original">原创</i>
                    <i class="u-client" :class="post.client || 'std'">{{ showClientLabel(post.client) }}</i>
                    <i class="u-bodytype" :class="'u-bodytype-' + post.body_type" v-if="post.body_type">{{
                        showBodyTypeLabel(post.body_type)
                    }}</i>
                </div>
            </div>
            <a :href="tvLink" target="_blank" class="m-topic" v-if="topicText">{{ topicText }}</a>
        </div>

        <div class="m-face-content">
            <div class="m-single-pics m-single-content-box" v-if="showCarousel">
                <!-- 动态改为当前图片 -->
                <div class="u-bg-wrap">
                    <div class="u-bg" :style="{ backgroundImage: `url(${showPic(activePic)})` }"></div>
                </div>

                <el-carousel class="m-carousel" :interval="4000" type="card" arrow="always" @change="carouselChange">
                    <el-carousel-item v-for="(item, i) in previewSrcList" :key="i">
                        <div class="m-face-pic">
                            <el-image
                                ref="previewImage"
                                fit="contain"
                                :src="showPic(item)"
                                class="u-pic"
                                :preview-src-list="resolveImageArr(previewSrcList)"
                                @click.capture="handlePreviewImage(i)"
                            ></el-image>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>

            <!-- 购买区 -->
            <div class="m-face-pay" v-if="post.price_type && post.price_type != 0 && !has_buy">
                <div class="m-face-pay-info">
                    <span class="u-text">该体型数据售价：</span>
                    <el-tag effect="dark" color="#ffad31" round>
                        <span v-if="post.price_type == 1">{{ post.price_count }} 盒币</span>
                        <span v-if="post.price_type == 2">{{ post.price_count }} 金箔</span>
                    </el-tag>
                    <el-button
                        class="u-btn"
                        type="primary"
                        size="small"
                        icon="el-icon-shopping-cart-2"
                        @click="facePay"
                        :loading="payBtnLoading"
                    >
                        购买
                    </el-button>
                </div>
                <img class="u-box-img" src="../../assets/img/box.svg" />
            </div>
        </div>

        <div class="m-desc" v-if="post.remark">
            <h3>说明</h3>
            <div class="u-desc" v-if="post.remark">{{ post.remark }}</div>
        </div>

        <!-- 数据区 -->
        <div class="m-single-data" v-if="has_buy && bodydata">
            <span class="m-single-data-title">独家数据分析</span>
            <Bodydat v-if="bodydata" :data="bodydata" />
        </div>

        <!--下载区-->
        <div class="m-single-data" v-if="has_buy && downFileList && downFileList.length > 0">
            <span class="m-single-data-title">原始文件列表</span>
            <div class="m-files-list">
                <div class="m-face-files-list">
                    <div class="u-file" v-for="item in downFileList" :key="item.id">
                        <div class="u-info">
                            <span class="u-label"> {{ item.name }} </span>
                            <span class="u-label">
                                备注 ： <em>{{ item.describe || "无" }}</em>
                            </span>
                        </div>
                        <a class="u-action" href="" @click.prevent="getDownUrl(item.uuid, item.name)">下载</a>
                    </div>
                </div>
            </div>
        </div>

        <!--作者随机作品-->
        <div class="m-random-list"> 
            <span class="m-single-data-title">作者其他作品</span>
            <div class="u-list m-single-content-box" v-if="randomList.length">
                <bodyItem :noName="true" :item="item" v-for="item in randomList" :key="item.id" />
            </div>
            <span class="u-list-null m-single-content-box" v-else>· 作者没有更多作品了 ·</span>
        </div>
        <!--搭配随机作品-->
        <!-- <div class="m-pvxbody-list">
            <h3>搭配指南</h3>
            <div class="u-list m-single-content-box" v-if="faceList.length">
                <bodyItem :onlyPic="true" :item="pvxbody" />
                <faceItem :item="item" :noName="true" v-for="item in faceList" :key="item.id" />
            </div>
            <span class="u-list-null m-single-content-box" v-else>· 作者没有关联的作品 ·</span>
        </div> -->
        <!-- 上传作者区域 -->
        <authorItem :uid="post.user_id" />
        <!-- 点赞 -->
        <Thx
            class="m-thx m-single-content-box"
            :postId="id"
            postType="pvxbody"
            :postTitle="post.title || '无标题'"
            :userId="post.user_id"
            :adminBoxcoinEnable="post.status == 1"
            :userBoxcoinEnable="post.status == 1"
            :client="post.client"
        />
        <!-- 评论 -->
        <div class="m-single-content-box">
            <el-divider content-position="left">讨论</el-divider>
            <Comment :id="id" category="pvxbody" />
        </div>
    </div>
</template>

<script>
const single_pages = ["single"];
import {
    getOneBodyInfo,
    payBody,
    loopPayStatus,
    getAccessoryList,
    getDownUrl,
    getRandomBody,
    getRandomFaceAndBody,
    setStar,
    cancelStar,
    onlineBody,
    offlineBody,
    getSliders,
} from "@/service/body.js";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { getStat, postStat } from "@jx3box/jx3box-common/js/stat";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import { editLink, showAvatar, authorLink, resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { bodyMap } from "@jx3box/jx3box-data/data/role/body.json";
import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";

import dayjs from "@/plugins/day";
import Bodydat from "@jx3box/jx3box-facedat/src/Bodydat.vue";
import bodyItem from "@/components/body/item";
import faceItem from "@/components/face/item";
import authorItem from "@/components/face/author";
export default {
    name: "single",
    components: {
        Comment,
        // faceItem,
        Bodydat,
        bodyItem,
        authorItem,
    },
    data: function () {
        return {
            loading: false,
            search: "", //搜索值
            post: {},
            stat: {},
            has_buy: false, //是否购买
            client_map: __clients,
            downFileList: [],
            downloadParams: {
                pageIndex: 1,
                pageSize: 10,
                total: 0,
            },
            payBtnLoading: false,
            randomList: [],
            carouselActive: 0,
            isEditor: User.isEditor(),

            topic_info: null,
            pvxbody: {},
            faceList: [],
        };
    },
    computed: {
        publish_link() {
            return publishLink("body");
        },
        id: function () {
            return ~~this.$route.params.id;
        },
        isAuthor: function () {
            return this.post?.user_id == User.getInfo().uid || false;
        },
        bodydata: function () {
            const data = this.post?.data || "";
            const bodyData = {
                object: {},
            };
            try {
                if (data) {
                    bodyData.object = JSON.parse(JSON.parse(data));
                } else {
                    bodyData.object = data;
                }
            } catch {
                bodyData.object = JSON.parse(data);
            }
            return bodyData;
        },
        previewSrcList: function () {
            return this.post?.images || [];
        },
        canEdit: function () {
            return User.isEditor() || this.post?.user_id == User.getInfo().uid;
        },
        activePic: function () {
            return this.previewSrcList[this.carouselActive];
        },
        isSinglePage: function () {
            return single_pages.includes(this.$route.name);
        },
        //上下架状态
        status: function () {
            return this.$store.state.faceSingle?.status || 1;
        },
        statusText: function () {
            return this.status !== 1 ? "上架" : "下架";
        },
        isStar: function () {
            return this.$store.state.faceSingle?.star || 0;
        },
        starText: function () {
            return this.isStar ? "取消精选" : "精选";
        },
        topicText() {
            return this.topic_info ? `${dayjs.tz(this.topic_info.created_at).format("YYYY年MM月DD日")}荣登头条` : "";
        },
        showCarousel() {
            if (this.previewSrcList?.length > 0) return true;
            if (!this.has_buy) return true;
            return false;
        },
        tvLink() {
            return __Root + "index/tv";
        },
    },
    created: function () {
        this.getData();
    },
    methods: {
        imgLink: function (images) {
            return images?.length ? images[0] : "";
        },
        showAvatar(url) {
            return showAvatar(url, "l");
        },
        showThumbnail(url) {
            return resolveImagePath(url);
        },
        authorLink,
        editLink,
        getFaceList() {
            this.$router.push({ name: "list", query: { title: this.search } });
        },
        goBack() {
            document.title = "体型分享 - JX3BOX";
            this.$router.push({ name: "list" });
        },
        showClientLabel: function (val) {
            return this.client_map[val];
        },
        showBodyTypeLabel(val) {
            return bodyMap[val];
        },
        carouselChange(val) {
            this.carouselActive = val;
        },
        handlePreviewImage(index) {
            setTimeout(() => {
                const imageViewerChild = this.$refs.previewImage[index].$children[0];
                imageViewerChild && imageViewerChild.reset();
                imageViewerChild && (imageViewerChild.index = index);
            }, 0);
        },
        getData() {
            if (this.id) {
                this.loading = true;
                getOneBodyInfo(this.id)
                    .then((res) => {
                        this.post = this.$store.state.faceSingle = res.data.data;
                        document.title = this.post.title;
                        this.getAccessoryList();
                        //获取作者作品
                        this.getRandomFaceList();
                        this.getRandomList();
                        this.getSliders();
                    })
                    .catch((err) => {
                        this.loading = false;
                    });

                getStat("pvxbody", this.id).then((res) => {
                    this.stat = res.data;
                });
                postStat("pvxbody", this.id);
            }
        },
        downloadPageQuery(pageIndex) {
            this.downloadParams.pageIndex = pageIndex;
            this.getAccessoryList();
        },
        getAccessoryList() {
            getAccessoryList(this.id, this.downloadParams)
                .then((res) => {
                    const { page, list, has_buy } = res.data.data;
                    this.has_buy = has_buy ? has_buy : false;
                    if (has_buy) {
                        this.downFileList = list;
                        this.downloadParams.total = page.total;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getDownUrl(uuid) {
            getDownUrl(this.id, uuid).then((res) => {
                window.location.href = resolveImagePath(res.data.data?.url);
            });
        },
        facePay() {
            if (!User.isLogin()) {
                User.toLogin();
                return;
            }
            this.$confirm("确认购买此体型？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    let res = this.post;
                    let params = {
                        postType: "pvxbody",
                        PostId: res.id,
                        priceType: res.price_type,
                        priceCount: res.price_count,
                        accessUserId: res.user_id,
                        payUserId: User.getInfo().uid,
                    };
                    //支付
                    this.payBtnLoading = true;
                    payBody(params)
                        .then((res) => {
                            let payid = res.data.data.id;
                            // 轮询接口
                            let setIntervalId = setInterval(
                                loopPayStatus(payid).then((d) => {
                                    this.getPayFaceStatus(d.data.data.pay_status, setIntervalId);
                                }, 1000)
                            );
                        })
                        .catch((err) => {
                            // 余额不足
                            if (err.response?.data?.code == 40019) {
                                this.$confirm("余额不足，是否前往充值？", "提示", {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning",
                                })
                                    .then(() => {
                                        window.open("/vip/cny", "_blank");
                                    })
                                    .catch(() => {});
                            }
                        })
                        .finally(() => {
                            this.payBtnLoading = false;
                        });
                })
                .catch(() => {});
        },
        getPayFaceStatus(pay_status, setIntervalId) {
            if (pay_status == 1) {
                this.payBtnLoading = false;
                clearInterval(setIntervalId);
                //购买成功后需要重载数据，拉取下载列表
                this.getData();
                this.$notify.success({
                    title: "成功",
                    message: "购买成功",
                });
            } else if (pay_status == 2) {
                this.payBtnLoading = false;
                clearInterval(setIntervalId);
                this.$notify.error({
                    title: "失败",
                    message: "支付失败",
                });
            }
        },
        getRandomFaceList() {
            const { user_id } = this.post;
            getRandomBody({ user_id, limit: 8 }).then((res) => {
                if (res.data.data.list && res.data.data.list.length > 0) {
                    this.randomList = res.data.data.list;
                }
            });
        },
        getRandomList() {
            const { body_type, client, user_id } = this.post;
            getRandomFaceAndBody({ body_type, client, user_id, limit: 8 }).then((res) => {
                const { pvxbody, faceList } = res.data.data;
                this.pvxbody = pvxbody;
                this.faceList = faceList || [];
            });
        },
        showPic(url) {
            return resolveImagePath(url);
        },
        starSet() {
            this.$confirm("确认" + (this.isStar ? "取消精选" : "精选") + "该捏脸？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        instance.confirmButtonLoading = true;
                        if (this.isStar) {
                            //取精
                            cancelStar(this.id)
                                .then(() => {
                                    this.$store.state.faceSingle.star = 0;
                                    done();
                                    this.$notify({
                                        title: "成功",
                                        message: "取消精选成功",
                                        type: "success",
                                    });
                                })
                                .finally(() => {
                                    instance.confirmButtonLoading = false;
                                });
                        } else {
                            //精
                            setStar(this.id)
                                .then(() => {
                                    this.$store.state.faceSingle.star = 1;
                                    done();
                                    this.$notify({
                                        title: "成功",
                                        message: "精选成功",
                                        type: "success",
                                    });
                                })
                                .finally(() => {
                                    instance.confirmButtonLoading = false;
                                });
                        }
                    } else {
                        instance.confirmButtonLoading = false;
                        done();
                    }
                },
            });
        },
        statusSet() {
            //上下架操作，根据是否isEditor，在接口内调用管理和作者分别的接口
            this.$confirm("确认" + (this.status == 1 ? "下架" : "上架") + "该捏脸？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        instance.confirmButtonLoading = true;
                        if (this.status == 1) {
                            //下架
                            offlineBody(this.id, this.isEditor)
                                .then(() => {
                                    this.$store.state.faceSingle.status = 2;
                                    done();
                                    this.$notify({
                                        title: "成功",
                                        message: "下架成功",
                                        type: "success",
                                    });
                                })
                                .finally(() => {
                                    instance.confirmButtonLoading = false;
                                });
                        } else {
                            //上架
                            onlineBody(this.id, this.isEditor)
                                .then(() => {
                                    this.$store.state.faceSingle.status = 1;
                                    done();
                                    this.$notify({
                                        title: "成功",
                                        message: "上架成功",
                                        type: "success",
                                    });
                                })
                                .finally(() => {
                                    instance.confirmButtonLoading = false;
                                });
                        }
                    } else {
                        instance.confirmButtonLoading = false;
                        done();
                    }
                },
            });
        },

        // 判断是否上过头条
        getSliders() {
            getSliders("slider", this.post.client, 10, this.post.id).then((res) => {
                if (res.data.data?.list) {
                    // 取创建时间最新的一条
                    const list = res.data.data.list.sort((a, b) =>
                        dayjs.tz(b.created_at).isAfter(dayjs.tz(a.created_at)) ? 1 : -1
                    );
                    this.topic_info = list[0];
                }
            });
        },

        // 将图片地址替换为cdn
        resolveImageArr(arr) {
            return arr.map((item) => resolveImagePath(item));
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/face/single.less";
</style>
