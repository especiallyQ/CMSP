<template>
    <div class="over-view-wrapper">
        <v-content-head :headTitle="$t('title.dataOverview')"></v-content-head>
        <div style="margin: 5px;">
            <div style="margin: 10px 10px 6px 10px;">
                <el-row>
                    <el-col :xs='24' :sm="24" :md="11" :lg="10" :xl="8" v-loading="loadingNumber">
                        <div
                            class="overview-item"
                            style="font-size: 0"
                            v-for="item in detailsList"
                            :key='item.label'
                            @click="goDetailRouter(item)"
                            :class="item.bg">
                            <div class="overview-item-img">
                                <svg
                                    class="overview-item-svg"
                                    aria-hidden="true"
                                    v-if='item.icon == "#ext-icon-node1"'>
                                    <use xlink:href="#ext-icon-node1"></use>
                                </svg>
                                <svg
                                    class="overview-item-svg"
                                    aria-hidden="true"
                                    v-else-if='item.icon == "#ext-icon-contract"'>
                                    <use xlink:href="#ext-icon-contract"></use>
                                </svg>
                                <svg
                                    class="overview-item-svg"
                                    aria-hidden="true"
                                    v-else-if='item.icon == "#ext-icon-block"'>
                                    <use xlink:href="#ext-icon-block"></use>
                                </svg>
                                <svg
                                    class="overview-item-svg"
                                    aria-hidden="true"
                                    v-else-if='item.icon == "#ext-icon-transation"'>
                                    <use xlink:href="#ext-icon-transation"></use>
                                </svg>
                            </div>
                            <div class="overview-item-content">
                                <div class="overview-item-number">{{item.value}}</div>
                                <div class="overview-item-title">{{item.label}}</div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs='24' :sm="24" :md="13" :lg="14" :xl="16">
                        <div style="margin: 8px 0px 0 0px" class="module-box-shadow bg-fff">
                            <div class="part2-title">
                                <span class="part2-title-left">
                                    {{this.$t('home.chartTitle')}}
                                </span>
                                <span class="part2-title-right">
                                    {{this.$t('home.chartExplain')}}
                                </span>
                            </div>
                            <div class="chart" ref="chart">
                                <v-chart
                                    ref="linechart"
                                    :id="'homeId'"
                                    v-if="chartStatistics.show"
                                    :time="chartStatistics.time"
                                    :data="chartStatistics.data"
                                    :size="chartStatistics.chartSize"
                                    v-loading="loadingCharts">
                                </v-chart>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="module-wrapper-small">
                <el-table
                    :data="nodeData"
                    class="search-table-content"
                    v-loading="loadingNodes">
                    <el-table-column
                        v-for="head in nodeHead"
                        :label="head.name"
                        :key="head.enName"
                        show-overflow-tooltip
                        align="center"
                        :width='head.width'>
                        <template slot-scope="scope">
                            <template>
                                <div v-if="head.enName === 'nodeState'" class="node-status-wrapper">
                                    <div
                                        class="node-status-circle"
                                        :style="{'backgroundColor': nodeStatusColor(scope.row[head.enName])}">
                                    </div>
                                    <div
                                        :style="{'color': nodeStatusColor(scope.row[head.enName])}">
                                        {{nodeStatusLabel(scope.row[head.enName])}}
                                    </div>
                                </div>
                                <div v-else>{{scope.row[head.enName]}}</div>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="min-width: 540px; margin: 8px 8px 0 9px; padding-bottom: 20px;">
                <el-row :gutter="16">
                    <el-col :xs='24' :sm="24" :md="12" :lg="12" :xl="12">
                        <div class="overview-wrapper">
                            <p>
                                <span class="overview-title">
                                    {{this.$t("home.block")}}
                                </span>
                                <span
                                    class="overview-more"
                                    @click="goRouter('blocks')">
                                    {{this.$t("home.more")}}
                                </span>
                            </p>
                            <div class="overview-item-base" v-loading="loadingBlock">
                                <div
                                    class="block-item"
                                    v-for="item in blockData"
                                    :key='item.id'
                                    @click="blockInfo(item)">
                                    <div class="block-amount">
                                        <span class="node-ip">
                                            <span>{{$t("home.blockHeight")}}</span> {{item.blockHeight}}
                                        </span>
                                        <span class="color-8798AD">{{getDate(Number(item.timestamp) * 1000)}}</span>
                                    </div>
                                    <div>
                                        <div class="text-right">
                                            <span class="block-trans">
                                                <span>{{$t("block.blockIden")}}</span>
                                                <span>{{item.proposerId}}</span>
                                            </span>
                                        </div>
                                        <div class="text-right">
                                            <span class="block-trans">
                                                <span>{{$t('block.transactionNum')}}</span>
                                                <span>{{item.txCount}}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs='24' :sm="24" :md="12" :lg="12" :xl="12">
                        <div class="overview-wrapper">
                            <p>
                                <span class="overview-title">
                                    {{this.$t("home.transaction")}}
                                </span>
                                <span
                                    class="overview-more"
                                    @click="goRouter('transactions')">
                                    {{this.$t("home.more")}}
                                </span>
                            </p>
                            <div class="overview-item-base" v-loading="loadingTransaction">
                                <div
                                    class="block-item"
                                    v-for="item in transactionList"
                                    :key='item.id'
                                    @click="transactionInfo(item)">
                                    <div class="block-amount">
                                        <span class="node-ip">
                                            <span>{{$t("transaction.creator")}}</span> {{item.sender}}
                                        </span>
                                        <span class="color-8798AD">{{getDate(Number(item.timestamp) * 1000)}}</span>
                                    </div>
                                    <div>
                                        <div class="text-right">
                                            <span class="block-trans">
                                                <span>{{$t("transaction.type")}}</span>
                                                <span>{{item.txType}}</span>
                                            </span>
                                        </div>
                                        <div class="text-right">
                                            <span class="block-trans">
                                                <span>{{$t('transaction.blockHeight')}}</span>
                                                <span>{{item.blockHeight}}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import Bus from '@/bus';
import contentHead from '@/components/contentHead';
import charts from './components/chart';
import {
    getNetworkStatistics,
    getChartData,
    getNodeList,
    getBlockList,
    getTransactionList
} from '@/util/api';
import { getDate } from '@/util/util';
import router from '@/router';
export default {
    name: 'home',
    components: {
        'v-content-head': contentHead,
        'v-chart': charts
    },
    computed: {
        detailsList() {
            let data = [{
                label: this.$t('home.nodes'),
                name: 'nodeCount',
                value: 0,
                icon: '#ext-icon-node1',
                bg: 'node-bg'
            }, {
                label: this.$t('home.contracts'),
                name: 'contractCount',
                value: 0,
                icon: '#ext-icon-contract',
                bg: 'contract-bg'
            }, {
                label: this.$t('home.blocks'),
                name: 'latestBlock',
                value: 0,
                icon: '#ext-icon-transation',
                bg: 'transation-bg'
            }, {
                label: this.$t('home.transactions'),
                name: 'transactionCount',
                value: 0,
                icon: '#ext-icon-block',
                bg: 'block-bg'
            }];
            return data;
        },
        nodeHead() {
            let data = [{
                enName: 'nodeName',
                name: this.$t('chainNode.nodeName')
            }, {
                enName: 'orgName',
                name: this.$t('chainNode.nodeOrg')
            }, {
                enName: 'chainName',
                name: this.$t('chainNode.chainName')
            }, {
                enName: 'nodeAddress',
                name: this.$t('chainNode.nodeAddr')
            }, {
                enName: 'nodePort',
                name: this.$t('chainNode.nodePort')
            }, {
                enName: 'nodeType',
                name: this.$t('chainNode.nodeType')
            }, {
                enName: 'nodeState',
                name: this.$t('chainNode.nodeStatus')
            }];
            return data;
        }
    },
    data: function () {
        return {
            loadingNumber: false,
            loadingCharts: false,
            loadingNodes: false,
            loadingBlock: false,
            loadingTransaction: false,
            networkDetails: null,
            chartStatistics: {
                show: false,
                date: [],
                data: [],
                chartSize: {
                    width: 0,
                    height: 0
                }
            },
            nodeData: [],
            blockData: [],
            transactionList: []
        };
    },
    mounted() {
    },
    destroyed() {
    },
    methods: {
        getDate,
        // 获取基本统计指标数据
        getNetworkDetails() {
            this.loadingNumber = true;
            getNetworkStatistics().then(res => {
                this.loadingNumber = false;
                if (res.data.code === 0) {
                    let detail = res.data.data;
                    this.detailsList[0].value = detail.nodeNum || 0;
                    this.detailsList[1].value = detail.contractNum || 0;
                    this.detailsList[2].value = detail.blockNum || 0;
                    this.detailsList[3].value = detail.transactionNum || 0;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 获取关键监控指标数据
        getChart() {
            this.loadingCharts = true;
            this.chartStatistics.show = false;
            this.chartStatistics.time = [];
            this.chartStatistics.data = [];
            getChartData().then(res => {
                this.loadingCharts = false;
                if (res.data.code === 0) {
                    let resData = res.data.data;
                    this.chartStatistics.time = resData.time;
                    this.chartStatistics.data = resData.series;
                    this.$set(this.chartStatistics, 'show', true);
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 获取节点列表数据
        getNodeTable() {
            this.loadingNodes = true;
            getNodeList().then(res => {
                this.loadingNodes = false;
                if (res.data.code === 0) {
                    this.nodeData = res.data.data;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 获取区块列表数据
        getBlockList() {
            this.loadingBlock = true;
            getBlockList().then(res => {
                this.loadingBlock = false;
                if (res.data.code === 0) {
                    this.blockData = res.data.data;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 获取交易列表数据
        getTransaction() {
            this.loadingTransaction = true;
            getTransactionList().then(res => {
                this.loadingTransaction = false;
                if (res.data.code === 0) {
                    this.transactionList = res.data.data;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 详情指标点击跳转
        goDetailRouter(item) {
            let name = item.name;
            switch (name) {
                case 'latestBlock':
                    router.push({path: '/blockchain4AppMgmt'});
                    Bus.$emit('routing', '/blockchain4AppMgmt');
                    break;
                case 'transactionCount':
                    router.push({path: '/blockchain4AppMgmt'});
                    Bus.$emit('routing', '/blockchain4AppMgmt');
                    break;
                case 'nodeCount':
                    router.push({path: '/chainOrgMgmt'});
                    Bus.$emit('routing', '/chainOrgMgmt');
                    break;
                case 'contractCount':
                    router.push({path: '/blockchain4AppMgmt'});
                    Bus.$emit('routing', '/blockchain4AppMgmt');
                    break;
            }
        },
        // 节点状态颜色
        nodeStatusColor(val) {
            return {
                '1': '#67C23A',
                '0': '#909399'
            }[val] || '#909399';
        },
        // 节点状态文字
        nodeStatusLabel(val) {
            return {
                '1': this.$t('chainNode.running'),
                '0': this.$t('chainNode.notRun')
            }[val] || this.$t('chainNode.notRun');
        },
        // 点击查看更多跳转
        goRouter(val) {
            switch (val) {
                case 'blocks':
                    router.push({path: '/blockchain4AppMgmt'});
                    Bus.$emit('routing', '/blockchain4AppMgmt');
                    break;
                case 'transactions':
                    router.push({path: '/blockchain4AppMgmt'});
                    Bus.$emit('routing', '/blockchain4AppMgmt');
                    break;
            }
        },
        // 查看区块详情
        blockInfo(item) {
            this.$router.push('/blockDetail/0/0/' + item.id + '/home');
        },
        // 查看交易详情
        transactionInfo(item) {
            this.$router.push('/transactionDetail/0/0/' + item.id + '/home');
        }
    }
};
</script>
<style scoped>
.node-bg {
    background-color: #73baf6;
}
.contract-bg {
    background-color: #6CC8E6;
}
.block-bg {
    background-color: #ECAC7B;
}
.transation-bg {
    background-color: #8AAEFD;
}
.over-view-wrapper {
    background: #f7f7f7;
}
.amount-wrapper {
    margin: 30px 30px 0 31px;
}
.font-12 {
    font-size: 12px;
    color: #9da2ab;
}
.part1-content {
    display: flex;
    background: #f7f7f7;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
}
.split-line {
    margin-left: 22px;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-right: 20px;
    opacity: 0.25;
}
.overview-number {
    margin-top: 20px;
    margin-left: 20px;
    padding: 20px;
}
.part1-content-amount {
    overflow: auto;
    min-width: 112px;
}
.part2-title {
    padding: 12px 31px 0 32px;
    border-bottom: 1px solid #f2f2f2;
}
.part2-title::after {
    display: block;
    content: "";
    clear: both;
}
.part2-title-left {
    float: left;
    font-size: 15px;
    color: #2e384d;
    padding-bottom: 12px;
    border-bottom: 2px solid #2e384d;
}
.part2-title-right {
    float: right;
    font-size: 12px;
    color: #727476;
    padding: 2px 12px;
    border-radius: 20px;
    background: #f6f6f6;
}
.part3-title {
    padding: 40px 60px 40px 40px;
}
.part3-title::after {
    display: block;
    content: "";
    clear: both;
}
.more-content {
    font-size: 14px;
    color: #409eff;
    cursor: pointer;
}
.part3-table-content {
    width: 100%;
    padding: 0 39px 48px 40px;
    font-size: 12px;
}
.part3-table-content >>> th,
.part3-table-content >>> td {
    padding: 8px 0;
}
.part1-details-bottom {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
}
.part1-details-arrow-right {
    position: relative;
    top: 4px;
}
.module-wrapper-small {
    padding: 0;
}
.search-table-content {
    width: 100%;
}
.search-table-content >>> th {
    color: #2e384d;
}
.search-table-content >>> th,
.search-table-content >>> td {
    font-size: 12px;
}
.node-status-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.node-status-circle {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    margin-top: 1px;
    margin-right: 4px;
}
.overview-wrapper {
    background: #fff;
    font-size: 12px;
    box-shadow: 0 4px 12px 0 #dfe2e9;
    border-radius: 2px;
}
.overview-wrapper > p {
    padding: 12px 18px 0px 22px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;
}
.overview-title {
    font-size: 15px;
    color: #2e384d;
    padding-bottom: 12px;
    border-bottom: 2px solid #2e384d;
}
.overview-more {
    font-size: 13px;
    color: #409eff;
    cursor: pointer;
}
.block-item {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    padding: 12px;
    color: #2e384d;
    border-bottom: 1px solid #f2f2f2;
    cursor: pointer;
}
.block-item:hover {
    background-color: #f5f7fa;
}
.block-item:last-child {
    border-bottom: 0;
}
.block-amount {
    display: flex;
    flex-flow: column;
}
.overview-item-base {
    padding: 18px 18px 18px 22px;
}
.block-miner {
    display: flex;
    flex-flow: row wrap;
}
.block-miner > p {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 10px;
}
.trans-hash {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.node-ip {
    color: #409eff;
    font-weight: bold;
}
.block-trans {
    display: inline-block;
    padding: 0 2px;
    color: #8798AD;
}
.trans-address span {
    display: inline-block;
    max-width: 150px;
}
.trans-address img {
    vertical-align: middle;
}
.overview-item {
    display: inline-block;
    width: calc(49% - 15px);
    max-width: 300px;
    height: 120px;
    padding: 28px 16px;
    margin: 8px 15px 16px 0;
    box-shadow: 0 4px 12px 0 #dfe2e9;
    border-radius: 2px;
    box-sizing: border-box;
    cursor: pointer;
}
.overview-item-img {
    display: inline-block;
    width: 50px;
}
.overview-item-content {
    font-size: 12px;
    display: inline-block;
    padding-left: 10px;
    width: calc(100% - 60px);
}
.overview-item-number {
    font-size: 24px;
    color: #fff;
}
.overview-item-title {
    width: 100%;
    color: #fff;
    min-width: 113px;
}
.overview-item-svg {
    width: 50px;
    height: 50px;
}
.color-8798AD {
    color: #8798AD
}
.text-right {
    text-align: right;
}
.bg-fff {
    background-color: #fff;
}
@media screen and (max-width: 1142px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 15px);
        max-width: 300px;
        height: 120px;
        padding: 28px 12px;
        margin: 8px 15px 16px 0;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 40px;
    }
    .overview-item-svg {
        width: 40px;
        height: 40px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 5px;
        width: calc(100% - 45px);
    }
}
@media screen and (max-width: 1042px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 15px);
        max-width: 300px;
        height: 120px;
        padding: 28px 6px;
        margin: 8px 15px 16px 0;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 35px;
    }
    .overview-item-svg {
        width: 35px;
        height: 35px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 5px;
        width: calc(100% - 40px);
    }
}
@media screen and (max-width: 991px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 8px);
        max-width: 385px;
        height: 120px;
        padding: 28px 16px;
        margin: 8px 15px 16px 0;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 50px;
    }
    .overview-item-svg {
        width: 50px;
        height: 50px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 10px;
        width: calc(100% - 60px);
    }
    .overview-item:nth-child(2) {
        margin: 8px 15px 16px 0;
    }
}
</style>