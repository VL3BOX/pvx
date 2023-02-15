import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const List = () => import("@/views/horse/HorseList.vue");
const Single = () => import("@/views/horse/HorseSingle.vue");

const routes = [
    { name: "list", path: "/", component: List },
    { name: "single", path: "/:id(\\d+)", component: Single },
];

const router = new VueRouter({
    mode: "history",
    base : '/horse',
    routes,
});

export default router;
