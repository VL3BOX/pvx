import { $cms, $next } from "@jx3box/jx3box-common/js/https";

function getProfile() {
    return $cms({ mute: true })
        .get("/api/cms/user/my/profile")
        .then((res) => {
            return res.data.data;
        });
}

function getGoodsData(params) {
    return $next().get(`api/item-groups/with-prices`, {
        params,
    });
}


export { getProfile, getGoodsData };