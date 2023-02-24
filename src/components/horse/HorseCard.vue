<template>
    <div class="m-horse-card" :class="`u-quality-bg--` + item.Quality" @click="go(item)">
        <img v-if="item.SubType === 15" :src="getImgSrc(item)" class="u-image" />
        <item-icon v-else :item_id="String(item.ItemID)" :size="160" :onlyIcon="true"></item-icon>
        <!-- <div v-else class="u-image"></div> -->
        <div class="u-name">{{ item.Name }}</div>
        <div class="u-desc">ID: {{ item.ID }}</div>
        <!-- <div class="u-desc">{{ getType(item) + (item.SubType === 15 ? (" · " + item.modeName + " · " + item.speed) : "") }}</div> -->
        <!-- <div class="u-desc">等级: {{ item.Level }}</div> -->
        <!-- <div v-if="item.SubType === 15" class="u-desc">{{ item.MoveSpeedDesc }}</div> -->
        <div class="u-desc">
            <!-- <div class="u-attr-wrap"> -->
            <!-- <div class="u-attr" v-for="(attr, index) in item.MagicAttributes || []" :key="index">
                    <el-tooltip trigger="hover" placement="top">
                        <div class="u-attr-pop" slot="content">
                            <div class="u-attr-name" v-if="attr.name">
                                {{ (attr.name || "") + (Number(attr.level) ? attr.level + "级" : "") }}
                            </div>
                            <div class="u-attr-desc">{{ attr.desc }}</div>
                        </div>
                        <img class="u-attr-icon" :src="attr.iconUrl" :alt="attr.name" />
                    </el-tooltip>
                </div> -->
            <horse-cross :width="15" :gap="2" :radius="3" :list="item.MagicAttributes || []">
                <template v-slot="data">
                    <el-tooltip trigger="hover" placement="top">
                        <div class="u-attr-pop" slot="content">
                            <div class="u-attr-name" v-if="data.item.name">
                                {{ (data.item.name || "") + (Number(data.item.level) ? data.item.level + "级" : "") }}
                            </div>
                            <div class="u-attr-desc">{{ data.item.desc }}</div>
                        </div>
                        <img class="u-attr-icon" :src="data.item.iconUrl" :alt="data.item.name" />
                    </el-tooltip>
                </template>
            </horse-cross>
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
import ItemIcon from "../common/item_icon.vue";
import HorseCross from "@/components/horse/HorseCross.vue";
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    components: {
        ItemIcon,
        HorseCross,
    },
    inject: ["__imgRoot", "__imgRoot2"],
    data: function () {
        return {};
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        go(item) {
            const id = item.ItemID;
            // 2 马具 1 坐骑
            const type = item.SubType === 15 ? 1 : 2;
            this.$router.push(`/${id}/${type}`);
        },
        getImgSrc(item) {
            const path = item.ImgPath;
            if (path) {
                let img = path.toLowerCase().match(/.*[\/,\\]homeland(.*?).tga/);
                let name = img[1].replace(/\\/g, "/");

                if (img[1] == "default") return this.__imgRoot + `homeland/${this.client}` + "/default/default.png";
                return this.__imgRoot + `homeland/${this.client}` + name + ".png";
            } else {
                return this.__imgRoot2 + `${this.client}/` + item.ID + ".png";
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
    },
};
</script>

<style lang="less">
@import "~@/assets/css/horse/card.less";
</style>
