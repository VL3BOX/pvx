import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const faceList = () => import("../views/face/List.vue");
const faceSingle = () => import("../views/face/Single.vue");
const faceData = () => import("../views/face/Parse.vue");

const routes = [
    { name: "list", path: "/", component: faceList },
    { name: "single", path: "/:id(\\d+)", component: faceSingle },
    { name: "facedata", path: "/facedata", component: faceData },
];

const router = new VueRouter({
    mode: "history",
    base: "/face",
    routes,
});

export default router;
