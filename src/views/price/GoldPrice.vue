<template>
  <div class="m-goldPrice" ref="wrap">
    <div class="m-chart-box" ref="chartBox">
      <div class="lengends">
        <div v-for="(item,index) in currentServerGoldPriceData" :key="index" :class="{loading}" :style="{background:colorMap[item.key]}" @mouseover="heightLight(index)" @mouseout="blur(index)" class="lengends-item">
          <div class="item-header">
            <div class="item-title">{{item.name}}</div>
          </div>
          <div class="item-data">
            <div>
              <div class="data-value">{{item.beforeYesterday}}</div>
              <div class="data-label">前日</div>
            </div>
            <div>
              <div class="data-value">{{item.yesterday}}</div>
              <div class="data-label">昨日</div>
            </div>
            <div>
              <div class="data-value">{{item.lastDay}}</div>
              <div class="data-label">今日</div>
            </div>
          </div>
        </div>
      </div>
      <div class="myChart" ref="chart"></div>
    </div>
  </div>
</template>

<script>
import server_cn from "@jx3box/jx3box-data/data/server/server_cn.json";
console.log("%c 🍬 server_cn: ", "font-size:20px;background-color: #FCA650;color:#fff;", server_cn);
import * as echarts from "echarts";
import { axios, realUrl } from "@/service/api.js";
let timer = null;
export default {
    name: "GoldPrice",
    inject: ["pricePage"],
    props: [],
    components: {},
    data: function () {
        return {
            loading: false,
            myChart: null,
            allGoldPriceData: {}, // 所有服务器金价数据
        };
    },
    computed: {
        colorMap() {
            return this.pricePage.colorMap;
        },
        // 当前服务器,按渠道分组的金价数据
        currentServerGoldPriceData() {
            let sortArr = [];
            const data = this.allGoldPriceData[this.pricePage.server] || {};
            for (const key in data) {
                const list = data[key];
                const lastDay = list[list.length - 1].average.toFixed(2);
                const yesterday = list[list.length - 2].average.toFixed(2);
                const beforeYesterday = list[list.length - 3].average.toFixed(2);
                const sum = list.reduce((total, item) => total + item.average, 0);
                sortArr.push({
                    name: key === "WBL" ? "万宝楼" : key,
                    key,
                    sum,
                    lastDay,
                    yesterday,
                    beforeYesterday,
                    data: list,
                });
            }
            sortArr = sortArr.sort((a, b) => b.sum - a.sum);
            return sortArr;
        },
    },
    watch: {
        "pricePage.server": {
            handler: function (newVal, oldVal) {
                this.setOption();
            },
        },
    },
    methods: {
        // 初始化自适应图表
        initChart() {
            // 创建实例
            this.myChart = echarts.init(this.$refs.chart);

            const myDiv = this.$refs.wrap;
            const observer = new ResizeObserver((entries) => {
                this.chartResize();
            });
            observer.observe(myDiv);

            // 监听resize事件
            const resizeHandle = () => {
                this.chartResize();
            };
            // 监听resize事件
            window.addEventListener("resize", resizeHandle);
            // 销毁实例
            this.$once("hook:beforeDestroy", () => {
                window.removeEventListener("resize", resizeHandle);
                observer.disconnect();
                this.myChart.dispose();
            });
        },
        // 防抖
        chartResize() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.myChart.resize();
            }, 100);
        },
        heightLight(index) {
            clearTimeout(timer);
            this.myChart.dispatchAction({
                type: "highlight",
                seriesIndex: index,
            });
        },
        // 取消高亮
        blur(index) {
            timer = setTimeout(() => {
                this.myChart.dispatchAction({
                    type: "downplay",
                    seriesIndex: index,
                });
            }, 100);
        },
        //  获取金价数据
        getGoldPriceData() {
            this.loading = true;
            return new Promise((resolve, reject) => {
                const priceUrl = "https://spider2.jx3box.com/api/spider/gold/trend";
                axios(priceUrl, "GET", false, {}, {}, {})
                    .then((res) => {
                        this.allGoldPriceData = res;
                    })
                    .catch((err) => {})
                    .finally(() => {
                        this.loading = false;
                        resolve();
                    });
            });
        },
        // 设置图表数据
        setOption() {
            const series = [];
            const data = this.currentServerGoldPriceData;
            const dates = []; // 日期集合
            let minV = Infinity;
            let maxV = -Infinity;
            for (const channel in data) {
                const list = data[channel].data || [];
                const key = data[channel].key;
                const seriesData = list.map((item) => {
                    const value = item.average.toFixed(2);
                    if (value >= maxV) maxV = value;
                    if (value <= minV) minV = value;
                    const date = item.date.substring(5);
                    dates.push(date);
                    return {
                        value: value,
                        name: date, //
                        color: this.colorMap[key],
                    };
                });
                series.push({
                    name: key,
                    data: seriesData,
                    type: "line",
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 10,
                    emphasis: {
                        // symbolSize: 15,
                    },
                    lineStyle: {
                        color: this.colorMap[key], // 线条颜色
                        width: 3,
                    },
                    itemStyle: {
                        color: this.colorMap[key], // 点的颜色
                    },

                    // 展示最高价、最低价、平均值
                    markPoint: {
                        symbolSize: 60,
                        data: [
                            {
                                type: "max",
                                name: "最高价",
                                label: {
                                    formatter: "{c}",
                                    fontSize: 10,
                                    color: "#fff",
                                },
                            },
                            {
                                type: "min",
                                name: "最低价",
                                label: {
                                    formatter: "{c}",
                                    fontSize: 10,
                                    color: "#fff",
                                },
                            },
                        ],
                    },
                    // 展示平均值
                    markLine: {
                        symbol: "none",
                        data: [
                            {
                                type: "average",
                                name: "平均价",
                                label: {
                                    formatter: "均价 {c}",
                                    color: this.colorMap[key],
                                },
                            },
                        ],
                    },
                });
            }
            minV = ~~(minV / 10) * 10;
            maxV = (~~(maxV / 10) + 1) * 10;

            const xAxisData = Array.from(new Set(dates)).sort(); // 根据日期集合得到横坐标
            const option = {
                xAxis: {
                    type: "category",
                    data: xAxisData,
                    boundaryGap: false,
                },
                yAxis: {
                    type: "value",
                    max: maxV,
                    min: minV,
                    interval: (maxV - minV) / 5, // 5段
                },
                grid: {
                    left: 20,
                    right: 90,
                    // bottom: 60,
                    containLabel: true,
                },
                dataZoom: [
                    {
                        type: "slider",
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: 100,
                    },
                ],
                emphasis: { focus: "series" },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        label: {
                            backgroundColor: "#6a7985",
                        },
                    },
                    formatter: (params) => {
                        let str = `<span>${params[0].axisValue}</span><br/>`;
                        str += `<span>服务器: ${this.pricePage.server}</span><br/>`;
                        params.forEach((item) => {
                            let marker = this.getMarker(item.data.color);
                            str += `${marker} <span style="display:inline-block;width:50px">${item.seriesName}</span>: ${item.value}<br/>`;
                        });
                        return str;
                    },
                },
                series,
            };
            this.myChart.resize();

            this.myChart.setOption(option);
        },
        // get marker
        getMarker(color) {
            return `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;
        },
    },
    created: function () {
        // 防止切到金价时，服务器不存在
        if (!server_cn.includes(this.pricePage.server)) {
            this.pricePage.server = server_cn[0];
        }
    },
    mounted: async function () {
        this.initChart();
        await this.getGoldPriceData();
        this.$nextTick(() => {
            this.setOption();
        });
    },
};
</script>
<style lang="less" scoped>
@import "~@/assets/css/price/goldPrice.less";
</style>