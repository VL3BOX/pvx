<template>
    <router-link
        class="m-pet-item"
        :to="'/' + petObject.Index"
        :class="getFrameClass(petObject.Quality)"
        target="_blank"
    >
        <!-- <div class="u-shade"></div> -->
        <itemIcon
            :item_id="String(petObject.ItemTabType + '_' + petObject.ItemTabIndex)"
            :size="80"
            :onlyIcon="true"
            :isLink="false"
            class="u-icon"
        ></itemIcon>
        <div class="u-name">{{ petObject.Name }}</div>
    </router-link>
</template>

<script>
import itemIcon from "../../common/item_icon.vue";
import { __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    props: {
        petObject: {},
    },
    components: {
        itemIcon,
    },
    data: function () {
        return {};
    },
    computed: {},
    methods: {
        // 获取宠物边框样式
        getFrameClass: function (quality) {
            let className = "";
            if (quality) {
                switch (quality) {
                    case 2:
                        className = "pet-level-2";
                        break;
                    case 3:
                        className = "pet-level-3";
                        break;
                    case 4:
                        className = "pet-level-4";
                        break;
                    case 5:
                        className = "pet-level-5";
                        break;
                }
                return className;
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pet/v2/item.less";
</style>
