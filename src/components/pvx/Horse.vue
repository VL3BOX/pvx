<template>
    <div class="c-pvx-block m-horses">
        <div class="u-header">
            <div class="u-title">{{ title }}</div>
            <a class="u-more" href="/horse">查看更多</a>
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
                    <HorseCard class="m-pvx-item" :item="data.item"></HorseCard>
                </template>
            </list-cross>
        </div>
    </div>
</template>

<script>
import { getHorses as getList } from "@/service/horse";
import ListCross from "../ListCross.vue";
import HorseCard from "@/components/horse/HorseCard";
import { __imgPath, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "NewHorses",
    components: {
        ListCross,
        HorseCard,
    },
    provide: {
        __imgRoot: __imgPath + "homeland/",
        __imgRoot2: __imgPath + "horse/",
        __dataRoot: __dataPath + "pvx/",
    },
    data() {
        return {
            list: [],
            tabActive: 0,
            tabs: [
                {
                    label: "普通坐骑",
                    value: 0,
                },

                {
                    label: "奇趣坐骑",
                    value: 1,
                },
            ],
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        title() {
            return "最新坐骑";
        },
        params() {
            return {
                page: 1,
                per: 10,
                type: this.tabActive,
                client: this.client,
            };
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
        iconLink,
        load() {
            const params = this.params;
            getList(params).then((res) => {
                const list = res.data.list.map((item) => {
                    if (item.MagicAttributes && item.MagicAttributes.length) {
                        item.MagicAttributes.map((mItem) => {
                            mItem.iconUrl = this.iconLink(mItem.icon);
                            return mItem;
                        });
                    }
                    return item;
                });
                this.list = list;
            });
        },
    },
    mounted() {
        this.load();
    },
};
</script>
