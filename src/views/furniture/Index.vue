<template>
    <div class="p-furniture">
        <PvxSearch
            ref="search"
            :items="searchProps"
            :initValue="initValue"
            class="m-furniture-search"
            @search="searchEvent($event)"
        >
            <template slot="extra">
                <div v-if="childCategory.length" class="m-child-category">
                    <div
                        class="u-item"
                        :class="item.nCatag2Index === childActive ? 'is-active' : ''"
                        v-for="item in childCategory"
                        :key="item.dwTableID"
                        @click.stop="setIndex(item.nCatag2Index)"
                    >
                        {{ item.szName }}
                    </div>
                </div>
            </template>
        </PvxSearch>
        <div v-loading="loading" class="m-furniture-list" :class="!childCategory.length && 'm-no-child'">
            <FurnitureItem :item="item" v-for="item in list" :key="item.ID"></FurnitureItem>
        </div>
    </div>
</template>

<script>
import PvxSearch from "@/components/PvxSearch.vue";
import FurnitureItem from "@/components/furniture/FurnitureItem.vue";

import { __imgPath, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { getFurnitureCategory, getFurnitureMatch } from "@/service/homeland.js";
import { getFurniture } from "@/service/furniture.js";
import { deleteNull } from "@/utils/index";
import { sourceList, levelList, categoryList, categoryCss } from "@/assets/data/furniture.json";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export default {
    name: "Index",
    components: { PvxSearch, FurnitureItem },
    provide: {
        __imgRoot: __imgPath + "homeland/",
        __dataRoot: __dataPath + "pvx/",
    },
    data() {
        return {
            loading: false,
            search: {},
            query: {
                page: 1,
                per: 20,
            },
            pages: 0,
            total: 0,
            category: [],
            childCategory: [],
            initValue: {},
            append: false,
            list: [],
            searchProps: [
                {
                    key: "nCatag1Index",
                    name: "类型",
                    type: "radio",
                    options: [],
                },
                {
                    type: "filter",
                    key: "filter",
                    name: "过滤",
                    options: [
                        {
                            key: "attribute",
                            type: "radio",
                            name: "家具属性",
                            options: categoryList.map((item) => {
                                return {
                                    key: item.key,
                                    value: item.name,
                                };
                            }),
                        },
                        {
                            key: "szSource",
                            type: "radio",
                            name: "来源途径",
                            options: sourceList.map((item) => {
                                return {
                                    key: item.name === "全部" ? "" : item.name,
                                    value: item.name,
                                };
                            }),
                        },
                        {
                            key: "LevelLimit",
                            type: "radio",
                            name: "家园等级",
                            options: levelList.map((item) => {
                                return {
                                    key: item.level,
                                    value: item.name,
                                };
                            }),
                        },
                        {
                            key: "other",
                            type: "radio",
                            name: "其它",
                            options: [
                                {
                                    key: "bInteract",
                                    value: "可交互",
                                },
                                {
                                    key: "isSet",
                                    value: "庐园广记",
                                },
                                {
                                    key: "isMatch",
                                    value: "园宅会赛",
                                },
                            ],
                        },
                    ],
                },
                {
                    key: "name",
                    name: "家具名称",
                },
            ],
            active: "",
            childActive: "",
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        params() {
            return {
                ...this.query,
                ...this.search,
                client: this.client,
            };
        },
    },
    watch: {
        active(type) {
            // 重置子类
            this.childActive = "";
            delete this.search.nCatag2Index;

            const category = this.category.find((item) => item.id === type);
            const children = category?.children || [];
            this.childCategory = children;
        },
        search: {
            deep: true,
            handler: function (val) {
                this.getData();
            },
        },
    },
    methods: {
        setIndex(i) {
            this.childActive = i;
            this.$set(this.search, "nCatag2Index", i);
        },
        getCategory() {
            getFurnitureCategory().then((res) => {
                const list = Object.values(res?.data || {});
                list.unshift({
                    id: "",
                    name: "全部",
                });
                this.category = list.map((item) => {
                    return {
                        type: item.id,
                        ...item,
                    };
                });
                this.searchProps[0].options = this.category;
            });
        },
        getData() {
            const params = deleteNull(this.params);
            this.loading = true;
            getFurniture(params)
                .then((res) => {
                    let list = [];
                    list = this.append ? this.list.concat(res.data.list) : res.data.list;

                    this.list = list;
                    this.pages = res.data.pages;
                    this.total = res.data.total;
                    this.append = false;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        searchEvent(data) {
            this.active = data.nCatag1Index;
            let newData = Object.assign({}, data);
            if (newData.other === "bInteract") {
                newData.bInteract = 1;
            }
            if (newData.other === "isSet") {
                newData.isSet = 1;
            }
            delete newData.other;
            this.search = newData;
        },
    },
    mounted() {
        this.getCategory();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/furniture/index.less";
</style>
