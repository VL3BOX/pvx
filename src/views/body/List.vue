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
import faceTabs from "@/components/face/tabs";
import body_types from "@/assets/data/body_types.json";
export default {
    name: "BodyList",
    data: function () {
        return {
            body_types,
            active: "",
            list: [],
            tabsData: {},
            page: 1,
            pageTotal: 1,
            total: 0,
            showAllList: false,
            link: {
                data: "/body/bodydata",
                key: "body",
            },
        };
    },
    components: {
        faceTabs,
    },
    computed: {},
    methods: {
        handleTabChange: function (data) {
            this.page = 1;
            this.tabsData = data;
        },
        setActive(val) {
            this.active = val;
            document.documentElement.scrollTop = 0;
        },
    },
};
</script>
