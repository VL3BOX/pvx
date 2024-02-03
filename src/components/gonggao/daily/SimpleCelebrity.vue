<template>
    <div class="m-simple-celebrity">
        <el-tooltip v-for="(item, i) in list" :key="i" placement="top" popper-class="m-celebrity-notice-tooltip">
            <div slot="content">
                <div>{{ item.desc }}</div>
            </div>
            <div class="m-celebrity-item" :class="!i && 'current-item'">
                <div class="u-celebrity-title">
                    <div>{{ i ? item.timeFormat : "▶ " + $t('当前') }}</div>
                    <div>{{ item.map }}</div>
                </div>
                <div class="u-celebrity-desc">
                    <div>
                        <span>{{ $t('位置：') }}</span>
                        <b>{{ item.site }}</b>
                    </div>
                    <div>
                        <span>{{ $t('阶段：') }}</span>
                        <img :src="require(`@/assets/img/gonggao/minimap_${item.icon || 6}.png`)" />
                        <span>{{ item.stage }}</span>
                    </div>
                </div>
            </div>
        </el-tooltip>
    </div>
</template>
<script>
import { getCelebrities } from "@/service/gonggao";
export default {
    name: "SimpleCelebrity",
    data: function () {
        return {
            loading: false,
            list: [],
            celebrityList: [],
            currentDate: {
                h: new Date().getHours(),
                m: new Date().getMinutes(),
            },
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        loadData: function () {
            this.loading = true;
            return getCelebrities()
                .then((res) => {
                    this.celebrityList = res.data.map((item) => {
                        item.icon = Number(item.icon);
                        item.time = Number(item.time);
                        return item;
                    });
                })
                .finally(() => {
                    this.getList(this.currentDate);
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        toFormatTime(h, m) {
            const hF = h < 0 ? "23" : h < 10 ? "0" + h : h > 23 ? "00" : h;
            const hM = m < 10 ? "0" + m : m;
            return hF + ":" + hM;
        },
        getList(date) {
            const currentKey = "c" + (date.h % 2 === 0 ? "0" : "1") + (date.m < 30 ? "0" : "1");
            const isEqualMinute = this.celebrityList.findIndex((item) => {
                return item.key === currentKey && item.time === date.m;
            });
            let index = 0;
            if (isEqualMinute !== -1) {
                // 包含当前时间
                index = isEqualMinute;
            } else {
                // 不包含
                const nIndex = this.celebrityList.findIndex((item) => {
                    return item.key === currentKey && item.time > date.m;
                });
                if (nIndex === -1) {
                    // 最后一个
                    index = this.celebrityList.length - 1;
                } else {
                    index = nIndex - 1;
                }
            }
            // 13: 57
            let list = this.celebrityList.slice(index, index + 3);
            let newList = [];
            if (list.length < 3) {
                newList = list.concat(this.celebrityList.slice(0, 3 - list.length));
            } else {
                newList = [].concat(list);
            }
            this.list = newList.map((item) => {
                // 当前时间
                let h = this.currentDate.h;
                // "双数整点 c00 双数半点 c01 单数整点 c10 单数半点 c11" "烂柯山 晟江 百溪 楚州"
                // 烂柯山 晟江/烂柯山 晟江 不变
                // 晟江 百溪/晟江 百溪 加1
                // 百溪 楚州/百溪 楚州 不变
                // 楚州 烂柯山/楚州 烂柯山 加1
                if (currentKey === "c01" && item.key === "c10") {
                    h = h + 1;
                }
                if (currentKey === "c11" && item.key === "c00") {
                    h = h + 1;
                }
                item.h = h;
                item.timeFormat = this.toFormatTime(h, item.time);
                return item;
            });
        },
    },
    watch: {
        currentDate: {
            immediate: true,
            deep: true,
            handler(date) {
                if (this.list.length) {
                    this.getList(date);
                }
            },
        },
    },
    created() {
        this.loadData();
    },
    mounted() {
        setInterval(() => {
            if (this.currentDate.h !== new Date().getHours() || this.currentDate.m !== new Date().getMinutes()) {
                this.currentDate = {
                    h: new Date().getHours(),
                    m: new Date().getMinutes(),
                };
            }
        }, 1000);
    },
};
</script>
