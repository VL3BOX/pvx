<template>
    <CommonToolbar search color="#d16400" :active="active" :types="list" @update="updateToolbar">
        <template v-slot:prepend>
            <div class="m-toolbar-item">
                <el-select v-model="mapId" :class="{ active: mapId }" filterable class="u-select" clearable>
                    <el-option label="全部地图" value=""></el-option>
                    <el-option v-for="item in mapList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                    <template #prefix> 地图 </template>
                </el-select>
                <el-select v-model="petSource" :class="{ active: petSource }" filterable class="u-select" clearable>
                    <el-option
                        v-for="(item, index) in Source"
                        :key="'laiyuan' + index"
                        :label="item.name"
                        :value="item.source"
                    >
                    </el-option>
                    <template #prefix> 来源 </template>
                </el-select>
            </div>
        </template>
    </CommonToolbar>
</template>

<script>
import CommonToolbar from "@/components/common/toolbar.vue";
export default {
    name: "tabs",
    components: { CommonToolbar },
    props: ["types", "Source", "active", "mapList"],
    data: function () {
        return {
            petSource: "",
            title: "",
            mapId: "",
            filterOpen: false,
        };
    },
    computed: {
        params() {
            const _params = {};
            if (this.petSource) {
                _params.Source = this.petSource;
            }
            if (this.title) {
                _params.Name = this.title;
            }
            if (this.mapId) {
                _params.map = this.mapId;
            }
            return _params;
        },
        list() {
            return this.types.map((item) => {
                item.label = item.name;
                item.value = item.class;
                return item;
            });
        },
    },
    methods: {
        //切换数据
        clickTabs(val) {
            this.$emit("setActive", val);
        },
        updateToolbar(data) {
            const { type, search } = data;
            this.title = search;
            this.clickTabs(type);
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (obj) {
                this.$emit("change", obj);
            },
        },
    },
};
</script>
