<template>
    <div class="m-myList">
        <div class="m-manufacture-title">
            <span class="u-title">我的清单</span>
        </div>
        <div class="m-box">
            <a :href="link + item.id" target="_blank" class="m-item" v-for="(item, i) in list" :key="i">
                <i :class="item.public ? 'el-icon-lock' : 'el-icon-caret-right'"></i> {{ item.title }}
            </a>
        </div>
    </div>
</template>

<script>
import { getMyPlans } from "@/service/manufacture";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "MyList",
    data: function () {
        return {
            list: [],
        };
    },
    computed: {
        link() {
            return __Root + "item/plan_view/";
        },
    },
    methods: {
        load() {
            getMyPlans({
                page: 1,
                per: 99,
            }).then((res) => {
                this.list = res.list;
            });
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
.m-myList {
    .w(100%);
    min-width: 300px;
    .m-box {
        .flex;
        .r(10px);
        flex-direction: column;

        overflow: auto;
        padding: 20px;
        background: #fff;
        min-height: 700px;
        max-height: calc(100vh - 230px);
        box-sizing: border-box;
        .m-item {
            .db;
            .bold;
            .nobreak;
            .fz(16px);
            .lh(38px);
            .color( #24292e,#07ad36);
        }
    }
}
</style>
