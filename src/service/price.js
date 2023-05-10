import { $cms, $helper } from "@jx3box/jx3box-common/js/https";
import { axios } from "@/service/api.js";
import {  } from "@/service/item";

// 获取金价数据
function getGoldPriceData() {
    const priceUrl = "https://spider2.jx3box.com/api/spider/gold/trend";
    return axios(priceUrl, "GET", false, {}, {}, {})
}


// // 获取我的清单
// function getMyPlans() {
//     return new Promise((resolve, reject) => {
//         $helper()
//             .get(`api/my/item_plans`, {
//                 params: {
//                     limit: "10",
//                 },
//             })
//             .then((res) => {
//                 const data = res.data.data.data || [];
//                 resolve(data)
//             })
//             .finally(() => {
//             });
//     });
// }

// 获取我的清单
function getMyPlans() {
    return new Promise((resolve, reject) => {
        $helper()
            .get(`api/cms/app/item_plans/mine`, {
                params: {
                    page: 1,
                    per: 10
                },
            })
            .then((res) => {
                const data = res.data.data.data || [];
                resolve(data)
            })
            .finally(() => {
            });
    });
}

// 获取关注的清单的id集合
function getCarePlans() {
    return new Promise((resolve, reject) => {
        $cms()
            .get(`api/cms/user/my/meta`, {
                params: {
                    key: "focus_price",
                },
            })
            .then((res) => {
                if (res.data.data) {
                    const data = res.data.data.split(",").map(Number);
                    resolve(data)
                } else {
                    resolve([])
                }
            });
    });
}
export { getGoldPriceData, getMyPlans, getCarePlans };
