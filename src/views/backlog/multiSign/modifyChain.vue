<template>
    <div class="modify-chain-multi-sign-wrapper">
        <div class="diff-wrapper">
            <div class="diff-column col-param-label">
                <div class="diff-row header" style="justify-content: flex-end">
                    {{$t('blockchain4App.attribute')}}
                </div>
                <template v-for="attrLabel in chainAttributes">
                    <div class="diff-row">
                        {{attrLabel}}
                    </div>
                </template>
            </div>
            <div class="diff-column">
                <div class="diff-row header">
                    {{$t('backlog.beforeModify')}}
                </div>
                <template v-for="(value, attr) in beforeChain">
                    <div class="diff-row">
                        <div class="diff-item">{{beforeChain[attr]}}</div>
                    </div>
                </template>
            </div>
            <div class="diff-column">
                <div class="diff-row header">
                    {{$t('backlog.afterModify')}}
                </div>
                <template v-for="(value, attr) in afterChain">
                    <div class="diff-row">
                        <div :class="['diff-item', alterMark[attr]]">{{afterChain[attr]}}</div>
                    </div>
                </template>
            </div>
        </div>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.close')}}</el-button>
            <el-button
                type="danger"
                @click="handleVote(2)"
                :loading="loading"
                v-if="dialogOptions.status == 0">
                {{this.$t('backlog.refuse')}}
            </el-button>
            <el-button
                type="primary"
                @click="handleVote(1)"
                :loading="loading"
                v-if="dialogOptions.status == 0">
                {{this.$t('backlog.agree')}}
            </el-button>
        </div>
    </div>
</template>

<script>
import { getBacklogDetail4ModifyChain } from '@/util/api';
import mixins from './mixins.js';
export default {
    name: 'modifyChainDialog',
    props: {
        dialogOptions: { type: Object }
    },
    mixins: [ mixins ],
    data() {
        return {
            loading: false,
            chainAttributes: [
                this.$t('blockchain4App.blockMaxCapacity') + '[' +
                    this.$t('blockchain4App.blockMaxCapacityUnit') + ']',
                this.$t('blockchain4App.overdue') + '[' +
                    this.$t('blockchain4App.overdueUnit') + ']',
                this.$t('blockchain4App.outInterval') + '[' +
                    this.$t('blockchain4App.outIntervalUnit') + ']'
            ],
            // 编辑前的链属性
            beforeChain: {},
            // 编辑后的链属性
            afterChain: {},
            // 编辑后被变更的属性
            alterMark: {}
        };
    },
    mounted() {
        this.fetchInitData();
    },
    methods: {
        modelClose() {
            this.$emit('close', '1');
        },
        // 获取页面初始化数据
        fetchInitData() {
            getBacklogDetail4ModifyChain({id: this.dialogOptions.id}).then(res => {
                if (res.data.code === 0) {
                    let resData = res.data.data || {};
                    this.beforeChain = {
                        blockTxCapacity: resData.blockTxCapacityOld,
                        txTimeout: resData.txTimeoutOld,
                        blockInterval: resData.blockIntervalOld
                    };
                    this.afterChain = {
                        blockTxCapacity: resData.blockTxCapacity,
                        txTimeout: resData.txTimeout,
                        blockInterval: resData.blockInterval
                    };
                    this.alterMark = {
                        blockTxCapacity: resData.blockTxCapacity != resData.blockTxCapacityOld
                            ? 'attr-changed' : 'attr-unchange',
                        txTimeout: resData.txTimeout != resData.txTimeoutOld
                            ? 'attr-changed' : 'attr-unchange',
                        blockInterval: resData.blockInterval != resData.blockIntervalOld
                            ? 'attr-changed' : 'attr-unchange'
                    };
                    this.setParams(resData.id, resData.notificationId);
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
        }
    }
}
</script>

<style scoped>
.diff-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
}
.diff-wrapper .diff-column {
    font-size: 12px;
}
.diff-wrapper .diff-column .diff-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 36px;
    margin-bottom: 26px;
    user-select: none;
}
.col-param-label .diff-row {
    justify-content: flex-end;
}
.diff-wrapper .diff-column .header {
    justify-content: center;
    color: #409eff;
}
.diff-wrapper .diff-column .diff-row .diff-item {
    width: 160px;
    height: 36px;
    line-height: 34px;
    -webkit-appearance: none;
    border: 1px solid #409eff;
    border-radius: 4px;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    outline: 0;
    padding: 0 15px;
    box-sizing: border-box;
    background-color: #FFF;
    background-image: none;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    user-select: none;
}
.attr-changed {
    color: #f56c6c!important;
    border-color: #f56c6c!important;
}
.attr-unchange {
    border-color: #409eff!important;
}
.dialog-footer {
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
    width: 100%;
}
</style>
