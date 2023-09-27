<template>
    <div class="m-pets">
        <div class="u-header">
            <div class="u-title">{{ title }}</div>
            <a class="u-more" href="/pet">查看更多</a>
        </div>
        <div class="u-list">
            <list-cross v-if="list.length" :list="list" :gap="10">
                <template v-slot="data">
                    <a class="u-pet" :href="getLink(data.item)" target="_blank">
                        <img class="u-pic" :src="getThumbnail(data.item.img)" loading="lazy" />
                    </a>
                </template>
            </list-cross>
        </div>
    </div>
</template>

<script>
import { getPetLucky, getSliders as getList } from "@/service/pet";
import ListCross from "../ListCross.vue";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";

import dayjs from "@/plugins/day";
export default {
    name: "NewPets",
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
            return this.client === "std" ? "今日福源宠物" : "最新宠物";
        },
    },
    methods: {
        load() {
            if (this.client === "std") {
                // 只有正式服有 获取福缘宠物id
                getPetLucky(this.client).then((res) => {
                    let data = res.data;
                    let dateIndex = dayjs.tz(new Date()).format("MDD");
                    getList("slider", this.client, data[dateIndex].toString()).then((res) => {
                        this.list = res.data?.data?.list || [];
                    });
                });
            } else {
                // 取正式服的数据
                getList("slider", "std").then((res) => {
                    this.list = res.data?.data?.list || [];
                });
            }
        },
        getLink(item) {
            return item.source_id ? `/pet/${item.source_id}` : item.link;
        },
        getThumbnail(url) {
            return getThumbnail(url, [430 * 2, 200 * 2]);
        },
    },
    mounted() {
        this.load();
    },
};
</script>
