<template>
    <div class="account-wrapper">
        <content-head :headTitle="$t('title.accountManagement')"></content-head>
        <div class="module-wrapper">
            <div class="tree-wrapper">
                <div class="tree-box">
                    <div class="tree-top-row" v-if="toAccountGroupVisable">
                        <el-button
                            type="text"
                            size="small"
                            @click="toAccountGroupMgmt()">
                            {{$t('accountGroup.groupMgmt')}}
                        </el-button>
                    </div>
                    <div class="tree-bottom-row">
                        <el-tree
                            ref="groupTree"
                            :data="groupData"
                            :props="defaultProps"
                            node-key="accountGroupId"
                            :current-node-key="currentNode"
                            :highlight-current="true"
                            :default-expand-all="true"
                            :expand-on-click-node="false"
                            @node-click="handleTreeNodeClick">
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="content-wrapper">
                <div class="search-part">
                    <div class="search-part-left">
                        <el-form
                            ref="searchForm"
                            :inline="true"
                            label-width="70px"
                            class="search-form">
                            <el-form-item :label="$t('account.accountType')">
                                <el-select
                                    v-model="filterData"
                                    style="width: 180px"
                                    @change="handleAccountTypeChange">
                                    <el-option
                                        v-for="item in typeList"
                                        :key="item.roleId"
                                        :label="item.roleName"
                                        :value="item.roleId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input
                                    :placeholder="$t('account.userNameSearch')"
                                    v-model="searchData"
                                    class="input-with-select"
                                    clearable
                                    @clear="clearInput">
                                    <el-button
                                        slot="append"
                                        size="small"
                                        icon="el-icon-search"
                                        @click="search">
                                    </el-button>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="search-part-right">
                        <el-button
                            type="primary"
                            size="small"
                            v-if="createBtnVisable"
                            :disabled="createBtnDisabled"
                            @click="creatAccount">
                            {{$t('account.addAccount')}}
                        </el-button>
                    </div>
                </div>
                <div class="search-table">
                    <el-table
                        ref="accountTable"
                        :data="accountList"
                        row-key="accountId"
                        tooltip-effect="light"
                        v-loading="loading"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            reserve-selection
                            width="50"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            v-for="head in accountHeader"
                            :label="head.name"
                            :key="head.enName"
                            show-overflow-tooltip
                            align="center"
                            :min-width="head.width">
                            <template slot-scope="scope">
                                <template v-if="head.enName !== 'operate'">
                                    <span v-if="head.enName === 'roleId'">
                                        {{translate(scope.row['roleId'])}}
                                    </span>
                                    <span v-else>{{scope.row[head.enName]}}</span>
                                </template>
                                <template v-else>
                                    <el-button
                                        type="text"
                                        size="small"
                                        :disabled="isDeleteAccountDisabled(scope.row)"
                                        @click="deleteAccount(scope.row)"
                                        style="color:#ed5454">
                                        {{$t('text.delete')}}
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="small"
                                        :disabled="role !== 'PO_Admin' && role !== 'PU_Admin'"
                                        @click="modifyAccount(scope.row, 'modify')">
                                        {{$t('text.update')}}
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="small"
                                        :disabled="role !== 'PO_Admin' && role !== 'PU_Admin'"
                                        @click="modifyGroup(scope.row)">
                                        {{$t('account.updateAccountGroup')}}
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="small"
                                        :disabled="isResetPasswordDisabled(scope.row)"
                                        @click="resetPassword(scope.row)">
                                        {{$t('main.resetPassword')}}
                                    </el-button>
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
                    <div class="batch-bar" v-if="isBatchHeaderDisplay">
                        <div class="tip-wrap">
                            <div class="tip-prefix">
                                {{ $t('text.batchTipPrefix') }}
                            </div>
                            <div>{{ selectedAccounts.length }}</div>
                            <div class="tip-suffix">
                                {{ $t('text.batchTipSuffix') }}
                            </div>
                        </div>
                        <el-divider direction="vertical"></el-divider>
                        <div class="btn-wrap">
                            <el-button
                                type="danger"
                                size="small"
                                :disabled="isBatchActionDisabled() || isCheckSelf"
                                @click="handleBatchDeleteAccount">
                                {{$t('account.deleteAccount')}}
                            </el-button>
                            <el-button
                                type="primary"
                                size="small"
                                :disabled="isBatchActionDisabled()"
                                @click="handleBatchUpdateAccountGroup">
                                {{$t('account.updateAccountGroup')}}
                            </el-button>
                            <el-button
                                type="primary"
                                size="small"
                                :disabled="isBatchActionDisabled() || isCheckSelf"
                                @click="handleBatchResetPassword">
                                {{$t('main.resetPassword')}}
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog
                :visible.sync="accountDialogVisible"
                :title="accountDialogTitle"
                width="433px"
                :append-to-body="true"
                :center="true"
                :close-on-click-modal="false"
                class="dialog-wrapper"
                v-if="accountDialogVisible">
                <account-dialog
                    :accountDialogOptions="accountDialogOptions"
                    @success="success"
                    @close="close">
                </account-dialog>
            </el-dialog>
            <el-dialog
                :visible.sync="groupDialogVisible"
                :title="groupDialogTitle"
                width="433px"
                :append-to-body="true"
                :center="true"
                :close-on-click-modal="false"
                class="dialog-wrapper"
                v-if="groupDialogVisible">
                <change-group-dialog
                    :treeNodes="groupDataMini"
                    :accountDialogOptions="accountDialogOptions"
                    :currentNode="currGroupId"
                    @success="success"
                    @close="closeGroup">
                </change-group-dialog>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Bus from '@/bus';
import router from '@/router';
import contentHead from '@/components/contentHead';
import {
    fetchAccountGroupTree,
    fetchAccountGroupMiniTree,
    accountList,
    resetAccountPassword,
    deleteAccountInfo,
    accountTypeList,
    batchResetAccountPassword,
    batchDeleteAccountInfo
} from '@/util/api';
import accountDialog from './components/accountDialog';
import changeGroupDialog from './components/changeGroupDialog';
export default {
    name: 'accountInfo',
    components: {
        contentHead,
        accountDialog,
        changeGroupDialog
    },
    data() {
        return {
            userId: localStorage.getItem('userId'), // 登录账号id
            groupId: localStorage.getItem('groupId'), // 登录账号所属账号群组
            role: localStorage.getItem('root'), // 登录账号的类型(角色)
            loading: false,
            groupData: [], // 账号群组树
            groupDataMini: [], // 简化的账号群组树,用于账号群组变更
            defaultProps: {
                id: 'accountGroupId',
                label: 'accountGroupName',
                children: 'children'
            },
            currentNode: '0', // 当前选中树节点
            currentLevel: '0', // 选中树节点层级
            currentPage: 1,
            pageSize: 10,
            total: 0,
            toAccountGroupVisable: true, // 账号群组路由可见性
            createBtnVisable: true, // 新建按钮可见性
            createBtnDisabled: true, // 新建按钮可用性
            accountDialogVisible: false, // 账号表单对话框可见性
            accountDialogTitle: '', // 账号表单对话框标题
            accountDialogOptions: {}, // 账号表单对话框参数
            groupDialogVisible: false, // 群组变更对话框可见性
            groupDialogTitle: '', // 群组变更对话框标题
            accountList: [], // 账号列表数据
            currGroupId: '0', // 账号群组变更时默认选中的群组
            searchData: '', // 查询条件
            filterData: '', // 过滤条件
            typeList: [], // 账号类型列表
            selectedAccounts: [], // 列表中被选中的账号
            isBatchHeaderDisplay: false, // 批量操作表头层是否显示
            isCheckSelf: false // 批量操作时只选择了1个账号且是自己
        };
    },
    computed: {
        accountHeader() {
            let data = [{
                enName: 'account',
                name: this.$t('account.userName'),
                width: 90
            }, {
                enName: 'accountGroupName',
                name: this.$t('account.group'),
                width: 100
            }, {
                enName: 'email',
                name: this.$t('account.contact'),
                width: 120
            }, {
                enName: 'roleId',
                name: this.$t('account.accountType'),
                width: 120
            }];
            if (this.role === 'PO_Admin' || this.role === 'PU_Admin') {
                data.push({
                    enName: 'operate',
                    name: this.$t('text.operation'),
                    width: 200
                });
            }
            return data;
        }
    },
    mounted() {
        this.initPage();
        this.getAccountGroupTree();
        this.getAccountTypeList();
        this.getAccountList();
    },
    methods: {
        // 页面初始化
        initPage() {
            this.currentNode = '0';
            this.toAccountGroupVisable = this.role === 'PO_Admin' || this.role === 'PU_Admin';
            this.createBtnVisable = this.role === 'PO_Admin' || this.role === 'PU_Admin';
        },
        // 表单提交成功后的回调
        success() {
            this.getAccountList();
            this.$refs.accountTable.clearSelection();
            this.selectedAccounts = [];
        },
        // 关闭弹出的表单窗口
        close(val) {
            this.accountDialogVisible = val;
        },
        // 关闭弹出的群组变更窗口
        closeGroup(val) {
            this.groupDialogVisible = val;
        },
        // 点击树节点事件
        handleTreeNodeClick(data) {
            this.currentNode = data.accountGroupId;
            this.currentLevel = data.level;
            this.currentPage = 1;
            this.getAccountList();
            if ((this.role === 'PU_Admin' || this.role === 'PO_Admin')
                && this.currentNode !== '0') {
                this.createBtnDisabled = false;
            } else {
                this.createBtnDisabled = true;
            }
        },
        // 获取账号群组树
        getAccountGroupTree() {
            this.loading = true;
            fetchAccountGroupTree(0).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let rootChildren = res.data.data || [];
                    this.groupData = [{
                        accountGroupId: '0',
                        accountGroupName: '全部账号群组',
                        description: '',
                        level: '0',
                        children: rootChildren
                    }];
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
        // 获取账号类型列表
        getAccountTypeList() {
            accountTypeList().then(res => {
                if (res.data.code === 0) {
                    this.typeList = [];
                    this.typeList.push({
                        roleId: 'all',
                        roleName: this.$t('text.all')
                    });
                    res.data.data.forEach(item => {
                        let _roleId = item.roleId + '';
                        if ((this.role === 'PU_Admin' || this.role === 'PU_Operator' || this.role === 'AD_Admin') &&
                            (_roleId === '100003' || _roleId === '100004')) {
                            // 不用看到平台运维方管理员和运营人员
                            return true;
                        }
                        this.typeList.push({
                            roleId: _roleId,
                            roleName: {
                                '100003': this.$t('text.poadmin'),
                                '100004': this.$t('text.pooper'),
                                '100005': this.$t('text.puadmin'),
                                '100006': this.$t('text.puoper'),
                                '100007': this.$t('text.adadmin')
                            }[_roleId]
                        });
                    });
                    this.filterData = 'all';
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
        // 获取账号列表
        getAccountList() {
            this.loading = true;
            let reqData = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
                accountGroupId: this.currentNode
            };
            let searchData = {
                account: this.searchData,
                accountType: this.filterData !== 'all' ? this.filterData : ''
            };
            accountList(reqData, searchData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.accountList = res.data.data || [];
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
        handleSizeChange: function (val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getAccountList();
        },
        handleCurrentChange: function (val) {
            this.currentPage = val;
            this.getAccountList();
        },
        // 获取带有完整树路径的节点名
        getNodeLabel(node) {
            return (node && node.parent
                && node.data.accountGroupId !== '0' &&
                node.parent.data.accountGroupId !== '0' ?
                (this.getNodeLabel(node.parent) + '>') : '') +
                node.data.accountGroupName;
        },
        // 新增账号
        creatAccount() {
            if (!this.currentNode || this.currentNode === '0') {
                this.$message({
                    message: this.$t('account.selectAccountGroup'),
                    type: 'error',
                    duration: 2000
                });
                return;
            }
            let node = this.$refs.groupTree.getNode(this.currentNode);
            this.accountDialogOptions = {
                type: 'creat',
                data: {
                    account: '',
                    accountGroupId: node.data.accountGroupId,
                    accountGroupName: this.getNodeLabel(node),
                    roleId: '',
                    roleName: ''
                }
            };
            this.accountDialogVisible = true;
            this.accountDialogTitle = this.$t('account.createAccount');
        },
        // 删除账号确认
        deleteAccount(val) {
            this.$confirm(this.$t('text.confirmDelete') +
                this.$t('account.user') + val.account + ' ?', {
                center: true
            }).then(() => {
                this.removeAccount(val.accountId);
            }).catch(() => {});
        },
        // 删除账号
        removeAccount(accountId) {
            deleteAccountInfo(accountId, {}).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t('system.deleteSuccess')
                    });
                    this.success();
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            });
        },
        // 编辑账号对话框
        modifyAccount(val, type) {
            this.accountDialogOptions = {
                type: type,
                data: val
            };
            this.accountDialogVisible = true;
            this.accountDialogTitle = this.$t('account.updataAccount');
        },
        // 群组变更对话框
        modifyGroup(val) {
            if (val.roleName === 'PO_Admin' || val.roleName === 'PO_Operator') {
                this.$message({
                    message: this.$t('account.modifyPoGroupTip'),
                    duration: 4000
                });
                return;
            } else {
                let _gData = JSON.parse(JSON.stringify(this.groupData));
                if (this.role === 'PO_Admin') {
                    _gData[0].children.splice(0, 1);
                }
                this.groupDataMini = _gData;

                this.accountDialogOptions = {
                    isBatch: false,
                    data: val
                };
                this.currGroupId = val.accountGroupId + '';
                this.groupDialogVisible = true;
                this.groupDialogTitle = this.$t('account.updateAccountGroup');
            }
        },
        // 重置密码确认
        resetPassword(val) {
            this.$confirm(this.$t('text.confirmResetPwd'), {
                center: true
            }).then(() => {
                this.resetAccountPwd(val);
            }).catch(() => {});
        },
        // 重置密码
        resetAccountPwd(val) {
            this.loading = true;
            resetAccountPassword(val.accountId).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('text.resetPwdSuccess')
                    });
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.modelClose();
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        translate(val) {
            return {
                '100003': this.$t('text.poadmin'),
                '100004': this.$t('text.pooper'),
                '100005': this.$t('text.puadmin'),
                '100006': this.$t('text.puoper'),
                '100007': this.$t('text.adadmin')
            }[val] || this.$t('text.unknown');
        },
        toAccountGroupMgmt() {
            router.push('/groupInfo');
            Bus.$emit('routing', '/groupInfo');
        },
        // 查询
        search() {
            this.currentPage = 1;
            this.getAccountList();
        },
        clearInput() {
            this.searchData = '';
            this.currentPage = 1;
            this.getAccountList();
        },
        // 账号类型过滤
        handleAccountTypeChange() {
            this.currentPage = 1;
            this.getAccountList();
        },
        // 删除账号权限判断
        isDeleteAccountDisabled(val) {
            return !((this.role === 'PO_Admin' || this.role === 'PU_Admin') && val.accountId != this.userId);
        },
        // 重置密码权限判断
        isResetPasswordDisabled(val) {
            return !((this.role === 'PO_Admin' || this.role === 'PU_Admin') && val.accountId != this.userId);
        },
        // 批量操作可用性判断
        isBatchActionDisabled() {
            return (this.role !== 'PO_Admin' && this.role !== 'PU_Admin') || this.selectedAccounts.length === 0;
        },
        // 账号列表中每行复选框选择状态改变时触发事件
        handleSelectionChange(val) {
            this.selectedAccounts = val;
            if (this.selectedAccounts.length > 0) {
                this.isBatchHeaderDisplay = true;
                if (this.selectedAccounts.length === 1 &&
                    this.selectedAccounts[0].accountId == this.userId) {
                    // 多选时只选择了自己的账号时
                    this.isCheckSelf = true;
                } else {
                    this.isCheckSelf = false;
                }
            } else {
                this.isBatchHeaderDisplay = false;
            }
        },
        // 批量变更账号群组事件
        handleBatchUpdateAccountGroup() {
            let _gData = JSON.parse(JSON.stringify(this.groupData));
            if (this.role === 'PO_Admin') {
                _gData[0].children.splice(0, 1);
            }
            this.groupDataMini = _gData;
            let accounts = [];
            this.selectedAccounts.forEach(account => {
                if (account.roleName !== 'PO_Admin' && account.roleName !== 'PO_Operator') {
                    accounts.push(account);
                }
            });
            if (accounts.length === 0) {
                this.$message({
                    message: this.$t('account.batchModifyGroupTip'),
                    duration: 4000
                });
                return;
            } else {
                this.accountDialogOptions = {
                    isBatch: true,
                    data: accounts
                };
                this.currGroupId = accounts[0].accountGroupId + '';
                this.groupDialogVisible = true;
                this.groupDialogTitle = this.$t('account.updateAccountGroup');
            }
        },
        // 批量重置密码事件
        handleBatchResetPassword() {
            this.$confirm(this.$t('text.confirmResetPwd'), {
                center: true
            }).then(() => {
                this.resetAccountsPwd();
            }).catch(() => {});
        },
        // 批量重置密码
        resetAccountsPwd() {
            this.loading = true;
            let accountList = this.selectedAccounts;
            let accountIds = [];
            accountList.forEach(account => {
                if (account.accountId != this.userId) {
                    accountIds.push(account.accountId);
                }
            });
            if (accountIds.length === 0) return;
            batchResetAccountPassword(accountIds.join(',')).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let resData = res.data.data || [];
                    if (resData.length === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t('text.resetPwdSuccess')
                        });
                    } else {
                        let msg = this.$t('account.batchResetPasswordMsg') + '<br /><br />';
                        resData.forEach(item => {
                            msg += item.name + '&nbsp;:&nbsp;' + this.$chooseLang(item.errorCode) + '<br />';
                        });
                        this.$message({
                            type: 'warning',
                            message: msg,
                            dangerouslyUseHTMLString: true,
                            duration: 8000
                        });
                    }
                    this.success();
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.modelClose();
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 批量删除账号事件
        handleBatchDeleteAccount() {
            this.$confirm(this.$t('text.confirmDelete') + this.$t('account.user') + ' ?', {
                center: true
            }).then(() => {
                this.removeAccounts();
            }).catch(() => {});
        },
        // 批量删除账号
        removeAccounts() {
            this.loading = true;
            let accountList = this.selectedAccounts;
            let accountIds = [];
            accountList.forEach(account => {
                if (account.accountId != this.userId) {
                    accountIds.push(account.accountId);
                }
            });
            if (accountIds.length === 0) return;
            batchDeleteAccountInfo(accountIds.join(',')).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let resData = res.data.data || [];
                    if (resData.length === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t('system.deleteSuccess')
                        });
                    } else {
                        let msg = this.$t('account.batchDeleteAccountMsg') + '<br /><br />';
                        resData.forEach(item => {
                            msg += item.name + '&nbsp;:&nbsp;' + this.$chooseLang(item.errorCode) + '<br />';
                        });
                        this.$message({
                            type: 'warning',
                            message: msg,
                            dangerouslyUseHTMLString: true,
                            duration: 8000
                        });
                    }
                    this.success();
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.modelClose();
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        }
    }
};
</script>

<style scoped>
.module-wrapper {
    display: flex;
    flex-direction: row;
}
.tree-wrapper {
    width: 22%;
    padding: 15px 0 15px 21px;
    box-sizing: border-box;
}
.tree-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 15px 21px 9px 21px;
    border: 1px solid #EBEEF5;
    border-radius: 5px;
    height: 540px;
}
.content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 78%;
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
.tree-top-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 36px;
}
.tree-bottom-row {
    height: calc(100% - 36px);
    overflow: auto;
}
</style>
