import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const Index = () => import("@/views/pvg/Index.vue");
const Manufacture = () => import("@/views/pvg/Manufacture.vue");
const Item = () => import("@/views/pvg/Item.vue");

const routes = [
    { name: "index", path: "/", component: Index, meta: {} },
    {
        name: "manufacture",
        path: "/manufacture",
        component: Manufacture,
        meta: {
            name: '技艺助手'
        }
    },
    {
        name: "item",
        path: "/item_price",
        component: Item,
        meta: {
            name: ' 物价大全'
        }
    },
    {
        name: "price",
        path: "/price",
        component: () => import("@/views/price/Price.vue"),
        meta: {
            name: '价格走势'
        }
    },
];

const router = new VueRouter({
    mode: "history",
    base: '/pvg',
    routes,
});

export default router;
