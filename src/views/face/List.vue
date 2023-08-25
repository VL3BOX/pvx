<template>
    <div class="p-face-list" v-loading="loading">
        <faceTabs
            @change="handleFaceTabChange"
            :body_types="body_types"
            :link="link"
            :active="active"
            @setActive="setActive"
        />

        <template v-if="!showAllList">
            <div class="m-recommend-box" @mouseenter="mouseenter($event)" @mouseleave="mouseleave($event)">
                <div class="u-title u-recommend-title">编辑推荐</div>
                <div
                    class="u-shade-btn u-shade-btn-left"
                    :class="isDisabled('recommend', 1, isUpdate)"
                    @click="crosswiseScroll($event, 'recommend', 1, 840)"
                >
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div
                    class="u-shade-btn u-shade-btn-right"
                    :class="isDisabled('recommend', -1, isUpdate)"
                    @click="crosswiseScroll($event, 'recommend', -1, 840)"
                >
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="m-recommend-list" id="recommend">
                    <faceRecommend
                        v-for="item in slidersList"
                        :key="item.id"
                        :item="item"
                        :reporter="{ aggregate: listId(list) }"
                    ></faceRecommend>
                </div>
            </div>
        </template>
        <template v-if="!showAllList">
            <div
                v-for="(item, index) in list_type"
                :key="'l' + index"
                class="m-face-box"
                @mouseenter="mouseenter($event)"
                @mouseleave="mouseleave($event)"
            >
                <div class="u-type" v-if="item.client.indexOf(client) != -1 && item.list.length > 0">
                    <div class="u-title">{{ item.name }}</div>
                    <div class="u-all" @click="setActive(item.value)">查看全部</div>
                </div>
                <div
                    class="u-shade-btn u-shade-btn-left"
                    :class="isDisabled('nav' + index, 1, isUpdate)"
                    @click="crosswiseScroll($event, 'nav' + index, 1, 600)"
                >
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div
                    class="u-shade-btn u-shade-btn-right"
                    :class="isDisabled('nav' + index, -1, isUpdate)"
                    @click="crosswiseScroll($event, 'nav' + index, -1, 600)"
                >
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="m-face-list" :id="'nav' + index">
                    <faceItem
                        v-for="item in item.list"
                        :key="item.id"
                        :item="item"
                        :reporter="{ aggregate: listId(list) }"
                    />
                </div>
            </div>
        </template>
        <template v-if="showAllList">
            <div class="m-face-title u-type">
                <div class="u-title">{{ body_types_name() }}</div>
            </div>
            <div class="m-face-list--all">
                <faceItem v-for="item in list" :key="item.id" :item="item" :reporter="{ aggregate: listId(list) }" />
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
import faceRecommend from "@/components/face/recommend";
import faceTabs from "@/components/face/tabs";
import faceItem from "@/components/face/item";
import body_types from "@/assets/data/body_types.json";
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
            body_types,
            active: "",
            list: [],
            list_type: [
                { name: "成男脸型", list: [], value: 1, client: ["std", "origin"] },
                { name: "成女脸型", list: [], value: 2, client: ["std", "origin"] },
                { name: "正太脸型", list: [], value: 5, client: ["std"] },
                { name: "萝莉脸型", list: [], value: 6, client: ["std", "origin"] },
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
            isUpdate: false,
            link: {
                data: "/face/facedata",
                key: "face",
            },
        };
    },
    computed: {
        publish_link() {
            return publishLink("face");
        },
        client() {
            // return "origin";
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
                // return false;
                return (
                    this.list_type[0].list.length == 0 &&
                    this.list_type[1].list.length == 0 &&
                    this.list_type[2].list.length == 0 &&
                    this.list_type[3].list.length == 0
                );
            }
            return this.list.length > 0 ? false : true;
        },
        setActive(val) {
            this.active = val;
            document.documentElement.scrollTop = 0;
        },
        mouseenter(e) {
            if (isPhone()) {
                return;
            }
            e.target.getElementsByClassName("u-shade-btn")[0].style.visibility = "visible";
            e.target.getElementsByClassName("u-shade-btn")[1].style.visibility = "visible";
        },
        mouseleave(e) {
            if (isPhone()) {
                return;
            }
            e.target.getElementsByClassName("u-shade-btn")[0].style.visibility = "hidden";
            e.target.getElementsByClassName("u-shade-btn")[1].style.visibility = "hidden";
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
                    if (e == 5) {
                        // if (this.client == "origin") this.getFaceList(params);
                        if (this.client == "std") this.getFaceList(params);
                    } else {
                        this.getFaceList(params);
                    }
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
        isDisabled(id, detail) {
            // 获取要绑定事件的元素

            const nav = document.getElementById(id);
            console.log(id, detail, nav);
            if (!nav) return;
            if (nav.scrollLeft == 0 && detail == 1) {
                return "u-disabled";
            }
            if (nav.scrollLeft != 0 && nav.scrollWidth <= nav.scrollLeft + nav.clientWidth && detail == -1) {
                return "u-disabled";
            }
            return "";
        },
        crosswiseScroll(event, id, detail, distance) {
            if (isPhone()) return;

            event.preventDefault();

            // 获取要绑定事件的元素
            // const nav = this.$refs[id];
            const nav = document.getElementById(id);
            if (!nav) return;
            let scrollWidth = nav.scrollWidth;
            // return;
            if (nav.scrollLeft == 0 && detail == 1) return;

            if (scrollWidth <= nav.scrollLeft + nav.clientWidth && detail == -1) return;
            let step = (distance || 200) / 100;
            let total = 0;
            // 对需要滚动的元素进行滚动操作
            let _this = this;
            scrollFun();

            function scrollFun() {
                total = total + step;
                if (total < distance) {
                    if (detail == 1) {
                        nav.scrollLeft -= step;
                    } else {
                        nav.scrollLeft += step;
                    }
                    setTimeout(scrollFun, 1);
                } else {
                    _this.isUpdate = !_this.isUpdate;
                }
            }
        },
        listId(list) {
            return list.map((e) => e.id);
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/face/list.less";
</style>
