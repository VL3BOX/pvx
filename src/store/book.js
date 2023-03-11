import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let store = {
    state: {
        recentReadList: JSON.parse(localStorage.getItem("book_readings")) || [],
        client: location.href.includes("origin") ? "origin" : "std",
        faceSingle: {},
        isCollapse: false,
    },
    mutations: {
        SET_RECENT_READ_LIST(state, data) {
            const len = state.recentReadList.length;
            if (!state.recentReadList.find((book) => book.idKey === data.idKey)) {
                if (len >= 20) {
                    state.recentReadList.splice(len - 1, 1);
                }
                state.recentReadList.unshift(data);
                localStorage.setItem("book_readings", JSON.stringify(state.recentReadList));
            }
        },
        toState(state, data) {
            Object.keys(data).forEach((item) => {
                state[item] = data[item];
            });
        },
    },

    actions: {
        setRecentReadList({ commit }, data) {
            commit("SET_RECENT_READ_LIST", data);
        },
    },
};

export default new Vuex.Store(store);
