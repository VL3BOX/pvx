const path = require("path");
const pkg = require("./package.json");
const { JX3BOX, SEO } = require("@jx3box/jx3box-common");
const Setting = require("./setting.vi.json");

module.exports = {
    //❤️ Multiple pages ~
    pages: {
        index: {
            title: "Chuyên mục hưu nhàn" + Setting.suffix,
            entry: "src/main.js",
            template: "public/index.vi.html",
            filename: "index.html",
        },
        face: {
            title: "Dị dung" + Setting.suffix,
            entry: "src/pages/face.js",
            template: "public/index.vi.html",
            filename: "face/index.html",
        },
        body: {
            title: "Hình thể" + Setting.suffix,
            entry: "src/pages/body.js",
            template: "public/index.vi.html",
            filename: "body/index.html",
        },
        homeland: {
            title: "Gia viên chỉ nam" + Setting.suffix,
            entry: "src/pages/homeland.js",
            template: "public/index.vi.html",
            filename: "homeland/index.html",
        },
        pet: {
            title: "Bách khoa sủng vật" + Setting.suffix,
            entry: "src/pages/pet.js",
            template: "public/index.vi.html",
            filename: "pet/index.html",
        },
        adventure: {
            title: "Bách khoa kỳ ngộ" + Setting.suffix,
            entry: "src/pages/adventure.js",
            template: "public/index.vi.html",
            filename: "adventure/index.html",
        },
        horse: {
            title: "Bách khoa tọa kỵ" + Setting.suffix,
            entry: "src/pages/horse.js",
            template: "public/index.vi.html",
            filename: "horse/index.html",
        },
        book: {
            title: "Bách khoa thư tịch" + Setting.suffix,
            entry: "src/pages/book.js",
            template: "public/index.vi.html",
            filename: "book/index.html",
        },
        furniture: {
            title: "Bách khoa gia cụ" + Setting.suffix,
            entry: "src/pages/furniture.js",
            template: "public/index.vi.html",
            filename: "furniture/index.html",
        },
        reputation: {
            title: "Bách khoa danh vọng" + Setting.suffix,
            entry: "src/pages/reputation.js",
            template: "public/index.vi.html",
            filename: "reputation/index.html",
        },
        pvg: {
            title: "Thương gia kỳ tài" + Setting.suffix,
            entry: "src/pages/pvg.js",
            template: "public/index.vi.html",
            filename: "pvg/index.html",
        },
        exam: {
            title: "Thi cử Kiếm Tam" + Setting.suffix,
            entry: "src/pages/exam.js",
            template: "public/index.vi.html",
            filename: "exam/index.html",
        },
    },

    outputDir: process.env["BUILD_MODE"] == "preview" ? path.resolve(__dirname, pkg.name) : 'dist', // 指定构建输出的目录

    //❤️ Proxy ~
    devServer: {
        proxy: {
            "/api/serendipity": {
                target: "https://pull.j3cx.com/",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/vip": {
                target: "https://pay.vl3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/inspire": {
                target: "https://pay.vl3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/messages": {
                target: "https://helper.vl3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/cms": {
                target: process.env["DEV_SERVER"] == "true" ? "http://localhost:7100" : "https://cms.vl3box.com",
                // target: "https://cms.vl3box.com",
            },
            "/api/team": {
                target: "https://team.api.vl3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/buy-licence": {
                target: "https://pay.vl3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/spider": {
                target: "https://spider2.vl3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api": {
                target: "https://next2.vl3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/locales": {
                target: "https://cms.vl3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
        },
        disableHostCheck: true,
    },

    //❤️ define path for static files ~
    publicPath:
        //FOR Localhost => development
        (process.env.NODE_ENV === "development" && "/") ||
        // BY preview
        (process.env.BUILD_MODE == "preview" && `/${pkg.name}/`) ||
        //BY origin
        (process.env.STATIC_PATH === "origin" && `${JX3BOX.__staticPath["origin"]}${pkg.name}/`) ||
        //BY github
        (process.env.STATIC_PATH === "github" && `${JX3BOX.__staticPath["github"]}${pkg.name}/`) ||
        //BY jsdelivr
        (process.env.STATIC_PATH === "jsdelivr" && `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`) ||
        //BY OSS=>CDN
        (process.env.STATIC_PATH === "mirror" && `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`) ||
        //BY relative path
        (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) ||
        //BY root path or bind a domain
        (process.env.STATIC_PATH == "root" && "/") ||
        //for lost
        "/",

    outputDir: process.env["BUILD_MODE"] == "preview" ? path.resolve(__dirname, pkg.name) : "dist", // 指定构建输出的目录

    chainWebpack: (config) => {
        //💘 html-webpack-plugin ~
        // Multiple pages disable the block below
        // config.plugin("html").tap(args => {
        //     args[0].meta = {                            //------设置SEO信息
        //         Keywords: Setting.keys,
        //         Description: Setting.desc
        //     };
        //     args[0].title = Setting.title + SEO.title;  //------自动添加标题后缀
        //     return args;
        // });

        //💝 in-line small imgs ~
        config.module
            .rule("images")
            .use("url-loader")
            .loader("url-loader")
            .tap((options) => Object.assign(options, { limit: 10240 }));

        //💝 in-line svg imgs ~
        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        var preload_styles = [];
        preload_styles.push(
            path.resolve(__dirname, "./node_modules/csslab/base.less"),
            path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less"),
            path.resolve(__dirname, "./src/assets/css/var.less")
        );
        function addStyleResource(rule) {
            rule.use("style-resource").loader("style-resources-loader").options({
                patterns: preload_styles,
            });
        }
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));
    },
};
