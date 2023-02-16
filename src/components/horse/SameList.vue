<template>
    <div class="same-list-wrapper">
        <div class="same-item" v-for="item in list" :key="item.ID">
            <div class="img-wrap" :class="`u-quality-bg--` + item.Quality">
                <img v-if="item.ImgPath" :src="item.imgUrl" class="u-image" />
                <div v-else class="u-image"></div>
            </div>
            <div class="info-wrap">
                <div class="info-item">{{ item.Name }}</div>
                <div class="info-item">ID: {{ item.ID }}</div>
                <div class="info-item u-attr-wrap">
                    <div class="u-attr-content">
                        <div class="u-attr" v-for="(attr, index) in item.MagicAttributes || []" :key="index">
                            <el-tooltip trigger="hover" placement="top">
                                <div class="u-attr-pop" slot="content">
                                    <div class="u-attr-name" v-if="attr.name">
                                        {{ (attr.name || "") + (Number(attr.level) ? attr.level + "级" : "") }}
                                    </div>
                                    <div class="u-attr-desc">{{ attr.desc }}</div>
                                </div>
                                <img class="u-attr-icon" :src="attr.iconUrl" :alt="attr.name" />
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SameList",
    props: {
        list: {
            type: Array,
            required: true,
        },
    },
    methods: {},
};
</script>

<style lang="less">
@import "~@/assets/css/horse/same_list.less";
</style>
