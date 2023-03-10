<template>
    <div class="m-facedata">
        <div class="m-face-parse" :class="{ on: done }">
            <h1 class="m-face-parse-title">捏脸数据解析器</h1>
            <Upload @success="handleSuccess" />
            <Facedat class="m-face-parse-preview" :data="json" :lock="false" v-show="done" />
        </div>
    </div>
</template>

<script>
import Facedat from "@jx3box/jx3box-facedat/src/Facedat";
import Upload from "@jx3box/jx3box-facedat/src/Upload";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "FacedataParse",
    props: [],
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
    mounted: function () {
    },
    components: {
        Facedat,
        Upload,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/share/parse.less";
</style>
