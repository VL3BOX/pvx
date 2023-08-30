<template>
    <div class="m-author-header" :style="{ backgroundImage: `url(${userDefinedStyle.banner})` }">
        <!-- <div class="u-header-info">
            <Avatar class="u-author-avatar" :uid="uid" :url="avatar" :size="avatarSize" :frame="avatar_frame" />
            <div class="u-author-info">
                <span class="u-name" :style="userDefinedStyle.userName">
                    <span @click="copyData(data.display_name || '匿名')">{{ data.display_name || "匿名" }}</span
                    >&nbsp;<span class="u-uid" @click="copyData(data.ID || 0)">(UID : {{ data.ID || 0 }})</span>
                </span>
                <div class="u-tips">
                    <el-tooltip :content="`当前经验 ${data.experience || 0}`" placement="top">
                        <span class="u-level" :class="'lv-' + level" :style="{ backgroundColor: showLevelColor(level) }"
                            >Lv.{{ level }}</span
                        >
                    </el-tooltip>
                    <el-tooltip :content="vipTypeTitle" v-if="isPRO || isVIP" placement="top">
                        <a class="u-vip" href="/vip/premium?from=user_homepage" target="_blank">
                            <i class="u-icon vip">{{ vipType }}</i>
                        </a>
                    </el-tooltip>
                    <el-tooltip content="签约作者" v-if="isSuperAuthor" placement="top">
                        <span class="u-superauthor">
                            <i class="u-icon superauthor">签约作者</i>
                        </span>
                    </el-tooltip>
                </div>

                <Honor :uid="uid"></Honor>
            </div>
        </div> -->
    </div>
</template>
<script>
// import Honor from "@jx3box/jx3box-common-ui/src/author/AuthorHonor.vue";
export default {
    name: "Author",
    // components: { Honor },
    props: {
        decorationMe: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    watch: {
        decorationMe: {
            handler(val) {
                this.setDecorationStyle();
            },
            immediate: true,
            deep: true,
        },
    },
    data: function () {
        return {};
    },
    computed: {
        uid: function () {
            return this.$store.state.uid;
        },
        data: function () {
            return User.userdata;
        },
        avatar: function () {
            return this.data.user_avatar || "";
        },
        avatar_frame: function () {
            return this.data.user_avatar_frame || "";
        },
    },
    filters: {},
    methods: {},
};
</script>

<style scoped lang="less">
.m-single-author {
    .size(100%,220px);
    .r(10px);
    box-sizing: border-box;
    padding: 20px;
    background: linear-gradient(39deg, #fff 0%, rgba(255, 255, 255, 0) 100%), lightgray 50% / cover no-repeat;
}
</style>
