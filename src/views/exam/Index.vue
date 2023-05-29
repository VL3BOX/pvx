<template>
    <div ref="listRef" class="p-exam" v-loading="loading">
        <PvxSearch class="m-exam-search" :items="searchProps" :initValue="initValue" @search="searchEvent($event)">
            <a
                v-if="publishText"
                class="u-search-btn u-publish"
                :class="`u-publish__${search.type}`"
                href="javascript:;"
                slot="default"
                @click="toPublish"
            >
                <i v-if="search.type === 1" class="el-icon-warning"></i>
                <span>{{ publishText }}</span>
            </a>
            <!-- <div v-if="[2, 3].includes(search.type)" class="m-exam-search__extra" slot="extra">
                <div class="u-extra-title">筛选 <i class="el-icon-caret-top"></i></div>
                <div class="m-filter-tags">
                    <span
                        @click="selected(item)"
                        class="u-tag"
                        v-for="(item, i) in tags"
                        :key="i"
                        :class="search.tag === item.key ? 'is-active' : ''"
                        >{{ item.value }}</span
                    >
                </div>
                <div class="m-filter-tags">
                    <span
                        @click="switchClient(item)"
                        class="u-tag"
                        v-for="(item, i) in clients"
                        :key="i"
                        :class="search.client === item.key ? 'is-active' : ''"
                        >{{ item.value }}</span
                    >
                </div>
            </div> -->
        </PvxSearch>
        <div class="m-exam-content">
            <!-- 列表 -->
            <template v-if="data && data.length">
                <ImperialExamList v-if="search.type === 1" :data="data"></ImperialExamList>
                <QuestionList v-if="search.type === 2" :data="data"></QuestionList>
                <PaperList v-if="search.type === 3" :data="data"></PaperList>
            </template>
            <!-- 空 -->
            <el-empty v-else description="没有找到相关条目" :image-size="100"></el-empty>
            <!-- 分页 -->
            <el-pagination
                v-if="search.type !== 1 && data.length"
                class="m-exam-pagination"
                background
                :page-size="query.pageSize"
                :hide-on-single-page="true"
                :current-page.sync="query.pageIndex"
                layout="total, prev, pager, next, jumper"
                :total="totalPages"
                @current-change="pageChange"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
import { getExamPaperList, getExamQuestionList, getExamRandom } from "@/service/exam.js";
import PvxSearch from "@/components/PvxSearch.vue";
import ImperialExamList from "@/components/exam/imperial_exam_list.vue";
import PaperList from "@/components/exam/paper_list.vue";
import QuestionList from "@/components/exam/question_list.vue";
import tags from "@/assets/data/exam_tags.json";
import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";
import { cloneDeep } from "lodash";
import { deleteNull } from "@/utils/index";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "ExamList",
    components: {
        PvxSearch,
        ImperialExamList,
        PaperList,
        QuestionList,
    },
    data() {
        return {
            loading: false,
            query: {
                pageIndex: 1,
                pageSize: 16,
            },
            total: 0,
            totalPages: 0,
            search: {
                // tag: "",
                // client: "",
            },
            initValue: {
                type: 2,
                tag: "",
                client: "",
            },
            searchProps: [
                {
                    key: "type",
                    name: "类型",
                    type: "radio",
                    options: [
                        {
                            type: 0,
                            name: "全部",
                        },
                        {
                            type: 1,
                            name: "科举题库",
                        },
                        {
                            type: 2,
                            name: "创作题库",
                        },
                        {
                            type: 3,
                            name: "模拟考试",
                        },
                        {
                            type: 4,
                            name: "剑三高考",
                        },
                    ],
                },
                {
                    type: "filter",
                    key: "filter",
                    name: "过滤",
                    options: [],
                },
                {
                    key: "title",
                    name: "关键词",
                },
            ],
            data: [],
        };
    },
    computed: {
        hasNextPage: function () {
            return this.totalPages > 1 && this.query.page < this.totalPages;
        },
        // 发布按钮链接
        publishText: function () {
            let text = "";
            const type = this.search.type;
            if (type === 1) {
                text = "缺题补充";
            }
            if (type === 2) {
                text = "我要出题";
            }
            if (type === 3) {
                text = "我要出卷";
            }
            return text;
        },
        tags() {
            return tags.map((item) => {
                return {
                    key: item === "全部" ? "" : item,
                    value: item,
                };
            });
        },
        clients() {
            let arr = [];
            for (const key in __clients) {
                arr.unshift({ key, value: __clients[key] });
            }
            arr.unshift({ key: "", value: "全部" });
            return arr;
        },
        params() {
            return { ...this.query, ...this.search };
        },
    },
    watch: {
        "search.type"(type) {
            if (type === 1) {
                this.data = [];
                this.loadImperialExam();
            }
            if (type === 2 || type === 3) {
                const tags = this.tags;
                const hasTag = this.searchProps[1].options.find((item) => item.key === "tag");
                if (hasTag) {
                    this.searchProps[1].options.map((item) => {
                        if (item.key === "tag") {
                            item.options = tags;
                        }
                        return item;
                    });
                } else {
                    this.searchProps[1].options.push({
                        key: "tag",
                        type: "radio",
                        name: "标签",
                        options: tags,
                    });
                }
                const clients = this.clients;
                const hasClient = this.searchProps[1].options.find((item) => item.key === "client");
                if (hasClient) {
                    this.searchProps[1].options.map((item) => {
                        if (item.key === "client") {
                            item.options = clients;
                        }
                        return item;
                    });
                } else {
                    this.searchProps[1].options.push({
                        key: "client",
                        type: "radio",
                        name: "平台",
                        options: clients,
                    });
                }
            } else {
                this.searchProps.map((item) => {
                    if (item.type === "filter") {
                        item.options = [];
                    }
                    return item;
                });
            }
        },
        search: {
            immediate: true,
            deep: true,
            handler() {
                this.query.pageIndex = 1;
                this.load();
            },
        },
    },
    methods: {
        toPublish() {
            if (!User.isLogin()) {
                User.toLogin();
                return;
            }
            const type = this.search.type;
            if (type === 2) {
                this.$router.push({ name: "questionPublish" });
            }
        },
        load() {
            const type = this.search.type;
            switch (type) {
                case 0:
                    break;
                case 2:
                    this.loadMethod(getExamQuestionList);
                    break;
                case 3:
                    this.loadMethod(getExamPaperList);
                    break;
                case 4:
                    break;
            }
        },
        selected(val) {
            this.search.tag = val.key;
        },
        switchClient(val) {
            this.search.client = val.key;
        },
        searchEvent(data) {
            const search = cloneDeep(this.search);
            this.search = {
                ...search,
                ...data,
            };
        },
        loadMethod(fun) {
            const params = deleteNull(cloneDeep(this.params));
            if (this.data.length && this.data[0]?.paramsType !== params.type) {
                this.data = [];
            }
            this.loading = true;
            fun(params)
                .then((res) => {
                    const data = res.data?.data || [];
                    this.data = data.map((item) => {
                        return {
                            ...item,
                            paramsType: params.type,
                        };
                    });
                    this.totalPages = res.data?.page?.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadImperialExam() {
            this.loading = true;
            getExamRandom()
                .then((res) => {
                    this.data = res.data?.data || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        pageChange() {
            this.load();
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/exam/index.less";
</style>
