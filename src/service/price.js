import { axios } from "@/service/api.js";
import { $cms, $next } from "@jx3box/jx3box-common/js/https";

// 获取金价数据
function getGoldPriceData() {
    return axios("https://spider2.jx3box.com/api/spider/gold/trend", "GET", false, {}, {}, {})
}

// 获取系统关注的物品信息
function getSystemGoodsData() {
    return $cms().get("api/cms/helper/item/group")
}

// 获取服务器物价
function getServerPriceData(params) {
    return $next().get("api/item-price/list", {
        params
    })
}

// 获取用户信息
function getUserInfo() {
    return $cms().get("api/cms/user/my/info");
}

// 获取我关注的清单
function getMyFollowList() {
    return $cms().get("api/cms/user/my/meta?key=follow_inventory");
}

// 设置我关注的清单
function setMyFollowList(params) {
    return $cms().post("api/cms/user/my/meta?key=follow_inventory", params);
}


// 获取我的清单
function getMyPlanList(params) {
    return $cms().get("api/cms/app/item_plans/mine", {
        params
    });
}

// 获取清单详情
function getMyGoodsDetail(id) {
    return $cms().get("api/cms/app/item_plan/" + id);
}




export {
    getGoldPriceData, getSystemGoodsData, getServerPriceData, getUserInfo, getMyFollowList, getMyPlanList, setMyFollowList,getMyGoodsDetail
}