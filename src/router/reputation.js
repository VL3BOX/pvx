import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch((err) => err);
};

const routes = [
    {
        name: "reputation",
        path: "/",
        component: () => import("@/views/reputation/Index.vue"),
        meta: {
            sidebar: false,
        },
    },
    {
        name: "single",
        path: "/view/:reputation_id([_\\d]+)/:post_id(\\d+)?",
        component: () => import("@/views/reputation/Single.vue"),
    },
];

const router = new VueRouter({
    routes,
    base: "/reputation",
    mode: "history",
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
