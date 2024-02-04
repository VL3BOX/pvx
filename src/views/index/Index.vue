<template>
    <div class="p-index">
        <div class="m-index-category" v-for="(menu, index) in menus" :key="index" :class="'index'+index">
            <div class="u-index-category-title">
                {{menu.label}}
            </div>
            <div class="m-child-category-list">
                <a :href="submenu.path" class="m-child-category" :class="'child-'+index" v-for="(submenu, i) in menu.submenus" :target="submenu.target || '_self'" :key="i">
                    <img :src="getNavIcon(submenu.key)" class="u-img" :alt="submenu.label" />
                    <span class="u-text">{{ submenu.label }}</span>
                </a>
            </div>
        </div>
<!--        <div class="m-index-info">-->
<!--            <div class="m-intro">-->
<!--                <div class="u-title">创作、收集、资讯、江湖之路何必枯燥？认识一下，我们全新的PVX栏目</div>-->
<!--                <div class="u-desc">-->
<!--                    这里，是PVX主页，你可以通过左侧的侧边栏或下方的矩阵快速切换栏目。目前还有部分项目正在持续更新中，请耐心等待。-->
<!--                </div>-->
<!--                <div class="u-nav">-->
<!--                    <div class="u-nav-item" v-for="(menu, index) in menus" :key="menu.index" @click="active = index">-->
<!--                        {{ menu.label }}-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="u-nav-list" :class="`u-nav-list__${active}`">-->
<!--                    <a-->
<!--                        :href="item.path"-->
<!--                        v-for="item in submenus"-->
<!--                        :key="item.key"-->
<!--                        :target="item.target || '_self'"-->
<!--                        class="u-item"-->
<!--                    >-->
<!--                        <img class="u-nav-icon" :src="getNavIcon(item.key)" :alt="item.label" />-->
<!--                        <span>{{ item.label }}</span>-->
<!--                    </a>-->
<!--                </div>-->
<!--                <div class="u-tips">-->
<!--                    <i class="el-icon-warning"></i>-->
<!--                    <span>对我们的栏目有建设性意见？</span>-->
<!--                    <a @click="onQQClick" class="u-link" title="点击复制">加入QQ群</a>-->
<!--                </div>-->
<!--            </div>-->
<!--            <img class="u-normal-img" src="@/assets/img/index.png" />-->
<!--            <img class="u-max-img" src="@/assets/img/index_l.png" />-->
<!--        </div>-->
<!--        <div class="m-newest">-->
<!--            <Face></Face>-->
<!--            <Pet></Pet>-->
<!--            <Adventure></Adventure>-->
<!--            <Horse></Horse>-->
<!--            <Reputation></Reputation>-->
<!--            <Book></Book>-->
<!--        </div>-->
    </div>
</template>

<script>
import menus from "@/assets/data/menus.json";
// import Face from "@/components/pvx/Face";
// import Pet from "@/components/pvx/Pet";
// import Reputation from "@/components/pvx/Reputation";
// import Adventure from "@/components/pvx/Adventure";
// import Horse from "@/components/pvx/Horse";
// import Book from "@/components/pvx/Book";
export default {
    name: "Index",
    // components: {
    //     Face,
    //     Pet,
    //     Reputation,
    //     Adventure,
    //     Horse,
    //     Book,
    // },
    data() {
        return {
            active: 0,

            qq: "658035079",
        };
    },
    computed: {
        menus() {
            const arr = ["玩家创作类栏目", "图鉴百科类栏目", "信息查询类栏目"];
            menus.map((item, i) => {
                item.label = arr[i];
                return item;
            });
            return menus;
        },
        submenus() {
            return this.menus[this.active].submenus.filter((item) => item.status);
        },
    },
    methods: {
        getNavIcon(key) {
            return require(`@/assets/img/nav/${key}2.svg`);
        },
        onQQClick() {
            navigator.clipboard.writeText(this.qq).then(() => {
                this.$notify({
                    title: "复制成功",
                    message: "内容：" + this.qq,
                    type: "success",
                });
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/index.less";
</style>
