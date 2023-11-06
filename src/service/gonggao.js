import { $node, $next, $cms } from "@jx3box/jx3box-common/js/https";
import axios from "axios";
import { __spider2, __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";

const $spider = axios.create({
    baseURL: __spider2,
});

// 日常
function getDaily(params) {
    return $cms({ mute: true }).get(`/api/cms/game/daily`, {
        params,
    });
}

// 美人图
function getMeirentu(server = "蝶恋花") {
    return $spider.get("/api/spider/meirentu", {
        params: {
            server: server,
        },
    });
}

// 宠物福缘
function getPetLucky() {
    return axios.get(__dataPath + "pvx/pet/output/pet_lucky.json");
}

function getPets(petids, client = "std") {
    return $node().get(`/pets`, {
        params: {
            ids: petids.join(","),
            client,
        },
    });
}

// 园宅会赛
function getFurniture(params) {
    return $cms({ mute: true }).get(`/api/cms/game/furniture/match`, {
        params,
    });
}

function getCelebrities({ client = "std" } = {}) {
    return $node().get(`/celebrities`, {
        params: {
            client,
        },
    });
}
function getGameReporter(params) {
    return $next().get("/api/game/reporter/horse", {
        params,
    });
}
function getChituHorse(server) {
    const params = {
        pageIndex: 1,
        pageSize: 50,
        server,
        type: "chitu-horse",
        subtype: "share_msg",
    };
    return $next().get("/api/game/reporter/horse", {
        params,
    });
}

export { getMeirentu, getDaily, getPetLucky, getPets, getFurniture, getCelebrities, getGameReporter, getChituHorse };
