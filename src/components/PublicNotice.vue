<template>
    <div class="m-public-notice">
        <div class="m-notice-content">
            <img svg-inline :src="require('@/assets/img/notice.svg')" alt="">
            <span class="m-notice-text" v-html="html"></span>
        </div>
    </div>
</template>

<script>
import {getBreadcrumb} from "@jx3box/jx3box-common/js/api_misc";
export default {
    name: "PublicNotice",
    props: ['bckey'],
    data() {
        return {
            html: ''
        }
    },
    mounted() {
        getBreadcrumb(this.bckey).then(res => {
            this.html = res;
        })
    },
    methods: {

    }
};
</script>

<style lang="less" scoped>
    .m-public-notice {
        .size(100%, 40px);
        box-sizing: border-box;
        background: #FFFFFF;
        padding: 0px 20px 0px 20px;
        border-radius: 100px;
        gap: 20px;
        box-shadow: 0px 0px 10px 0px #00000040;
        line-height: 40px;
        img{
            .mr(20px);
        }
        .m-notice-text{
            font-family: Microsoft YaHei;
            font-size: 14px;
            font-weight: 400;
            line-height: 18px;
            letter-spacing: 0em;
            text-align: left;
        }
    }
</style>
