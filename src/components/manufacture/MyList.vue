<template>
    <div class="m-myList">
        <div class="m-manufacture-title">
            <span class="u-title">我的清单</span>
        </div>
        <div class="m-box">
            <template v-if="isLogin">
                <a :href="link + item.id" target="_blank" class="m-item" v-for="(item, i) in list" :key="i">
                    <span> <i :class="item.public ? 'el-icon-caret-right' : 'el-icon-lock'"></i> {{ item.title }}</span>
                </a>
            </template>
            <span class="m-null" v-else>- 请登录后查看 -</span>
        </div>
    </div>
</template>

<script>
import { getMyPlans } from "@/service/manufacture";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
import Bus from "@/store/bus.js";
export default {
    name: "MyList",
    data: function () {
        return {
            list: [],
            isLogin: User.isLogin(),
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
        Bus.$on("update", () => {
            this.load();
        });
    },
};
</script>

<style lang="less">
.m-myList {
    .w(100%);
    min-width: 300px;
    max-width: 420px;
    .m-box {
        .flex;
        .pr(10px);
        .fz(14px);
        flex-direction: column;
        gap: 20px;
        overflow: auto;
        min-height: 700px;
        max-height: calc(100vh - 250px);

        .m-item {
            .db;
            .color( #24292e,#07ad36);
            .lh(30px);
            .r(10px);
            background: #fff;
            padding: 0 20px;

            span {
                .db;
                .nobreak;
            }
        }
        .m-null {
            .x;
            .r(10px);
            color: #999;
            background: #fff;
            line-height: 200px;
        }
    }
}
</style>
