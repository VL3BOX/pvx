<template>
    <div class="v-share-list m-face" v-loading="loading">
        <faceTabs @change="handleFaceTabChange" :body_types="body_types" :active="active" @setActive="setActive" />

        <template>
            <div class="u-title u-recommend-title">编辑推荐</div>
            <div
                class="m-recommend-list"
                @mousewheel="crosswiseScrool($event, 'recommend')"
                @wheel="crosswiseScrool($event, 'recommend')"
                id="recommend"
            >
                <faceRecommend v-for="item in slidersList" :key="item.id" :item="item"></faceRecommend>
            </div>
        </template>
        <template v-if="!showAllList">
            <div v-for="(item, index) in list_type" :key="'l' + index">
                <div class="u-type">
                    <div class="u-title">{{ item.name }}</div>
                    <div class="u-all" @click="setActive(item.value)">查看全部</div>
                </div>
                <div
                    class="m-share-list"
                    @mousewheel="crosswiseScrool($event, 'nav')"
                    @wheel="crosswiseScrool($event, 'nav' + index)"
                    :id="'nav' + index"
                >
                    <faceItem v-for="item in item.list" :key="item.id" :item="item" />
                </div>
            </div>
        </template>
        <template v-if="showAllList">
            <div class="u-type">
                <div class="u-title">{{ body_types_name() }}</div>
            </div>
            <div class="m-share-allList">
                <faceItem v-for="item in list" :key="item.id" :item="item" />
            </div>
            <el-button
                class="m-archive-more"
                v-show="hasNextPage"
                type="primary"
                @click="appendPage"
                :loading="loading"
                icon="el-icon-arrow-down"
                >加载更多</el-button
            >
            <el-pagination
                class="m-archive-pages"
                background
                layout="total, prev, pager, next, jumper"
                :hide-on-single-page="true"
                :page-size="per_page"
                :total="total"
                :current-page.sync="page"
            ></el-pagination>
        </template>
        <el-alert v-if="isNoRes()" class="m-archive-null" :title="alertTitle" type="info" center show-icon></el-alert>
    </div>
</template>
<script>
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { getFaceList, getSliders } from "@/service/face";
import faceRecommend from "@/components/face/v2/recommend";
import faceTabs from "@/components/face/v2/tabs";
import faceItem from "@/components/face/v2/item";
import { clone } from "lodash";
import { isPhone } from "@/utils/index";
export default {
    name: "face",
    components: {
        faceRecommend,
        faceTabs,
        faceItem,
    },
    data() {
        return {
            tabsData: {},
            body_types: [
                {
                    value: "",
                    label: "全部",
                },
                {
                    value: 1,
                    label: "成男",
                },
                {
                    value: 2,
                    label: "成女",
                },
                {
                    value: 5,
                    label: "正太",
                },
                {
                    value: 6,
                    label: "萝莉",
                },
            ],
            active: "",
            list: [],
            list_type: [
                { name: "成男脸型", list: [], value: 1 },
                { name: "成女脸型", list: [], value: 2 },
                { name: "正太脸型", list: [], value: 5 },
                { name: "萝莉脸型", list: [], value: 6 },
            ],
            page: 1,
            // per_page: 14,
            pageTotal: 1,
            total: 0,
            appendMode: false,
            loading: false,
            scrollLeft: 0,
            showAllList: false, //是否显示单独某项全部
            slidersList: [],
        };
    },
    computed: {
        publish_link() {
            return publishLink("face");
        },
        client() {
            return this.$store.state.client;
        },
        params({ tabsData }) {
            return {
                ...tabsData,
                pageIndex: this.page,
                client: this.client,
            };
        },
        hasNextPage() {
            return this.page < this.pageTotal;
        },
        alertTitle: function () {
            if (this.title) return "没找到对应的捏脸，请重新选择条件或关键词搜索";
            return "没有找到相关的捏脸";
        },
        per_page: function () {
            let count = 18;
            let w = window.innerWidth;

            // 根据分辨率设置
            if (w < 768) {
                count = 6;
            } else if (w < 992) {
                count = 12;
            } else if (w < 1600) {
                count = 15;
            } else if (w < 1920) {
                count = 18;
            } else {
                count = 21;
            }

            return count;
        },
    },
    watch: {
        params: {
            deep: true,
            handler(val) {
                this.getFaceListInit();
            },
        },
    },
    created() {
        this.getSliders();
    },
    methods: {
        isNoRes() {
            let type = this.params.body_type;
            if (!type) {
                return (
                    this.list_type[0].list.length == 0 &&
                    this.list_type[1].list.length == 0 &&
                    this.list_type[2].list.length == 0 &&
                    this.list_type[3].list.length == 0
                );
            }
            return this.list.length > 0;
        },
        setActive(val) {
            this.active = val;
        },
        body_types_name() {
            let type = this.params.body_type;
            if (!type) return;
            const nameMap = {
                1: () => "成男脸型",
                2: () => "成女脸型",
                5: () => "正太脸型",
                6: () => "萝莉脸型",
            };
            return nameMap[type]();
        },
        getSliders() {
            getSliders("slider", this.client, 9).then((res) => {
                this.slidersList = res.data.data.list || [];
            });
        },
        getFaceListInit: function () {
            this.loading = true;
            this.noRes = false;
            if (!this.params.body_type) {
                this.showAllList = false;
                let typeArr = [1, 2, 5, 6];
                typeArr.forEach((e) => {
                    let params = clone(this.params);
                    params.pageSize = 14;
                    params.body_type = e;
                    this.getFaceList(params);
                });
            } else {
                let params = clone(this.params);
                params.pageSize = this.per_page;
                this.getFaceList(params);
            }
        },
        getFaceList(params) {
            getFaceList(params)
                .then((res) => {
                    if (this.appendMode) {
                        this.list = this.list.concat(res.data.data.list || []);
                    } else {
                        if (!this.params.body_type) {
                            //分别赋值
                            const typesMap = {
                                1: () => (this.list_type[0].list = res.data.data.list || []),
                                2: () => (this.list_type[1].list = res.data.data.list || []),
                                5: () => (this.list_type[2].list = res.data.data.list || []),
                                6: () => (this.list_type[3].list = res.data.data.list || []),
                            };
                            typesMap[params.body_type]();
                        } else {
                            this.showAllList = true;
                            this.list = res.data.data.list || [];
                        }
                    }
                    if (this.params.body_type) {
                        this.total = res.data.data.page.total;
                        this.pageTotal = res.data.data.page.pageTotal;
                    }
                    this.$forceUpdate();
                })
                .finally(() => {
                    this.loading = false;
                    this.appendMode = false;
                });
        },
        appendPage: function () {
            this.appendMode = true;
            this.page = this.page + 1;
        },
        handleFaceTabChange: function (data) {
            this.page = 1;
            this.tabsData = data;
        },
        crosswiseScrool(event, id) {
            if (isPhone()) {
                return;
            }
            event.preventDefault();
            // 获取要绑定事件的元素
            const nav = document.getElementById(id);
            // 获取滚动方向
            const detail = event.wheelDelta || event.detail;
            // 定义滚动方向，其实也可以在赋值的时候写
            const moveForwardStep = 1;
            const moveBackStep = -1;
            // 定义滚动距离
            let step = 0;
            // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
            if (detail < 0) {
                step = moveForwardStep * 100;
            } else {
                step = moveBackStep * 100;
            }
            // 对需要滚动的元素进行滚动操作
            nav.scrollLeft += step;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/face/v2/list.less";
</style>
