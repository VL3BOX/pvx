<template>
    <div class="m-facedata">
        <div class="m-face-parse" :class="{ on: done }">
            <h1 class="m-face-parse-title">体型数据解析器</h1>
            <Upload type="pvxbody" @success="handleSuccess" />
            <Bodydat class="m-face-parse-preview" :data="json" :lock="false" v-show="done" />
        </div>
    </div>
</template>

<script>
import Bodydat from "@jx3box/jx3box-facedat/src/Bodydat";
import Upload from "@jx3box/jx3box-facedat/src/Upload";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "BodyDataParse",
    data: function () {
        return {
            data: "",
            done: false,
        };
    },
    computed: {
        json: function () {
            return this.data && this.data.json;
        },
    },
    methods: {
        handleSuccess: function (data) {
            this.data = data;
            if (data?.json) {
                this.done = true;
            } else {
                this.done = false;
            }
        },
    },
    components: {
        Bodydat,
        Upload,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/face/parse.less";
</style>
