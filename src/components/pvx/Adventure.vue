<template>
    <div class="m-adventures">
        <div class="u-header">
            <div class="u-title">{{ title }}</div>
            <a class="u-more" href="/adventure">查看更多</a>
        </div>
        <div class="u-tabs">
            <div class="u-tab" v-for="tab in tabs" :key="tab.value" @click="tabActive = tab.value">{{ tab.label }}</div>
        </div>
        <div class="u-list">
            <list-cross v-if="list.length" :list="list" type="share" :gap="10" :arrow="2">
                <template v-slot="data">
                    <a class="u-adventure" :href="getLink(data.item)" target="_blank">
                        <img class="u-pic" :src="getThumbnail(data.item.img)" loading="lazy" />
                    </a>
                </template>
            </list-cross>
        </div>
    </div>
</template>

<script>
import { getAdventures as getList } from "@/service/adventure";
import ListCross from "../ListCross.vue";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "NewAdventures",
    components: {
        ListCross,
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
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        title() {
            return "最新奇遇";
        },
        query() {
            return {
                per: 10,
                page: 1,
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
        load() {
            const params = this.params;
            getList(params).then((res) => {
                this.list = res.data?.data?.list || [];
            });
        },
        getLink(item) {
            return item.source_id ? `/face/${item.source_id}` : item.link;
        },
        getThumbnail(url) {
            return getThumbnail(url, [400 * 2, 200 * 2]);
        },
    },
    mounted() {
        this.load();
    },
};
</script>
