import { $node, $cms } from "@jx3box/jx3box-common/js/https";
import { __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
import axios from "axios";
// const $ = axios.create({
//     baseURL : 'http://localhost:9002/'
// })
const $ = $node();

function getPets(params) {
    return $.get("/pets", {
        params: params,
    });
}

function getPet(petid, params) {
    return $.get(`/pet/${petid}`, {
        params,
    });
}

function getPetSkill(petid, params) {
    return $.get(`/pet/${petid}/skill`, {
        params,
    });
}

function getShopInfo({ item_type, item_id, client = "std" }) {
    return $.get(`/shop`, {
        params: {
            client,
            itemType: item_type,
            itemId: item_id,
        },
    });
}

function getPetLucky() {
    return axios.get(__dataPath + "pvx/pet/output/pet_lucky.json");
}

function getPetLuckyReverse() {
    return axios.get(__dataPath + "pvx/pet/output/pet_lucky_reverse.json");
}

function getSkill(params) {
    return $.get("/skills", {
        params,
    });
}
// 海报
function getSliders(type, client, source_ids, per = 10) {
    let _params = {
        client: client,
        type: type,
        source_type: "pet",
        source_ids: source_ids,
    };
    if (per) {
        _params.per = per;
    }
    return $cms({ mute: true }).get(`/api/cms/news/v2`, {
        params: _params,
    });
}
export { getPets, getPet, getPetSkill, getShopInfo, getPetLucky, getPetLuckyReverse, getSkill, getSliders };
