<template>
    <div class="m-imperial-list">
        <el-row :gutter="20">
            <el-col :span="8" v-for="item in list" :key="item.rid"
                ><div class="u-item" @click="go(item.rid)">
                    <div class="u-title" v-html="getTitle(item.title)"></div>
                    <div class="u-answer">{{ getAnswer(item) }}</div>
                </div></el-col
            >
        </el-row>
    </div>
</template>

<script>
export default {
    name: "ImperialExaminationList",
    props: ["data", "search"],
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
        getTitle(title) {
            if (this.search) {
                title = title.replace(this.search, `<b>${this.search}</b>`);
            }
            return title;
        },
        go(id) {
            // this.$router.push({ name: "gameQuestion", params: { id: id } });
        },
    },
};
</script>

<style lang="less">
.m-imperial-list {
    .u-item {
        padding: 20px;
        .mb(20px);

        height: 168px;
        overflow-y: auto;
        box-sizing: border-box;

        background: #ffffff;
        border-radius: 10px;

        .u-title {
            font-weight: 700;
            font-size: 14px;
            line-height: 18px;
            color: #000000;
            .mb(20px);
            b {
                background-color: yellow;
            }
        }
        .u-answer {
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;

            // color: rgba(0, 0, 0, 0.8);
            color: @examColor;
        }
    }
    @media screen and (max-width: @ipad) {
        .u-item {
            width: 100%;
        }
    }
}
@media screen and (max-width: @ipad) {
    .m-imperial-list {
        .el-col {
            .w(50%);
        }
    }
}
@media screen and (max-width: @phone) {
    .m-imperial-list {
        .el-col {
            .w(100%);
        }
    }
}
</style>
