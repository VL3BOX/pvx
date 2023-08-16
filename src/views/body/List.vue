<template>
    <div class="m-body-list">
        <faceTabs
            @change="handleTabChange"
            :body_types="body_types"
            :link="link"
            :active="active"
            @setActive="setActive"
        />
    </div>
</template>
<script>
import { getBodyList } from "@/service/body";
import faceTabs from "@/components/face/tabs";
import body_types from "@/assets/data/body_types.json";
import { clone } from "lodash";
export default {
    name: "BodyList",
    data: function () {
        return {
            active: "",
            body_types,
            tabsData: {},
            link: {
                data: "/body/bodydata",
                key: "body",
            },

            loading: false,
            list: [],
            page: 1,
            pageSize: 10,
            pageTotal: 1,
            total: 0,
            showAllList: false,
        };
    },
    components: {
        faceTabs,
    },
    computed: {
        params({ tabsData }) {
            return {
                ...tabsData,
                pageIndex: this.page,
                pageSize: this.pageSize,
                client: this.client,
            };
        },
    },
    watch: {
        params: {
            deep: true,
            handler() {
                this.getData();
            },
        },
    },
    methods: {
        handleTabChange(data) {
            this.page = 1;
            this.tabsData = data;
        },
        setActive(val) {
            this.active = val;
            document.documentElement.scrollTop = 0;
        },
        getData() {
            this.loading = true;
            let params = clone(this.params);
            getBodyList(params).then((res) => {
                this.list = res.data.data.list || [];
                this.total = res.data.data.page.total;
            });
        },
    },
};
</script>
