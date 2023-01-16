<template>
    <div class="v-face-single" v-loading="loading">
        <div class="m-navigation">
            <el-button class="u-goback" size="medium" icon="el-icon-arrow-left" @click="goBack" plain
                >返回列表</el-button
            >
            <el-input
                placeholder="请输入搜索内容"
                v-model="search"
                class="input-with-select"
                @keyup.enter.native="getFaceList"
            >
                <span slot="prepend">关键词</span>
                <el-button slot="append" icon="el-icon-search" @click="getFaceList"></el-button>
            </el-input>
        </div>
        <!-- 海报banner -->
        <div class="m-banner" v-if="post.banner">
            <img :src="showThumbnail(post.banner)" />
        </div>
        <!-- 基本信息 -->
        <div class="m-header">
            <Avatar
                :uid="post.user_id"
                :url="post.user_avatar"
                :frame="post.user_avatar_frame"
                class="u-avatar"
                v-if="!!post.original"
            />
            <h2 class="u-title">{{ post.title || "无标题" }}</h2>
            <div class="u-info">
                <div class="u-author">
                    By
                    <a class="u-name" :href="authorLink(post.user_id)" target="_blank" v-if="!!post.original">{{
                        post.display_name
                    }}</a>
                    <a class="u-name" :href="post.author_link" target="_blank" v-else-if="post.author_link">{{
                        post.author_name
                    }}</a>
                    <span class="u-name" v-else>{{ post.author_name }}</span>
                    <time class="u-time">{{ post.updated_at }}</time>
                    <a v-if="canEdit" :href="editLink('face', post.id)" target="_blank">
                        <i class="el-icon-edit-outline u-edit-icon"></i>
                        编辑
                    </a>
                </div>

                <div class="u-meta">
                    <i class="u-mark" v-if="!!post.star">★ 编辑推荐</i>
                    <i class="u-original" v-if="!!post.original">原创</i>
                    <i class="u-client" :class="post.client || 'std'">{{ showClientLabel(post.client) }}</i>
                    <i class="u-bodytype" :class="'u-bodytype-' + post.body_type" v-if="post.body_type">{{
                        showBodyTypeLabel(post.body_type)
                    }}</i>
                </div>
            </div>
            <div class="u-desc" v-if="post.remark">{{ post.remark }}</div>
            <el-divider content-position="left"> <i class="el-icon-pie-chart"></i> 预览</el-divider>
        </div>

        <div class="m-single-pics" v-if="previewSrcList && previewSrcList.length > 0">
            <!-- 动态改为当前图片 -->
            <div class="u-bg">
                <img :src="showPic(activePic)">
                <div class="u-mask"></div>
            </div>
            <el-carousel class="m-carousel" :interval="4000" type="card" arrow="always">
                <el-carousel-item v-for="(item, i) in previewSrcList" :key="i">
                    <div class="m-face-pic">
                        <el-image
                            ref="previewImage"
                            fit="contain"
                            :src="showPic(item)"
                            class="u-pic"
                            :preview-src-list="previewSrcList"
                            @click.capture="handlePreviewImage(i)"
                        ></el-image>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>
        <!-- 购买区 -->
        <div class="m-face-pay" v-if="post.price_type && post.price_type != 0 && !has_buy">
            <div class="m-face-pay-info">
                价格：
                <el-tag effect="plain" type="warning">
                    <span v-if="post.price_type == 1">{{ post.price_count }} 盒币</span>
                    <span v-if="post.price_type == 2">{{ post.price_count }} 金箔</span>
                </el-tag>
            </div>
            <div class="m-face-pay-btn">
                <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-shopping-cart-2"
                    @click="facePay"
                    :loading="payBtnLoading"
                    >购买</el-button
                >
            </div>
        </div>
        <!-- 数据区 -->
        <div class="m-single-data" v-if="has_buy && facedata">
            <el-divider content-position="left">独家数据分析</el-divider>
            <facedata v-if="facedata" :data="facedata" />
        </div>
        <!--下载区-->
        <div class="m-face-files" v-if="has_buy && downFileList && downFileList.length > 0">
            <el-divider content-position="left">原始文件列表</el-divider>
            <ul class="m-face-files-list">
                <li v-for="item in downFileList" :key="item.id">
                    <span class="u-label">版本 : {{ item.created_at }}</span>
                    <el-button
                        class="u-action"
                        icon="el-icon-download"
                        size="mini"
                        type="primary"
                        round
                        @click="getDownUrl(item.uuid)"
                        >下载</el-button
                    >
                </li>
            </ul>
        </div>
        <!--作者随机作品-->
        <div class="m-random-list">
            <el-divider content-position="left">作者其他作品</el-divider>
            <div class="u-list">
                <a class="u-item" :href="`/face/` + item.id" target="_blank" v-for="item in randomList" :key="item.id">
                    <div class="u-pic">
                        <el-image v-if="item.images" fit="cover" :src="showPic(item.images[0])">
                            <div slot="error" class="u-image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </div>
                    <div class="u-name" :title="item.title">{{ item.title || "未命名" }}</div>
                </a>
            </div>
        </div>
        <!-- 点赞 -->
        <Thx
            class="m-thx"
            :postId="id"
            postType="face"
            :postTitle="post.title || '无标题'"
            :userId="post.user_id"
            :adminBoxcoinEnable="true"
            :userBoxcoinEnable="true"
        />
        <!-- 评论 -->
        <div>
            <el-divider content-position="left">讨论</el-divider>
            <Comment :id="id" category="face" />
        </div>
    </div>
</template>

<script>
import { getOneFaceInfo, payFace, loopPayStatus, getAccessoryList, getDownUrl, getRandomFace } from "@/service/face.js";
import { getStat, postStat } from "@jx3box/jx3box-common/js/stat";
import facedata from "@jx3box/jx3box-facedat/src/Facedat.vue";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import {
    editLink,
    showMinibanner,
    showBanner,
    showAvatar,
    authorLink,
    resolveImagePath,
} from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { bodyMap } from "@jx3box/jx3box-data/data/role/body.json";
import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "single",
    components: { facedata, Comment },
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
                pageSize: 4,
                total: 0,
            },
            payBtnLoading: false,
            randomList: [],
        };
    },
    computed: {
        id: function () {
            return this.$route.params.id;
        },
        isAuthor: function () {
            return this.post?.user_id == User.getInfo().uid || false;
        },
        facedata: function () {
            return this.post?.data || "";
        },
        previewSrcList: function () {
            return this.post?.images || [];
        },
        canEdit: function () {
            return User.isEditor() || this.post?.user_id == User.getInfo().uid;
        },
        // TODO:改为当前图片
        activePic: function () {
            return this.previewSrcList[0];
        },
    },
    watch: {},
    created: function () {
        this.getData();
    },
    methods: {
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
            document.title = "捏脸分享 - JX3BOX";
            this.$router.push({ name: "list" });
        },
        showClientLabel: function (val) {
            return this.client_map[val];
        },
        showBodyTypeLabel(val) {
            return bodyMap[val];
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
                getOneFaceInfo(this.id)
                    .then((res) => {
                        this.post = this.$store.state.faceSingle = res.data.data;
                        document.title = this.post.title;
                        this.getAccessoryList();
                        //获取作者作品
                        this.getRandomFaceList();
                    })
                    .catch((err) => {
                        this.loading = false;
                    });

                getStat("face", this.id).then((res) => {
                    this.stat = res.data;
                });
                postStat("face", this.id);
            }
        },
        downloadPageQuery(pageIndex) {
            this.downloadParams.pageIndex = pageIndex;
            this.getAccessoryList();
        },
        getAccessoryList() {
            getAccessoryList(this.id, this.downloadParams)
                .then((res) => {
                    let data = res.data.data;
                    this.has_buy = data.has_buy;
                    if (data.has_buy) {
                        this.downFileList = data.list;
                        this.downloadParams.total = data.page.total;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getDownUrl(uuid) {
            getDownUrl(this.id, uuid).then((res) => {
                window.location.href = res.data.data?.url;
            });
        },
        facePay() {
            let res = this.post;
            let params = {
                postType: "face",
                PostId: res.id,
                priceType: res.price_type,
                priceCount: res.price_count,
                accessUserId: res.user_id,
                payUserId: User.getInfo().uid,
            };
            //支付
            this.payBtnLoading = true;
            payFace(params).then((res) => {
                let payid = res.data.data.id;
                // 轮询接口
                let setIntervalId = setInterval(
                    loopPayStatus(payid).then((d) => {
                        this.getPayFaceStatus(d.data.data.pay_status, setIntervalId);
                    }, 1000)
                );
            });
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
            let post = this.post;
            let params = {
                user_id: post.user_id,
                limit: 8,
            };
            getRandomFace(params).then((res) => {
                if (res.data.data.list && res.data.data.list.length > 0) {
                    this.randomList = res.data.data.list;
                }
            });
        },
        showPic(url) {
            return resolveImagePath(url);
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/face/single.less";
</style>
