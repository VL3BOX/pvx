<template>
    <div class="v-question-single" v-loading="loading">
        <div class="m-goback">
            <el-button class="u-back" size="mini" icon="el-icon-arrow-left" @click="goBack">返回列表</el-button>
        </div>
        <SingleTitle :item="data" type="question" />
        <SingleCard :item="data" :answer="answer" :isSubmitted="isSubmitted" @changeVal="finalAnswer" />
        <div class="m-exam-submit" @click="submit" :class="{ isSubmitted }">
            <el-button class="u-btn" :disabled="isSubmitted">提交</el-button>
        </div>

        <Thx
            class="m-thx"
            :postId="id"
            postType="question"
            :postTitle="title"
            :userId="user_id"
            :adminBoxcoinEnable="true"
            :userBoxcoinEnable="true"
            :client="client"
        />
        <div class="m-single-comment">
            <el-divider content-position="left">评论</el-divider>
            <Comment :id="id" category="question" />
        </div>
    </div>
</template>
<script>
import SingleCard from "@/components/exam/single_card";
import SingleTitle from "@/components/exam/single_title";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import { postStat } from "@jx3box/jx3box-common/js/stat.js";
import { getQuestion, submitQuestionAnswer } from "@/service/exam.js";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "QuestionSingle",
    props: [],
    components: { SingleCard, SingleTitle, Comment },
    data: function () {
        return {
            data: {},
            answer: "",
            userAnswers: {},
            isSubmitted: false,
            loading: false,
        };
    },
    computed: {
        id() {
            return ~~this.$route.params.id;
        },
        user_id() {
            return this.data.createUserId;
        },
        title: function () {
            return this.data.title;
        },
        client() {
            return this.data.client || "all";
        },
    },
    watch: {},
    methods: {
        loadData() {
            this.loading = true;
            getQuestion(this.id)
                .then((res) => {
                    let data = res.data;
                    data.tags = JSON.parse(data.tags);
                    data.options = JSON.parse(data.options);
                    this.data = data;

                    postStat("question", this.id);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        finalAnswer(val) {
            this.userAnswers = {
                ...this.userAnswers,
                ...val,
            };
        },
        submit() {
            if (!User.isLogin()) return this.$message.error("请先登录");
            if (JSON.stringify(this.userAnswers) == "{}") {
                this.$alert("你没有选择答案哦~", "提交失败", {
                    type: "error",
                });
            } else {
                let submitList = {};
                let obj = this.userAnswers;
                for (const key in obj) {
                    submitList = obj[key].map((o) => this.data.options[o]);
                }
                submitQuestionAnswer(this.id, submitList).then((res) => {
                    if (res.data) {
                        document.documentElement.scrollTop = 0;
                        res.data.question.answerList = res.data.question.answerList.sort();
                        this.answer = {
                            ...res.data.question,
                            myAnswer: this.userAnswers[this.id].sort(),
                        };
                        this.isSubmitted = true;
                    }
                });
            }
        },
        goBack: function () {
            this.$router.push({ name: "index", params: { type: "question" } });
        },
    },
    filters: {},
    created: function () {
        this.loadData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/exam/exam.less";
@import "~@/assets/css/exam/single_title.less";
@import "~@/assets/css/exam/single_card.less";
</style>
