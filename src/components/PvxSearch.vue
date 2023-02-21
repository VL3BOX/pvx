<template>
    <div class="pvx-search-wrapper">
        <div class="search-group animate__animated animate__fadeInDown">
            <div
                class="search-item"
                :class="{
                    'type-list': item.type === 'radio',
                    'filter-wrap': item.type === 'filter',
                    'input-wrap': !item.type,
                }"
                v-for="item in items"
                :key="item.key"
            >
                <template v-if="item.type === 'radio'">
                    <el-radio-group v-model="formData[item.key]">
                        <el-radio-button
                            class="type-item"
                            :class="{ active: typeItem.type === formData[item.type] }"
                            v-for="typeItem in item.options"
                            :key="typeItem.type"
                            :label="typeItem.type"
                            >{{ typeItem.name }}</el-radio-button
                        >
                    </el-radio-group>
                </template>
                <template v-if="item.type === 'filter' && item.options.length">
                    <el-popover
                        :placement="isPhone() ? 'right' : 'bottom'"
                        width="320"
                        trigger="click"
                        v-model="filterValue"
                    >
                        <div class="filter-content">
                            <div class="filter-item" v-for="fItem in item.options" :key="fItem.key">
                                <el-select
                                    v-if="fItem.type === 'select'"
                                    :id="fItem.remote"
                                    class="select-wrapper"
                                    v-model="formData[fItem.key]"
                                    :multiple="fItem.multiple"
                                    :collapse-tags="fItem.multiple"
                                    clearable
                                    :filterable="fItem.filterable"
                                    :placeholder="`请${fItem.remote ? '输入' : '选择'}${fItem.name}`"
                                    :remote="Boolean(fItem.remote)"
                                    :remote-method="remoteMethod"
                                    :loading="selectLoading === fItem.remote"
                                    :default-first-option="true"
                                    @focus="selectFocus"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="option in fItem.remote ? fItem.options : fItem.options"
                                        :key="option.value"
                                        :label="
                                            fItem.showValue ? option.label + '(' + option.value + ')' : option.label
                                        "
                                        :value="option.value"
                                    >
                                    </el-option>
                                </el-select>
                                <div v-if="fItem.type === 'checkbox'" class="check-box-wrapper">
                                    <div class="name">{{ fItem.name }}</div>
                                    <el-checkbox-group
                                        v-model="checkboxArr"
                                        @change="checkboxChange($event, fItem.key)"
                                    >
                                        <el-checkbox-button
                                            v-for="option in fItem.options"
                                            :label="option.value"
                                            :key="option.value"
                                        >
                                            {{ option.label }}
                                        </el-checkbox-button>
                                    </el-checkbox-group>
                                </div>
                            </div>
                            <el-row v-if="item.options.length">
                                <el-col :offset="20" :span="4">
                                    <el-button size="mini" type="info" plain @click="reset">重置</el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="filter-img" :class="filterValue && 'active'" slot="reference">
                            <img svg-inline src="@/assets/img/filter.svg" fill="#949494" />
                        </div>
                    </el-popover>
                </template>
                <template v-if="!item.type">
                    <el-input
                        v-model="formData[item.key]"
                        class="search-input"
                        :placeholder="`输入${item.name}搜索`"
                        clearable
                        suffix-icon="el-icon-search"
                    >
                    </el-input>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { isPhone } from "@/utils/index";
export default {
    name: "HorseSearch",
    props: {
        items: {
            type: Array,
            required: true,
        },
        initValue: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            filterValue: false,
            formData: {},
            currentMethod: "",
            currentOptions: [],
            selectLoading: "",
            checkboxArr: [],
        };
    },
    watch: {
        formData: {
            deep: true,
            handler(data) {
                this.$emit("search", data);
            },
        },
        initValue: {
            immediate: true,
            deep: true,
            handler: function (initValue) {
                // 初始化值
                const items = this.items;
                const formData = {};
                items.forEach((item) => {
                    if (item.type !== "filter") {
                        formData[item.key] = "";
                    } else {
                        const options = item.options;
                        options.forEach((oItem) => {
                            formData[oItem.key] = "";
                        });
                    }
                });
                // 使select的值响应式化
                this.formData = { ...formData, ...initValue };
            },
        },
    },
    methods: {
        isPhone,
        selectFocus(e) {
            this.currentMethod = e.target.id;
        },
        checkboxChange(value, key) {
            this.formData[key] = value.join(",");
        },
        reset() {
            this.checkboxArr = [];
            this.formData = {};
        },
        async remoteMethod(query) {
            const currentMethod = this.currentMethod;
            this.selectLoading = currentMethod;
            await this.$parent[currentMethod]({ name: query }).then(() => {
                this.selectLoading = "";
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/search.less";
</style>
