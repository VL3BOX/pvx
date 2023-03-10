<template>
    <div class="m-book-card">
        <div class="u-book-info" :class="`u-profession-bg--` + item.ExtendProfessionID1" @click="go(item)">
            <div class="title">{{ item.Name }}</div>
        </div>
        <div class="u-desc-info">
            <div class="desc" v-html="item.Desc"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data: function () {
        return {};
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        go(item) {
            const id = item.ItemID;
            this.$router.push({ path: `${id}` });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/book/card.less";
</style>
