import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const List = () => import("@/views/adventure/AdventureList.vue");
const Single = () => import("@/views/adventure/AdventureSingle.vue");

const routes = [
    { name: "list", path: "/", component: List },
    { name: "single", path: "/:id(\\d+)", component: Single },
];

const router = new VueRouter({
    mode: "history",
    base: "/adventure",
    routes,
});

export default router;
