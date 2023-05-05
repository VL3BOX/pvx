<template>
    <div class="m-simple-mrt">
        <td :title="server">
            {{ server }}
        </td>
        <td>
            <el-tooltip class="item" effect="dark" :content="(meirentu && meirentu.desc) || '无'" placement="bottom">
                <div>
                    {{ (meirentu && meirentu.name) || "今日暂无画像" }}
                </div>
            </el-tooltip>
        </td>
    </div>
</template>

<script>
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import { getMeirentu } from "@/service/gonggao";
export default {
    name: "SimpleMrt",
    data() {
        return {
            meirentu: null,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client || "std";
        },
        servers: function () {
            if (this.client == "std") {
                return servers_std;
            } else {
                return servers_origin;
            }
        },
        server() {
            return this.$store.state.server;
        },
    },
    watch: {
        server: {
            immediate: true,
            handler(val) {
                val && this.loadMeirentu();
            },
        },
    },
    methods: {
        // 获取美人图
        loadMeirentu() {
            getMeirentu(this.server).then((res) => {
                this.meirentu = res.data.data;
            });
        },
    },
};
</script>
