<template>
  <div class="u-data-plane" :style="{background:colorMap[item.key]}" :class="{noData:!item.key}">
    <div class="plane-header">
      <div class="plane-data">
        <div class="data-value">{{item.recommend||0}}</div>
        <div class="data-label">建议价格</div>
      </div>
      <div class="plane-channel">{{item.name}}</div>
    </div>
    <div class="plane-chart" ref="chart" />
    <div class="plane-xAxis">
      <div class="xAxis-item">
        <div class="xAxis-value">{{item.data && item.data[0].value||0}}</div>
        <div class="xAxis-label">前日</div>
      </div>
      <div class="xAxis-item">
        <div class="xAxis-value">{{item.data && item.data[1].value||0}}</div>
        <div class="xAxis-label">昨日</div>
      </div>
      <div class="xAxis-item">
        <div class="xAxis-value">{{item.data && item.data[2].value||0}}</div>
        <div class="xAxis-label">今日</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
    name: "GoodsPrice",
    inject: ["pricePage"],
    props: ["item"],
    components: {},
    data: function () {
        return {
            myChart: null,
        };
    },
    computed: {
        colorMap() {
            return this.pricePage.colorMap;
        },
    },
    watch: {
        item: {
            handler(value) {
                if (value.key) {
                    this.$nextTick(() => {
                        this.setOption();
                    });
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        // 初始化自适应图表
        initChart() {
            // 创建实例
            this.myChart = echarts.init(this.$refs.chart);
            // 监听resize事件
            const resizeHandle = () => {
                this.myChart.resize();
            };
            // 监听resize事件
            window.addEventListener("resize", resizeHandle);
            // 销毁实例
            this.$once("hook:beforeDestroy", () => {
                window.removeEventListener("resize", resizeHandle);
                this.myChart.dispose();
            });
        },
        // 设置图表配置项
        setOption() {
            if (!this.myChart) return;
            if (!this.item.data.length) return;
            const data = this.item.data;
            const min = Math.min(...data);
            const max = Math.max(...data);
            this.myChart.setOption({
                xAxis: {
                    show: false,
                    type: "category",
                    data: ["前日", "昨日", "今日"],
                    boundaryGap: false,
                },
                grid: {
                    left: 5,
                    right: 5,
                    bottom: 5,
                    top: 5,
                    // containLabel: true,
                },
                yAxis: {
                    show: false,
                    type: "value",
                    min,
                    max,
                },
                series: [
                    {
                        clip: false,
                        smooth: true,
                        data: data,
                        type: "line",
                        symbol: "none",
                        lineStyle: {
                            color: "#fff",
                            width: 5,
                            cap: "round",
                        },
                        silent: true,
                    },
                ],
            });
        },
    },
    created: function () {},
    mounted: function () {
        this.initChart();
        // this.setOption();
    },
};
</script>

<style lang="less" scoped>
.u-data-plane {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 640px;
    height: 260px;
    padding: 14px 20px;
    border-radius: 10px;
    user-select: none;

    gap: 10px;
    * {
        box-sizing: border-box;
    }
    &.noData {
        background: #fff;
        .plane-header {
            .plane-data {
                color: #999;
                .data-value {
                    color: #999;
                }
            }
        }
    }
    .plane-header {
        display: flex;
        justify-content: space-between;
        width: 600px;
        height: 90px;
        .plane-data {
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            color: #fff;
            font-size: 24px;
            font-weight: 500;
            .data-value {
                font-size: 58px;
                font-weight: bold;
                line-height: 77px;
            }
            .data-label {
                font-size: 14px;
                font-weight: bold;
                line-height: 18px;
            }
        }
        .plane-channel {
            color: #fff;
            font-size: 32px;
            font-weight: 700;
            line-height: 42px;
        }
    }
    .plane-chart {
        width: 600px;
        height: 86px;
    }
    .plane-xAxis {
        display: flex;
        justify-content: space-between;
        .xAxis-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
        }
    }
}

@media screen and (max-width: @ipad) {
    .u-data-plane {
        width: 300px;
        height: 200px;
        .plane-chart {
            width: 100%;
            height: 61px;
        }
        .plane-header {
            height: 55px;
            width: 100%;
            .plane-data {
                font-size: 24px;
                .data-value {
                    font-size: 29px;
                    line-height: initial;
                }
            }
            .plane-channel {
                font-size: 16px;
            }
        }
    }
}
@media screen and (max-width: @phone) {
    .u-data-plane {
        width: 300px;
        height: 200px;
        .plane-chart {
            width: 100%;
            height: 61px;
        }
        .plane-header {
            height: 55px;
            width: 100%;
            .plane-data {
                font-size: 24px;
                .data-value {
                    font-size: 29px;
                    line-height: initial;
                }
            }
            .plane-channel {
                font-size: 16px;
            }
        }
    }
}
</style>