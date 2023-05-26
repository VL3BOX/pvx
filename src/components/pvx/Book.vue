<template>
    <div class="c-pvx-block m-books">
        <div class="u-header">
            <div class="u-title">{{ title }}</div>
            <a class="u-more" href="/book">查看更多</a>
        </div>
        <div class="u-tabs">
            <div
                class="u-tab"
                :class="[tabActive === tab.value && 'is-active', 'select-item-' + tab.value]"
                v-for="tab in tabs"
                :key="tab.value"
                @click="tabActive = tab.value"
            >
                {{ tab.label }}
            </div>
        </div>
        <div class="u-list">
            <list-cross v-if="list.length" :list="list" :gap="10" :radius="0">
                <template v-slot="data">
                    <BookCard class="m-pvx-item" :item="data.item"></BookCard>
                </template>
            </list-cross>
        </div>
    </div>
</template>

<script>
import { getList } from "@/service/book";
import ListCross from "../ListCross.vue";
import BookCard from "@/components/book/BookCard";
import professions from "@/assets/data/book_profession.json";
export default {
    name: "NewBooks",
    components: {
        ListCross,
        BookCard,
    },
    data() {
        return {
            list: [],
            tabActive: 11,
            professions,
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        title() {
            return "最新书籍";
        },
        tabs() {
            return this.professions
                .filter((item) => item.id !== 8)
                .map((item) => {
                    return {
                        label: item.name,
                        value: item.id,
                    };
                });
        },
        params() {
            return {
                per: 10,
                page: 1,
                profession: this.tabActive,
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
                const list = res.data?.list || [];
                this.list = list;
            });
        },
    },
    mounted() {
        this.load();
    },
};
</script>
