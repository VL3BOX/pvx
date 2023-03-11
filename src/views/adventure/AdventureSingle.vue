<template>
    <div class="p-adventure-single" v-if="id" v-loading="loading">
        <div class="m-adventure-navigation">
            <el-button class="u-goback" size="medium" @click="goBack" plain>返回列表</el-button>
            <!-- <el-input
                placeholder="请输入奇遇或宠物名字搜索"
                v-model="search"
                class="u-input"
                @keyup.enter.native="goSearch"
            >
                <el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button>
            </el-input> -->
        </div>
        <div class="m-adventure-header">
            <span class="m-adventure-title">{{ title }}</span>
            <div class="m-trigger-links">
                <a class="u-link u-achievement" :href="getLink('cj', achieve_id)" target="_blank">
                    <i class="el-icon-trophy"></i>
                    成就信息
                </a>
            </div>
        </div>
        <div class="m-adventure-content">
            <task :id="id" :info="data" />
        </div>
        <div class="m-adventure-wiki" v-if="achieve_id">
            <Wiki
                source_type="achievement"
                :source_id="achieve_id"
                :type="type"
                :id="id"
                title="奇遇攻略"
                :source_title="title"
            ></Wiki>
        </div>
        <div class="m-adventure-serendipity">
            <Serendipity :title="title" />
        </div>
        <!-- <div class="m-pvx-comment">
            <Comment :id="id" :category="type" order="desc" />
        </div> -->
        <!-- 百科评论 -->
        <WikiComments :type="type" :source-id="id" />
    </div>
</template>

<script>
import { getLink } from "@jx3box/jx3box-common/js/utils";
import Wiki from "@/components/wiki/Wiki.vue";
import { getAdventure, getSerendipityAchievementId } from "@/service/adventure";
import task from "@/components/adventure/task.vue";
import Serendipity from "@/components/common/serendipity.vue";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import { postStat } from "@jx3box/jx3box-common/js/stat.js";
import WikiComments from "@jx3box/jx3box-common-ui/src/wiki/WikiComments";
export default {
    name: "adventureSingle",
    props: [],
    components: {
        Wiki,
        task,
        Serendipity,
        // Comment,
        WikiComments,
    },
    data: function () {
        return {
            type: "adventure",
            achieve_id: "",
            data: "",
            task: [],
            isPet: true,
            loading: false,
            search: "",
        };
    },
    computed: {
        id: function () {
            return this.$route.params.id;
        },
        title: function () {
            return this.data?.szName;
        },
    },
    watch: {
        id: {
            immediate: true,
            handler: function (val) {
                if (val) {
                    this.getData();
                }
            },
        },
    },
    methods: {
        getLink,
        goBack() {
            this.$router.push({ name: "list" });
        },
        getData() {
            this.loading = true;
            getAdventure(this.id)
                .then((res) => {
                    this.isPet = false;
                    this.data = res.data;
                })
                .finally(() => {
                    this.loading = false;
                    postStat(this.type, this.id);
                });
            getSerendipityAchievementId(this.id).then((res) => {
                this.achieve_id = res.data.achievement_id;
            });
        },
        goSearch() {
            this.$router.push({ name: "list", params: { search: this.search } });
        },
    },
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/adventure/single.less";
</style>
