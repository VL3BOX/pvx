<template>
    <div class="c-pvx-block m-adventures">
        <div class="u-header">
            <div class="u-title">{{ title }}</div>
            <a class="u-more" href="/adventure">查看更多</a>
        </div>
        <div class="u-tabs">
            <div
                class="u-tab"
                :class="tabActive === tab.value && 'is-active'"
                v-for="tab in tabs"
                :key="tab.value"
                @click="tabActive = tab.value"
            >
                {{ tab.label }}
            </div>
        </div>
        <div class="u-list">
            <list-cross v-if="list.length" :list="list" :gap="10">
                <template v-slot="data">
                    <AdventureItem class="m-pvx-item" :item="data.item"></AdventureItem>
                </template>
            </list-cross>
        </div>
    </div>
</template>

<script>
import { getAdventures as getList } from "@/service/adventure";
import ListCross from "../ListCross.vue";
import AdventureItem from "@/components/adventure/item.vue";
import { __imgPath, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";

import dayjs from "@/plugins/day";
export default {
    name: "NewAdventures",
    components: {
        ListCross,
        AdventureItem,
    },
    provide: {
        __imgRoot: __imgPath + "adventure/",
        __dataRoot: __dataPath + "pvx/",
    },
    data() {
        return {
            list: [],
            tabActive: "perfect",
            tabs: [
                {
                    label: "绝世奇遇",
                    value: "perfect",
                },

                {
                    label: "普通奇遇",
                    value: "normal",
                },
                {
                    label: "宠物奇遇",
                    value: "pet",
                },
            ],
            school: "2",
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        title() {
            return "最新奇遇";
        },
        params() {
            return {
                per: 10,
                page: 1,
                type: this.tabActive,
                client: this.client,
            };
        },
        camp() {
            return dayjs.tz().date() % 2 ? 1 : 2;
        },
    },
    watch: {
        tabActive: {
            immediate: true,
            handler() {
                this.load();
            },
        },
    },
    methods: {
        load() {
            const params = this.params;
            getList(params).then((res) => {
                const list = [];
                res.data.list.forEach((e) => {
                    list.push(this.toSpecial(e));
                });
                this.list = list;
            });
        },
        //处理特殊的链接
        toSpecial(data) {
            const type = data.szRewardType;
            let str = data.szOpenRewardPath;
            const name = data.szOpenRewardPath.split("\\").filter(Boolean).pop();

            if (type == "school") str = `ui/Image/Adventure/reward/Open/${name}/school_${this.school}_Open.tga`;

            if (type == "camp") {
                str = `ui/Image/Adventure/reward/Open/${name}/camp_${this.camp}_Open.tga`;
            }

            data.szOpenRewardPath = str;
            return data;
        },
    },
    mounted() {
        this.load();
    },
};
</script>
