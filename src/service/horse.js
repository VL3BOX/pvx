import { $node } from "@jx3box/jx3box-common/js/https";
import { __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
import axios from "axios";
// const $ = axios.create({
//     baseURL : 'http://localhost:9002/'
// })
const $ = $node()

function getHorses(params) {
    return $.get("/horses", {
        params: params,
    });
}

function getHorse(horseid, params) {
    return $.get(`/horse/${horseid}`, {
        params
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

function getAttrs(params) {
    return $.get('/horse/attrs', {
        params
    })
}

function getFeeds(params) {
  return $.get('/horse/feeds ', {
      params
  })
}

export { getHorses, getHorse, getAttrs, getShopInfo, getFeeds };
