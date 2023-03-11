<template>
    <div class="m-book-card">
        <div class="u-book-info" :class="`u-profession-bg--` + item.ExtendProfessionID1" @click="go(item.idKey)">
            <div class="title">{{ item.Name }}</div>
        </div>
        <div class="u-desc-info">
            <div class="desc" v-html="item.Desc"></div>
            <div class="desc-title" v-html="item.Name"></div>
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
        go(id) {
            this.$router.push({ path: `${id}` });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/book/card.less";
</style>
