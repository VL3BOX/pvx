<template>
    <div class="m-faces">
        <div class="u-header">
            <div class="u-title">{{ title }}</div>
            <a class="u-more" href="/face">查看更多</a>
        </div>
        <div class="u-list">
            <list-cross v-if="list.length" :list="list" type="share" :gap="10" :arrow="2">
                <template v-slot="data">
                    <a class="u-face" :href="getLink(data.item)" target="_blank">
                        <img class="u-pic" :src="getThumbnail(data.item.img)" loading="lazy" />
                    </a>
                </template>
            </list-cross>
        </div>
    </div>
</template>

<script>
import { getSliders as getList } from "@/service/face";
import ListCross from "../ListCross.vue";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "NewFaces",
    components: {
        ListCross,
    },
    data() {
        return {
            list: [],
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        title() {
            return "精选捏脸";
        },
    },
    methods: {
        load() {
            getList("slider", this.client, 9).then((res) => {
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
