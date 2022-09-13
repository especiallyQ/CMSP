<template>
    <div class="backlog-wrapper">
        <content-head :headTitle="$t('title.backlog')"></content-head>
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-left">
                    <el-form
                        ref="searchForm"
                        :model="searchFormData"
                        :inline="true"
                        label-width="40px"
                        class="search-form">
                        <el-form-item
                            :label="$t('backlog.type')">
                            <el-select
                                style="width: 160px"
                                v-model="searchFormData.type"
                                @change="handleBacklogTypeChange">
                                <el-option
                                    v-for="item in backlogType"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            :label="$t('backlog.operate')">
                            <el-select
                                style="width: 160px"
                                :disabled="operateSelDisabled"
                                v-model="searchFormData.operate">
                                <el-option
                                    v-for="item in backlogOperate"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            :label="$t('backlog.status')">
                            <el-select
                                style="width: 160px"
                                :disabled="statusSelDisabled"
                                v-model="searchFormData.status">
                                <el-option
                                    v-for="item in backlogStatus"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                size="small"
                                @click="handleSearch"
                                :loading="loading">
                                {{$t('text.search')}}
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="search-part-right"></div>
            </div>
            <div class="search-table">
                <el-table :data="backlogList" tooltip-effect="light" v-loading="loading">
                    <el-table-column
                        v-for="head in tableHeader"
                        :label="head.name"
                        :key="head.enName"
                        show-overflow-tooltip
                        :align="head.enName === 'content' ? 'left' : 'center'"
                        :min-width="head.width">
                        <template slot-scope="scope">
                            <template v-if="head.enName !== 'operate'">
                                <div v-if="head.enName === 'statusName'">
                                    <div :style="{'color': statusColor(scope.row.status),
                                        'fontWeight': 'bold',
                                        'cursor': isClick(scope.row.status)}"
                                        @click="handleStatus(scope.row)">
                                        {{ scope.row[head.enName] }}
                                    </div>
                                </div>
                                <div v-else-if="head.enName === 'operateTypeName'">
                                    {{ scope.row.type == 1 ? $t('backlog.optTypeDownload') : scope.row[head.enName] }}
                                </div>
                                <div v-else>{{ scope.row[head.enName] }}</div>
                            </template>
                            <template v-else>
                                <template v-if="scope.row.type == 0">
                                    <el-button
                                        type="text"
                                        size="small"
                                        v-if="scope.row.isChainIdentity && scope.row.status == 1"
                                        @click="handleCancel(scope.row)"
                                        style="color:#ed5454">
                                        {{$t('backlog.cancel')}}
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="small"
                                        v-if="scope.row.type == 0"
                                        @click="viewDetail(scope.row)">
                                        {{$t('text.viewDetail')}}
                                    </el-button>
                                </template>
                                <template v-if="scope.row.type == 1">
                                    <el-button
                                        type="text"
                                        size="small"
                                        v-if="scope.row.isChainIdentity && accountType === 'PU_Admin'"
                                        @click="handleDownload(scope.row)">
                                        {{$t('backlog.download')}}
                                    </el-button>
                                </template>
                                <template v-if="scope.row.type == 2">
                                    <el-button
                                        type="text"
                                        size="small"
                                        v-if="accountType === 'PU_Admin'"
                                        @click="makeChainViewDetail(scope.row)">
                                        {{$t('text.viewDetail')}}
                                    </el-button>
                                </template>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="page"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            :visible.sync="logViewerVisible"
            :title="$t('systemLog.title')"
            width="960px"
            :append-to-body="true"
            :center="true"
            class="dialog-wrapper"
            v-if="logViewerVisible">
            <log-viewer :log="logData" @close="close"></log-viewer>
        </el-dialog>
        <el-dialog
            :visible.sync="modifyChainDialogVisible"
            :title="$t('blockchain4App.modify')"
            width="600px"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            v-if="modifyChainDialogVisible">
            <modify-chain-dialog
                :dialogOptions="dialogOptions"
                @success="success"
                @close="close">
            </modify-chain-dialog>
        </el-dialog>
        <el-dialog
            :visible.sync="deployContractDialogVisible"
            :title="$t('table.contractDeploy')"
            width="500px"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            v-if="deployContractDialogVisible">
            <deploy-contract-dialog
                :dialogOptions="dialogOptions"
                @success="success"
                @close="close">
            </deploy-contract-dialog>
        </el-dialog>
        <el-dialog
            :visible.sync="revokeContractDialogVisible"
            :title="$t('table.contractRevokeTitle')"
            width="500px"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            v-if="revokeContractDialogVisible">
            <revoke-contract-dialog
                :dialogOptions="dialogOptions"
                @success="success"
                @close="close">
            </revoke-contract-dialog>
        </el-dialog>
        <el-dialog
            :visible.sync="upgradeContractDialogVisible"
            :title="$t('table.contractUpgradeTitle')"
            width="600px"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            v-if="upgradeContractDialogVisible">
            <upgrade-contract-dialog
                :dialogOptions="dialogOptions"
                @success="success"
                @close="close">
            </upgrade-contract-dialog>
        </el-dialog>
        <el-dialog
            :visible.sync="joinInChainOrgDialogVisible"
            :title="$t('chainOrg.joinInOrgText')"
            width="500px"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            v-if="joinInChainOrgDialogVisible">
            <join-in-org-dialog
                :dialogOptions="dialogOptions"
                @success="success"
                @close="close">
            </join-in-org-dialog>
        </el-dialog>
        <el-dialog
            :visible.sync="joinInChainNodeDialogVisible"
            :title="$t('chainNode.nodeJoinInText')"
            width="500px"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            v-if="joinInChainNodeDialogVisible">
            <join-in-node-dialog
                :dialogOptions="dialogOptions"
                @success="success"
                @close="close">
            </join-in-node-dialog>
        </el-dialog>
        <el-dialog
            :visible.sync="unJoinInChainNodeDialogVisible"
            :title="$t('chainNode.nodeUnJoinInText')"
            width="500px"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            v-if="unJoinInChainNodeDialogVisible">
            <join-in-node-dialog
                :dialogOptions="dialogOptions"
                @success="success"
                @close="close">
            </join-in-node-dialog>
        </el-dialog>
        <el-dialog
            :visible.sync="makeChainDialogVisible"
            :title="$t('blockchain4App.make')"
            width="500px"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            v-if="makeChainDialogVisible">
            <make-chain-dialog
                :dialogOptions="dialogOptions"
                @success="success"
                @close="closeMakeChainView">
            </make-chain-dialog>
        </el-dialog>
        <el-dialog
            :visible.sync="removeChainDialogVisible"
            :title="$t('blockchain4App.delete')"
            width="500px"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            v-if="removeChainDialogVisible">
            <remove-chain-dialog
                :dialogOptions="dialogOptions"
                @success="success"
                @close="close">
            </remove-chain-dialog>
        </el-dialog>
    </div>
</template>

<script>
import Bus from '@/bus';
import {
    getBacklogType,
    getBacklogOperateType,
    getBacklogStatus,
    getBacklogList,
    cancelMultiSignature
} from '@/util/api';
import { downloadNodePackageByNotification } from './components/nodepkg.js';
import contentHead from '@/components/contentHead';
import logViewer from './components/logViewer';
import modifyChainDialog from './multiSign/modifyChain';
import deployContractDialog from './multiSign/deployContract';
import revokeContractDialog from './multiSign/revokeContract';
import upgradeContractDialog from './multiSign/upgradeContract';
import joinInNodeDialog from './multiSign/joinInNode';
import joinInOrgDialog from './multiSign/joinInOrg';
import makeChainDialog from './multiSign/makeChain';
import removeChainDialog from './multiSign/removeChain';

export default {
    name: 'Backlog',
    components: {
        contentHead,
        logViewer,
        modifyChainDialog,
        deployContractDialog,
        revokeContractDialog,
        upgradeContractDialog,
        joinInNodeDialog,
        joinInOrgDialog,
        makeChainDialog,
        removeChainDialog
    },
    data() {
        return {
            // 登录账号为哪些组织的管理员
            userChainOrg: (localStorage.getItem('chainOrg') || '').split(','),
            accountType: localStorage.getItem('root'),
            loading: false,
            currentPage: 1, // 分页-当前页码
            pageSize: 10, // 分页-每页数据条目数
            total: 0, // 分页-数据条目总数
            backlogList: [], // 任务列表
            // 任务列表列定义
            tableHeader: [{
                enName: 'operateTypeName',
                name: this.$t('backlog.type'),
                width: 100
            }, {
                enName: 'statusName',
                name: this.$t('backlog.status'),
                width: 100
            }, {
                enName: 'content',
                name: this.$t('backlog.content'),
                width: 200
            }, {
                enName: 'modifyTime',
                name: this.$t('backlog.timestamp'),
                width: 100
            }, {
                enName: 'operate',
                name: this.$t('text.operation'),
                width: 160
            }],
            // 过滤条件表单
            searchFormData: {
                type: '',
                operate: '',
                status: ''
            },
            // 待办操作方式列表可用性
            operateSelDisabled: true,
            // 任务状态列表可用性
            statusSelDisabled: true,
            // 待办类型字典
            backlogType: [],
            // 待办操作方式字典
            backlogOperate: [],
            // 任务状态字典
            backlogStatus: [],
            // 任务对话框参数
            dialogOptions: {},
            // 编辑应用链多签任务对话框可见性
            modifyChainDialogVisible: false,
            // 部署合约多签任务对话框可见性
            deployContractDialogVisible: false,
            // 吊销合约多签任务对话框可见性
            revokeContractDialogVisible: false,
            // 升级合约多签任务对话框可见性
            upgradeContractDialogVisible: false,
            // 接入组织任务对话框可见想
            joinInChainOrgDialogVisible: false,
            // 接入节点任务对话框可见性
            joinInChainNodeDialogVisible: false,
            // 移除节点任务对话框可见性
            unJoinInChainNodeDialogVisible: false,
            // 创建应用链任务对话框可见性
            makeChainDialogVisible: false,
            // 删除应用链任务对话框可见性
            removeChainDialogVisible: false,
            // 日志数据
            logData: '',
            // 日志对话框可见性
            logViewerVisible: false
        }
    },
    computed: {
    },
    mounted() {
        this.fetchBacklogType();
        this.fetchBacklogList();
    },
    methods: {
        // 获取类型字典
        fetchBacklogType() {
            getBacklogType().then(res => {
                if (res.data.code === 0) {
                    let resData = [];
                    resData.push({
                        value: 'all',
                        name: this.$t('text.all')
                    });
                    (res.data.data || []).forEach(item => {
                        resData.push({
                            value: item.value + '',
                            name: item.name
                        });
                    });
                    this.backlogType = resData;
                    this.searchFormData.type = 'all';
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 获取操作方式字典
        fetchBacklogOperateType() {
            let reqData = { type: parseInt(this.searchFormData.type) };
            getBacklogOperateType(reqData).then(res => {
                if (res.data.code === 0) {
                    let resData = [];
                    resData.push({
                        value: 'all',
                        name: this.$t('text.all')
                    });
                    (res.data.data || []).forEach(item => {
                        resData.push({
                            value: item.value + '',
                            name: item.name
                        });
                    });
                    this.backlogOperate = resData;
                    this.searchFormData.operate = 'all';
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 获取任务状态字典
        fetchBacklogStatus() {
            let reqData = { type: parseInt(this.searchFormData.type) };
            getBacklogStatus(reqData).then(res => {
                if (res.data.code === 0) {
                    let resData = [];
                    resData.push({
                        value: 'all',
                        name: this.$t('text.all')
                    });
                    (res.data.data || []).forEach(item => {
                        resData.push({
                            value: item.value + '',
                            name: item.name
                        });
                    });
                    this.backlogStatus = resData;
                    this.searchFormData.status = 'all';
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 获取任务列表数据
        fetchBacklogList() {
            this.loading = true;
            let reqData = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            };
            let query = {};
            if (!!this.searchFormData.type && this.searchFormData.type !== 'all') {
                query.type = parseInt(this.searchFormData.type);
            }
            if (!!this.searchFormData.operate && this.searchFormData.operate !== 'all') {
                query.operateType = parseInt(this.searchFormData.operate);
            }
            if (!!this.searchFormData.status && this.searchFormData.status !== 'all') {
                query.status = parseInt(this.searchFormData.status);
            }
            getBacklogList(reqData, query).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let _backlogList = res.data.data || [];
                    _backlogList.forEach(row => { // 登录用户所属组织与当前任务发起组织相同时,可以取消任务
                        row.isChainIdentity = this.userChainOrg.indexOf(String(row.orgId)) !== -1;
                    });
                    this.backlogList = _backlogList;
                    this.total = res.data.totalCount;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 取消任务事件
        handleCancel(row) {
            this.$confirm(this.$t('backlog.confirmCancel'), {
                center: true
            }).then(() => {
                this.cancelTask(row);
            }).catch(() => {});
        },
        // 取消任务
        cancelTask(row) {
            let params = {
                notificationId: row.id,
                actionType: 0
            };
            cancelMultiSignature(params).then(res => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('backlog.cancelSuccess')
                    });
                    Bus.$emit('refreshBacklog');
                    this.fetchBacklogList();
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
        // 查看详情
        viewDetail(row) {
            switch (String(row.operateType)) {
                case '0': // 编辑应用链
                    this.viewModifyChainDetail(row);
                    break;
                case '1': // 部署合约
                    this.viewDeployContractDetail(row);
                    break;
                case '2': // 升级合约
                    this.viewUpgradeContractDetail(row);
                    break;
                case '3': // 吊销合约
                    this.viewRevokeContractDetail(row);
                    break;
                case '4': // 删除应用链
                    this.viewRemoveChainDetail(row);
                    break;
                case '10': // 组织接入
                    this.viewJoinInChainOrgDetail(row);
                    break;
                case '11': // 节点接入
                    this.viewJoinInChainNodeDetail(row);
                    break;
                case '12': // 节点移除
                    this.viewUnJoinInChainNodeDetail(row);
                    break;
            }
        },
        // 节点安装包下载
        handleDownload(row) {
            this.loading = true;
            downloadNodePackageByNotification.call(this, row.id).then(() => {
                this.loading = false;
                this.$nextTick(() => {
                    this.fetchBacklogList();
                    Bus.$emit('refreshBacklog');
                });
            }).catch(() => {
                this.loading = false;
            });
        },
        //  创建应用链
        makeChainViewDetail(row) {
            this.dialogOptions = row;
            this.makeChainDialogVisible = true;
        },
        // 关闭创建应用连窗口
        closeMakeChainView() {
            this.makeChainDialogVisible = false;
        },
        // 编辑应用链任务查看详情
        viewModifyChainDetail(row) {
            this.dialogOptions = row;
            this.modifyChainDialogVisible = true;
        },
        // 部署合约任务查看详情
        viewDeployContractDetail(row) {
            this.dialogOptions = row;
            this.deployContractDialogVisible = true;
        },
        // 吊销合约任务查看详情
        viewRevokeContractDetail(row) {
            this.dialogOptions = row;
            this.revokeContractDialogVisible = true;
        },
        // 升级合约任务查看详情
        viewUpgradeContractDetail(row) {
            this.dialogOptions = row;
            this.upgradeContractDialogVisible = true;
        },
        //接入组织任务查看详情
        viewJoinInChainOrgDetail(row) {
            this.dialogOptions = row;
            this.joinInChainOrgDialogVisible = true;
        },
        // 接入节点任务查看详情
        viewJoinInChainNodeDetail(row) {
            this.dialogOptions = row;
            this.joinInChainNodeDialogVisible = true;
        },
        // 移除节点任务查看详情
        viewUnJoinInChainNodeDetail(row) {
            this.dialogOptions = row;
            this.unJoinInChainNodeDialogVisible = true;
        },
        // 删除应用链任务查看详情
        viewRemoveChainDetail(row) {
            this.dialogOptions = row;
            this.removeChainDialogVisible = true;
        },
        // 类型列表选中项变更事件
        handleBacklogTypeChange() {
            if (this.searchFormData.type === 'all') {
                this.operateSelDisabled = true;
                this.statusSelDisabled = true;
                this.backlogOperate = [];
                this.backlogStatus = [];
                this.searchFormData.operate = '';
                this.searchFormData.status = '';
            } else {
                this.fetchBacklogOperateType();
                this.fetchBacklogStatus();
                this.operateSelDisabled = false;
                this.statusSelDisabled = false;
            }
        },
        // 改变每页数据条目数
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.fetchBacklogList();
        },
        // 改变当前页码
        handleCurrentChange(val) {
            this.currentPage = val;
            this.fetchBacklogList();
        },
        // 成功后的回调
        success() {
            this.fetchBacklogList();
        },
        // 关闭弹出的窗口
        close(val) {
            if (val === '0') {
                this.logViewerVisible = false;
            } else if (val === '1') {
                this.modifyChainDialogVisible = false;
            } else if (val === '2') {
                this.deployContractDialogVisible = false;
            } else if (val === '3') {
                this.revokeContractDialogVisible = false;
            } else if (val === '4') {
                this.upgradeContractDialogVisible = false;
            } else if (val === '5') {
                this.removeChainDialogVisible = false;
            } else if (val === '10') {
                this.joinInChainOrgDialogVisible = false;
            } else if (val === '11') {
                this.joinInChainNodeDialogVisible = false;
            } else if (val === '12') {
                this.unJoinInChainNodeDialogVisible = false;
            }
        },
        // 不同状态的颜色定义
        statusColor(status) {
            return {
                '0': '#909399',
                '1': '#737a86',
                '10': '#e6a23c',
                '11': '#67c23a',
                '12': '#f56c6c',
                '13': '#f56c6c',
                '21': '#67c23a',
                '23': '#67c23a'
            }[String(status)] || '#909399';
        },
        // 不同状态是否可以点击(查看非匿名投票或日志)
        isClick(status) {
            return {
                '12': 'pointer',
                '13': 'pointer'
            }[String(status)] || '';
        },
        // 点击状态列查看其他信息
        handleStatus(row) {
            if (row.status == 12) { // 任务失败
                this.viewFailLog(row.description);
            }
        },
        // 查看失败日志
        viewFailLog(logData) {
            this.logData = logData || '';
            this.logViewerVisible = true;
        },
        // 点击查询事件
        handleSearch() {
            this.currentPage = 1;
            this.fetchBacklogList();
        }
    }
}
</script>

<style scoped>
.module-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
.dialog-wrapper >>> .el-dialog__title {
    font-size: 18px;
    color: #36393d;
    font-weight: bold;
    letter-spacing: 0.5px;
}
.dialog-wrapper >>> .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 0;
}
.dialog-wrapper >>> .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label::before {
    vertical-align: middle;
}
.dialog-wrapper >>> .el-form-item__label {
    font-size: 12px;
    color: #737a86;
}
.dialog-wrapper >>> .el-form-item {
    margin-bottom: 26px;
}
.dialog-wrapper >>> .el-form-item .el-select {
    width: 100%;
}
.dialog-wrapper >>> .el-dialog__footer {
    padding-top: 0;
}
.dialog-wrapper >>> .el-button {
    padding: 10px 20px;
}
.dialog-wrapper >>> .el-input__inner {
    height: 36px;
    line-height: 36px;
}
</style>
