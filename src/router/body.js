import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const List = () => import("@/views/body/List.vue");
const Single = () => import("@/views/body/Single.vue");
const Data = () => import("@/views/body/Parse.vue");

const routes = [
    { name: "list", path: "/", component: List },
    { name: "single", path: "/:id(\\d+)", component: Single },
    { name: "bodydata", path: "/bodydata", component: Data },
];

const router = new VueRouter({
    mode: "history",
    base: "/body",
    routes,
});

export default router;