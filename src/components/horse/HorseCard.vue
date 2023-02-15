<template>
    <div class="m-horse-card hvr-ripple-out" :class="getColorByQuality(item.Quality) + '-color'">
        <img v-if="item.ImgPath" :src="getImgSrc(item.ImgPath)" class="u-image" />
        <div v-else class="u-image"></div>
        <div class="u-name">{{ item.Name }}</div>
        <div class="u-desc">ID: {{ item.ID }}</div>
        <div class="u-desc">类型: {{ getType(item) }}</div>
        <div class="u-desc">等级: {{ item.Level }}</div>
        <div v-if="item.SubType===15" class="u-desc">{{ item.MoveSpeedDesc }}</div>
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
    inject: ["__imgRoot"],
    data: function () {
        return {};
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    methods: {
        getImgSrc: function (path) {
            if (path) {
                let img = path.toLowerCase().match(/.*[\/,\\]homeland(.*?).tga/);
                let name = img[1].replace(/\\/g, "/");

                if (img[1] == "default") return this.__imgRoot + `homeland/${this.client}` + "/default/default.png";
                return this.__imgRoot + `homeland/${this.client}` + name + ".png";
            }
        },
        getType(item) {
            // SubType 15为坐骑 23 为马具
            // DetailType 0普通坐骑，非0奇趣坐骑
            // DetailType 0头饰，1鞍饰，2足饰，3马饰
            let type = "";
            if (item.SubType === 15) {
                if (item.DetailType === 0) {
                    type = "普通坐骑";
                } else {
                    type = "奇趣坐骑";
                }
            } else if (item.SubType === 23) {
                if (item.DetailType === 0) {
                    type = "头饰";
                } else if (item.DetailType === 1) {
                    type = "鞍饰";
                } else if (item.DetailType === 2) {
                    type = "足饰";
                } else if (item.DetailType === 3) {
                    type = "马饰";
                } else {
                    type = "马具";
                }
            }
            return type;
        },
        getColorByQuality(quality) {
            let colorName = "white";
            if (quality) {
                switch (quality) {
                    case 1:
                        colorName = "white";
                        break;
                    case 2:
                        colorName = "green";
                        break;
                    case 3:
                        colorName = "blue";
                        break;
                    case 4:
                        colorName = "purple";
                        break;
                    case 5:
                        colorName = "orange";
                        break;
                }
            }
            return colorName;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/card.less";
</style>
