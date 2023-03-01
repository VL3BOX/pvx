import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

const routes = [
    {
        name: "book",
        path: "/",
        component: () => import("@/views/book/Index.vue"),
        meta: {
            sidebar: false
        },
    },
    {
        name: "result",
        path: "/search",
        component: () => import("@/views/book/SearchResult.vue"),
    },
    {
        name: "single",
        path: "/view/:book_id([_\\d]+)/:post_id(\\d+)?",
        component: () => import("@/views/book/Single.vue"),
    },
];

const router = new VueRouter({
    routes,
    base: "/book",
    mode: "history",
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes('/#')) {
        next(to.fullPath.replace('/#', ''));
    }
    next()
});

export default router;
