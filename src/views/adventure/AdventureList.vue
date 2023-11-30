<template>
    <div class="p-adventure-List" v-loading="loading" ref="listRef">
        <AdventureTabs @change="onSearch" :body_types="body_types" :active="active" @setActive="setActive" />
        <template v-if="!showAllList">
            <div
                v-for="(item, index) in list_type"
                :key="'l' + index"
                class="m-adventure-list"
                :class="`m-adventure-list-${index}`"
                @mouseenter="mouseenter($event)"
                @mouseleave="mouseleave($event)"
            >
                <div class="u-type" v-if="item.list.length > 0">
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
                    <AdventureItem v-for="item in item.list" :key="item.id" :item="item" />
                </div>
            </div>
        </template>
        <template v-if="showAllList">
            <div class="u-type u-all-type">
                <div class="u-title">{{ body_types_name() }}</div>
            </div>
            <div class="m-face-list--all">
                <AdventureItem v-for="item in list" :key="item.id" :item="item" />
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
                :page-size="per"
                :total="total"
                :current-page.sync="page"
            ></el-pagination>
        </template>
        <div class="u-archive-alert" v-if="isNoRes()">
            <el-alert title="没有对应的奇遇，请重新查找" type="info" center show-icon />
        </div>
    </div>
</template>

<script>
import AdventureTabs from "@/components/adventure/tabs.vue";
import AdventureItem from "@/components/adventure/item.vue";
import { getAdventures, getUserSchool } from "@/service/adventure";
import { isPhone } from "@/utils/index";
import { clone } from "lodash";
// import User from "@jx3box/jx3box-common/js/user";
// import schoolImgID from "@/assets/data/school_img_id.json";
import dayjs from "@/plugins/day";
export default {
    name: "adventureList",
    props: [],
    components: { AdventureTabs, AdventureItem },
    data: function () {
        return {
            loading: false,
            tabsData: {},
            body_types: [
                {
                    value: "all",
                    label: "全部",
                    client: ["std", "origin"],
                },
                {
                    value: "perfect",
                    label: "绝世",
                    client: ["std", "origin"],
                },
                {
                    value: "normal",
                    label: "普通",
                    client: ["std", "origin"],
                },
                {
                    value: "pet",
                    label: "宠物",
                    client: ["std", "origin"],
                },
            ],
            active: "all",
            list: [],
            list_type: [
                { name: "绝世奇遇", list: [], value: "perfect", client: ["std", "origin"] },
                { name: "普通奇遇", list: [], value: "normal", client: ["std", "origin"] },
                { name: "宠物奇遇", list: [], value: "pet", client: ["std", "origin"] },
            ],
            showAllList: false, //是否显示单独某项全部
            isUpdate: false,
            page: 1, //当前页数
            total: 1, //总条目数
            pages: 1, //总页数
            per: 15, //每页条目

            appendMode: false,
            school: "2",
            search: {},
            hasSearch: "",
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        hasNextPage: function () {
            return this.pages > 1 && this.page < this.pages;
        },
        params({ tabsData }) {
            return {
                ...tabsData,
                page: this.page,
                client: this.client,
            };
        },
        newList: function () {
            let list = [];
            this.list.forEach((e) => {
                list.push(this.toSpecial(e));
            });
            return list;
        },
        camp() {
            return dayjs.tz().date() % 2 ? 1 : 2;
        },
    },
    watch: {
        params: {
            deep: true,
            handler(val) {
                this.getListInit();
            },
        },
        $route(obj) {
            if (obj.params.search) this.hasSearch = obj.params.search;
        },
    },
    methods: {
        setActive(val) {
            this.active = val;
            document.documentElement.scrollTop = 0;
        },
        isNoRes() {
            let type = this.params.type;
            if (type == "all") {
                // return false;
                return (
                    this.list_type[0].list.length == 0 &&
                    this.list_type[1].list.length == 0 &&
                    this.list_type[2].list.length == 0
                );
            }
            return this.list.length > 0 ? false : true;
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
            let type = this.params.type;
            if (!type) return;
            const nameMap = {
                perfect: () => "绝世奇遇",
                normal: () => "普通奇遇",
                pet: () => "宠物奇遇",
            };
            return nameMap[type]();
        },
        getListInit: function () {
            this.loading = true;

            if (this.params.type == "all") {
                this.showAllList = false;
                this.list_type.forEach((e) => {
                    let params = clone(this.params);
                    params.per = 14;
                    params.type = e.value;
                    this.getAdventures(params);
                });
            } else {
                let params = clone(this.params);
                params.per = this.per;
                this.getAdventures(params);
            }
        },
        getAdventures(params) {
            getAdventures(params)
                .then((res) => {
                    let list = [];
                    res.data.list.forEach((e) => {
                        // list.push(e);
                        list.push(this.toSpecial(e));
                    });
                    if (this.appendMode) {
                        this.list = this.list.concat(list || []);
                    } else {
                        if (this.params.type == "all") {
                            //分别赋值
                            const typesMap = {
                                perfect: () => (this.list_type[0].list = list || []),
                                normal: () => (this.list_type[1].list = list || []),
                                pet: () => (this.list_type[2].list = list || []),
                            };
                            typesMap[params.type]();
                        } else {
                            this.showAllList = true;
                            this.list = list || [];
                        }
                    }
                    if (this.params.type) {
                        this.total = res.data.total;
                        this.pages = res.data.pages;
                    }
                    this.$forceUpdate();
                })
                .finally(() => {
                    this.loading = false;
                    this.appendMode = false;
                });
        },
        //处理特殊的链接
        toSpecial(data) {
            const type = data.szRewardType;
            let str = data.szOpenRewardPath;
            const name = data.szOpenRewardPath.split("\\").filter(Boolean).pop();

            if (type == "school") str = `ui/Image/Adventure/reward/Open/${name}/school_${this.school}_Open.tga`;

            if (type == "camp") {
                data.bHide;
                str = `ui/Image/Adventure/reward/Open/${name}/camp_${this.camp}_Open.tga`;
            }

            data.szOpenRewardPath = str;
            return data;
        },
        changePage(i) {
            this.page = i;
            // this.getData();
        },
        appendPage: function () {
            this.page = this.page + 1;
            this.appendMode = true;
            // this.getData();
        },
        onSearch(params) {
            // this.page = 1;
            // this.search = params;
            // this.getData();
            this.page = 1;
            this.tabsData = params;
        },
        // 按宽度显示个数
        showCount() {
            const listWidth = this.$refs.listRef?.clientWidth;
            this.per = Math.floor(listWidth / 300) * 4;
        },
        isDisabled(id, detail) {
            // 获取要绑定事件的元素
            const nav = document.getElementById(id);
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
            if (isPhone()) {
                return;
            }
            event.preventDefault();

            // 获取要绑定事件的元素
            // const nav = this.$refs[id];
            const nav = document.getElementById(id);
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
    },
    mounted: function () {
        // User.isLogin() &&
        //     getUserSchool().then(res => {
        //         if (res.data.data.list) this.school = schoolImgID[res.data.data.list[0].mount];
        //     });
        this.showCount();
        // this.getData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/adventure/list.less";
</style>
