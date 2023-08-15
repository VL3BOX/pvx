import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const bodyList = () => import("../views/body/List.vue");
const bodySingle = () => import("../views/body/Single.vue");
const bodyData = () => import("../views/body/Parse.vue");

const routes = [
    { name: "bodyList", path: "/", component: bodyList },
    { name: "bodySingle", path: "/:id(\\d+)", component: bodySingle },
    { name: "bodyData", path: "/bodydata", component: bodyData },
];

const router = new VueRouter({
    mode: "history",
    base: "/body",
    routes,
});

export default router;