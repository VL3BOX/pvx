<template>
    <div class="m-reputation">
        <div class="u-header">
            <div class="u-title">{{ title }}</div>
            <a class="u-more" href="/reputation">查看更多</a>
        </div>
        <div class="u-list">
            <ReputationItem class="m-pvx-item" v-for="item in list" :key="item.id" :item="item"></ReputationItem>
        </div>
    </div>
</template>

<script>
import { getNews as getList } from "@/service/reputation";
import ReputationItem from "../reputation/ReputationItem.vue";
export default {
    name: "NewReputation",
    components: {
        ReputationItem,
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
            return "赛季声望";
        },
    },
    methods: {
        load() {
            getList({per:8}).then((res) => {
                this.list = res.data?.list || [];
            });
        },
    },
    mounted() {
        this.load();
    },
};
</script>
