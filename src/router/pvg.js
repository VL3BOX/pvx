import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch((err) => err);
};

const Index = () => import("@/views/pvg/Index.vue");
const Manufacture = () => import("@/views/pvg/Manufacture.vue");
const Item = () => import("@/views/pvg/Item.vue");
const Price = () => import("@/views/price/index.vue");
const Notice = () => import("@/views/pvg/Gonggao.vue");

const routes = [
    { name: "index", path: "/", component: Index, meta: {} },
    {
        name: "manufacture",
        path: "/manufacture",
        component: Manufacture,
        meta: {
            name: "技艺助手",
        },
    },
    {
        name: "item",
        path: "/item_price",
        component: Item,
        meta: {
            name: " 物价大全",
        },
    },
    {
        name: "price",
        path: "/price",
        component: Price,
        meta: {
            name: "价格走势",
        },
    },
    {
        name: "gonggao",
        path: "/gonggao",
        component: Notice,
        redirect: {
            name: "daily",
        },
        meta: {
            name: "活动告示",
        },
        children: [
            {
                name: "daily",
                path: "daily",
                component: () => import("@/components/gonggao/Daily.vue"),
                meta: {
                    name: "速览",
                },
            },
            {
                name: "calendar",
                path: "calendar/:year(\\d+)/:month(\\d+)/:date(\\d+)?",
                component: () => import("@/components/gonggao/Calendar.vue"),
                meta: {
                    name: "日历",
                },
            },
            {
                name: "server",
                path: "server",
                component: () => import("@/components/gonggao/Server.vue"),
                meta: {
                    name: "开服状态",
                },
            },
            {
                name: "calendarSingle",
                path: "single/:id",
                component: () => import("@/components/gonggao/calendar/Single.vue"),
                meta: {
                    sidebar: true,
                },
            },
        ],
    },
];

const router = new VueRouter({
    mode: "history",
    base: "/pvg",
    routes,
});

const today = new Date();

router.beforeEach((to, from, next) => {
    if (to.fullPath === "/gonggao/calendar") {
        next(`${to.fullPath}/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`);
    }
    next();
});

export default router;
