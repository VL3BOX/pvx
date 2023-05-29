<template>
    <div class="m-imperial-list">
        <div class="u-item" v-for="item in list" :key="item.rid">
            <div class="u-title">{{ item.title }}</div>
            <div class="u-answer">{{ getAnswer(item) }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImperialExaminationList",
    props: ["data"],
    computed: {
        list() {
            return this.data.filter((item) => item.answer && JSON.parse(item.answer) && JSON.parse(item.answer).length);
        },
    },
    methods: {
        getAnswer(item) {
            const answers = JSON.parse(item.answer) || [];
            const options = JSON.parse(item.options) || [];
            return options.filter((item, index) => answers.includes(index)).join();
        },
    },
};
</script>

<style lang="less">
.m-imperial-list {
    .flex;
    flex-wrap: wrap;
    gap: 20px;
    .u-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px;
        gap: 20px;

        width: 580px;
        max-height: 218px;
        overflow-y: auto;
        box-sizing: border-box;

        background: #ffffff;
        border-radius: 10px;

        .u-title {
            font-weight: 700;
            font-size: 14px;
            line-height: 18px;
            display: flex;
            align-items: center;

            color: #000000;
        }
        .u-answer {
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;

            // color: rgba(0, 0, 0, 0.8);
            color: @examColor;
        }
    }
}
</style>
