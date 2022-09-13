<template>
    <div style="padding-left: 30px; padding-bottom: 2px; marin-bottom:12px">
        <div :id="chartId" style=" height: 214px; margin: 0 auto;"></div>
    </div>
</template>

<script>
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/component/title');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/grid');
require('echarts/lib/component/legend');
export default {
    name: 'transactionLine',
    props: ['id', 'time', 'data', 'size'],
    data: function() {
        return {
            chartId: this.id,
            chartTime: this.time || [],
            chartData: this.data || [],
            chartSize: this.size,
            chart: ''
        };
    },
    watch: {
        data: function() {
            this.chartId = this.id;
            this.chartTime = this.time;
            this.chartData = this.data;
            this.chartSize = this.size;
            this.chartShow();
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            this.chartShow();
        });
    },
    beforeDestroy: function() {
        window.onresize = null;
        if (this.chart) {
            this.chart.dispose();
        }
    },
    methods: {
        chartShow: function() {
            let that = this;
            this.chart = echarts.init(document.getElementById(this.chartId));
            let xAxisLabel = this.chartTime.map(item => {
                return item.substring(item.indexOf('-') + 1, item.length - 3);
            });
            let name = [];
            let series = [];
            this.chartData.forEach((item, idx) => {
                name.push(item.item);
                series.push({
                    name: item.item,
                    data: item.value,
                    type: 'line',
                    symbolSize: 1,
                    smooth: true
                });
            });

            let option = {
                legend: {
                    show: true,
                    y: 0,
                    padding: [6, 40, 10, 10],
                    itemGap: 20,
                    type: 'scroll'
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter: function(params) {
                        let str = '';
                        if (params.length >= 1) {
                            str += params[0]['name'] + '<br />';
                            params.forEach((item, idx) => {
                                str += `${item.marker}${item.seriesName}`;
                                str += that.$t('home.chartTransactions') + ': ';
                                str += `${item.data ? (item.data + that.$t('transaction.stroke')) : that.$t('monitor.noData')}`;
                                str += idx === params.length - 1 ? '' : '<br />';
                            });
                        }
                        return str;
                    }
                },
                grid: {
                    top: '54',
                    bottom: '20',
                    left: '20',
                    right: '30',
                    containLabel: true
                },
                xAxis: {
                    data: xAxisLabel,
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#e9e9e9',
                            width: 2
                        }
                    },
                    axisLabel: {
                        interval: 'auto',
                        textStyle: {
                            color: 'rgba(0, 14, 31, 0.62)'
                        },
                        formatter: function (value, index) {
                            let str = value.substring(0, value.indexOf(' ')) + '\n' +
                                value.substring(value.indexOf(' ') + 1);
                            return str;
                        }
                    }
                },
                yAxis: {
                    name: that.$t('transaction.stroke'),
                    nameTextStyle: {
                        color: 'rgba(0, 14, 31, 0.62)'
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: true ,
                        lineStyle: {
                            type: 'dashed',
                            color: '#e9e9e9'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function(value, index) {
                            if (value > 1000 && value < 1000000) {
                                return value / 1000 + 'K';
                            } else if (value > 1000000 || value === 1000000) {
                                return value / 1000000 + 'M';
                            } else {
                                return value + '';
                            }
                        },
                        textStyle: {
                            color: 'rgba(0, 14, 31, 0.62)'
                        }
                    }
                },
                series: series
            };
            this.chart.setOption(option, true);
            window.onresize = () => {
                this.chart.resize();
            };
        }
    }
};
</script>

<style>
</style>
