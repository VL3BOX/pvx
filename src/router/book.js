import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch((err) => err);
};

const Index = () => import("@/views/book/Index.vue");
const List = () => import("@/views/book/List.vue");
const Single = () => import("@/views/book/Single.vue");

const routes = [
    { name: "index", path: "/", component: Index },
    { name: "list", path: "/list", component: List },
    { name: "single", path: "/:id([0-9]_\\d+)", component: Single },
];

const router = new VueRouter({
    routes,
    base: "/book",
    mode: "history",
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
