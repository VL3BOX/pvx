<template>
    <div class="m-filter-wrap" :class="$route.name === 'single' ? 'can-return' : ''">
        <div class="m-return">
            <el-button class="u-return-btn" @click="return_handle"><i class="el-icon-arrow-left"></i>返回</el-button>
        </div>
        <div class="m-search-input">
            <el-input
                placeholder="输入书籍名称/描述，「回车」进行搜索"
                v-model="keyword"
                clearable
                @keyup.enter.native="search"
            >
                <span slot="prepend"> <i class="el-icon-search"></i> 关键词 </span>
                <el-button @click="search" slot="append">
                    <div class="u-input-button__normal">
                        <i class="el-icon-position"></i>
                        <span>搜索</span>
                    </div>
                    <span class="u-input-button__small"><i class="xs el-icon-search"></i></span>
                </el-button>
            </el-input>
        </div>
    </div>
</template>

<script>
export default {
    name: "SearchInput",
    data() {
        // window.test = this;
        return {
            keyword: "",
        };
    },
    methods: {
        return_handle() {
            if (history.length <= 1) {
                this.$router.push({
                    name: "book",
                });
            } else {
                history.back();
            }
        },
        search(go) {
            if (!go) return;
            this.$router.push({
                name: "result",
                query: { keyword: this.keyword },
            });
        },
    },
    mounted() {},
};
</script>

<style lang="less">
@import "~@/assets/css/book/common/search_input.less";
</style>
