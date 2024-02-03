<template>
    <div class="same-item">
        <div class="img-wrap" :class="`u-quality-bg--` + item.Quality">
            <img v-if="item.SubType === 15" :src="item.imgUrl" class="u-image" />
            <!-- <item-icon v-else :item_id="String(item.ItemID)" :size="120" :onlyIcon="true"></item-icon> -->
        </div>
        <div class="info-wrap">
            <div class="info-item name">{{ item.Name }}</div>
            <div class="info-item id">ID: {{ item.ID }}</div>
            <div class="info-item u-attr-wrap">
                <div class="u-attr-content">
                    <div class="u-attr" v-for="(attr, index) in item.MagicAttributes || []" :key="index">
                        <el-tooltip trigger="hover" placement="top">
                            <div class="u-attr-pop" slot="content">
                                <div class="u-attr-name" v-if="attr.name">
                                    {{ (attr.name || "") + (Number(attr.level) ? attr.level + $t('级') : "") }}
                                </div>
                                <div class="u-attr-desc">{{ attr.desc }}</div>
                            </div>
                            <img class="u-attr-icon" :src="attr.iconUrl" :alt="attr.name" />
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <div class="gradient-right"></div>
    </div>
</template>

<script>
export default {
    name: "SameItem",
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    methods: {},
};
</script>

<style lang="less">
@import "~@/assets/css/horse/same_item.less";
</style>
