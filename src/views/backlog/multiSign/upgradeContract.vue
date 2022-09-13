<template>
    <div class="upgrade-contract-multi-sign-wrapper">
        <div class="diff-wrapper">
            <div class="diff-column col-param-label">
                <div class="diff-row header" style="justify-content: flex-end">
                    {{$t('contracts.attribute')}}
                </div>
                <template v-for="attrLabel in contractAttributes">
                    <div class="diff-row">
                        {{attrLabel}}
                    </div>
                </template>
            </div>
            <div class="diff-column">
                <div class="diff-row header">
                    {{$t('backlog.beforeUpgrade')}}
                </div>
                <template v-for="(value, attr) in beforeContract">
                    <div class="diff-row">
                        <div class="diff-item">{{beforeContract[attr]}}</div>
                    </div>
                </template>
            </div>
            <div class="diff-column">
                <div class="diff-row header">
                    {{$t('backlog.afterUpgrade')}}
                </div>
                <template v-for="(value, attr) in afterContract">
                    <div class="diff-row">
                        <div :class="['diff-item', alterMark[attr]]">{{afterContract[attr]}}</div>
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
import { getBacklogDetail4UpgradeContract } from '@/util/api';
import mixins from './mixins.js';
export default {
    name: 'upgradeContractDialog',
    props: {
        dialogOptions: { type: Object }
    },
    mixins: [ mixins ],
    data() {
        return {
            loading: false,
            contractAttributes: [
                this.$t('table.contractName'),
                this.$t('table.contractVersion'),
                this.$t('table.templateName'),
                this.$t('contracts.contractTemplateVersion')
            ],
            // 编辑前的合约属性
            beforeContract: {},
            // 编辑后的合约属性
            afterContract: {},
            // 升级后被变更的属性
            alterMark: {}
        };
    },
    mounted() {
        this.fetchInitData();
    },
    methods: {
        modelClose() {
            this.$emit('close', '4');
        },
        // 获取页面初始化数据
        fetchInitData() {
            getBacklogDetail4UpgradeContract({id: this.dialogOptions.id}).then(res => {
                if (res.data.code === 0) {
                    let resData = res.data.data || {};
                    this.beforeContract = {
                        contractName: resData.contractNameOld,
                        contractVersion: resData.contractVersionOld,
                        templateSource: resData.templateNameOld,
                        templateVersion: resData.templateVersionOld
                    };
                    this.afterContract = {
                        contractName: resData.contractName,
                        contractVersion: resData.contractVersion,
                        templateSource: resData.templateName,
                        templateVersion: resData.templateVersion
                    };
                    this.alterMark = {
                        contractName: resData.contractName != resData.contractNameOld
                            ? 'attr-changed' : 'attr-unchange',
                        contractVersion: resData.contractVersion != resData.contractVersionOld
                            ? 'attr-changed' : 'attr-unchange',
                        templateSource: resData.templateName != resData.templateNameOld
                            ? 'attr-changed' : 'attr-unchange',
                        // 模板不同,版本号必然是变化的;模板相同,版本号不同是变化
                        templateVersion: resData.templateName == resData.templateNameOld &&
                            resData.templateVersion != resData.templateVersionOld
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
