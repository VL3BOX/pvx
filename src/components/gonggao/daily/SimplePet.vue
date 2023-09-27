<template>
    <div class="m-simple-pet is-disabled">
        <a
            v-for="item in luckyList"
            :key="item.Index"
            class="u-pet-item"
            :class="item.isDone && 'is-done'"
            :href="getPetLink(item.Index)"
            target="_blank"
        >
            <div class="u-pet-title">
                <div class="u-pet-name">
                    <itemIcon
                        :item_id="String(item.ItemTabType + '_' + item.ItemTabIndex)"
                        :size="38"
                        :onlyIcon="true"
                        :isLink="false"
                    ></itemIcon
                    >{{ item.Name }}
                </div>
                <div class="u-pet-desc">{{ item.szTip }}</div>
            </div>
            <!-- <div class="u-pet-detail">
                <div class="u-times">
                    <div class="u-time" :class="index <= ~~item.name && 'is-active'" v-for="index in 3" :key="index">
                        {{ index }}
                    </div>
                </div>
                <img
                    class="u-done-icon"
                    svg-inline
                    src="@/assets/img/gonggao/check.svg"
                    :fill="item.isDone ? '#fff' : '#949494'"
                />
            </div> -->
        </a>
    </div>
</template>

<script>
import { getPets, getPetLucky } from "@/service/gonggao";

import dayjs from "@/plugins/day";
import itemIcon from "@/components/common/item_icon.vue";
export default {
    name: "SimplePet",
    components: {
        itemIcon,
    },
    props: {
        date: {
            type: String,
            default: dayjs.tz().format("YYYY-MM-DD"),
        },
        client: {
            type: String,
            default: "std",
        },
    },
    data() {
        return {
            luckyList: [],
        };
    },
    watch: {
        date: {
            immediate: true,
            handler() {
                if (this.client === "std") this.loadPetLucky();
            },
        },
    },
    methods: {
        // 获取福缘宠物
        loadPetLucky: function () {
            getPetLucky().then((res) => {
                let data = res.data.std;
                let dateIndex = dayjs.tz(this.date).format("MDD");
                let ids = data[dateIndex];
                getPets(ids).then((res) => {
                    this.luckyList = res.data.list;
                });
            });
        },
        // 前往宠物单页
        getPetLink(id) {
            return `/pet/${id}`;
        },
    },
};
</script>
