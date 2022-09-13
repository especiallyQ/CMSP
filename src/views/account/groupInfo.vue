<template>
    <div class="group-wrapper">
        <content-head :headTitle="$t('title.groupManagement')"></content-head>
        <div class="module-wrapper">
            <div class="tree-wrapper">
                <div class="tree-box">
                    <div class="tree-top-row" v-if="role === 'PO_Admin' || role === 'PU_Admin'">
                        <el-button
                            type="text"
                            size="small"
                            :disabled="createBtnDisabled"
                            @click="handleCreateGroup()">
                            {{$t('accountGroup.addGroup')}}
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
                <div class="detail-info">
                    <el-form ref="infoForm" label-width="144px">
                        <el-row :gutter="24">
                            <el-col :span="21">
                                <div class="detail-info-header">
                                    <div
                                        class="header-icon"
                                        :style="{ backgroundColor: colors[Number(currentNode) % 28] }">
                                        {{ getIconText(groupForm.name) }}
                                    </div>
                                    <div class="header-label">{{ groupForm.name }}</div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="21">
                                <div class="action-wrap">
                                    <el-button
                                        type="danger"
                                        size="small"
                                        v-if="role === 'PO_Admin' || role === 'PU_Admin'"
                                        :disabled="deleteBtnDisabled"
                                        @click="handleDeleteGroup">
                                        {{$t('text.delete')}}
                                    </el-button>
                                    <el-button
                                        type="primary"
                                        size="small"
                                        v-if="role === 'PO_Admin' || role === 'PU_Admin'"
                                        :disabled="modifyBtnDisabled"
                                        @click="handleModifyGroup">
                                        {{$t('text.update')}}
                                    </el-button>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="21">
                                <el-form-item :label="$t('accountGroup.accountGroupNum') + ':'" class="form-item">
                                    <span class="number-txt">{{ groupForm.groupNum }}</span>
                                    <span>{{ $t('monitor.countUnit') }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="21">
                                <el-form-item :label="$t('accountGroup.accountNum') + ':'" class="form-item">
                                    <span class="number-txt">{{ groupForm.accountNum }}</span>
                                    <span>{{ $t('monitor.countUnit') }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24">
                            <el-col :span="21">
                                <el-form-item
                                    :label="$t('accountGroup.remarks') + ':'"
                                    class="form-item"
                                    style="margin-bottom: 20px;">
                                    <div class="remarks">
                                        <el-tooltip
                                            class="item"
                                            effect="dark"
                                            placement="bottom"
                                            :open-delay="1000">
                                            <div
                                                slot="content"
                                                style="max-width: 300px;"
                                                v-dompurify-html="groupForm.remarks || this.$t('text.noRemark')">
                                            </div>
                                            <span>{{ groupForm.remarks || this.$t('text.noRemark') }}</span>
                                        </el-tooltip>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <el-dialog
                :visible.sync="groupDialogVisible"
                :title="groupDialogTitle"
                width="433px"
                :append-to-body="true"
                :center="true"
                :close-on-click-modal="false"
                class="dialog-wrapper"
                v-if="groupDialogVisible">
                <group-dialog
                    :groupDialogOptions="groupDialogOptions"
                    @success="success"
                    @close="close">
                </group-dialog>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { earthTones } from '@/util/util';
import {
    fetchAccountGroupTree,
    deleteAccountGroup
} from '@/util/api';
import contentHead from '@/components/contentHead';
import groupDialog from './components/groupDialog';
export default {
    name: 'groupInfo',
    components: {
        contentHead,
        groupDialog
    },
    data() {
        return {
            loading: false,
            groupId: '',
            role: '',
            colors: earthTones(),
            groupData: [], // 账号群组树
            // 树控件参数
            defaultProps: {
                id: 'accountGroupId',
                label: 'accountGroupName',
                children: 'children'
            },
            groupForm: {
                name: '',
                groupNum: '0',
                accountNum: '0',
                remarks: ''
            },
            currentNode: '0', // 当前选中节点
            currentPNode: '', // 当前选中节点父节点
            currentLevel: '0', // 当前选中节点层级
            createBtnDisabled: true,
            modifyBtnDisabled: true,
            deleteBtnDisabled: true,
            groupDialogVisible: false, // 表单可见性
            groupDialogTitle: '', // 表单标题
            groupDialogOptions: {} // 表单参数
        }
    },
    computed: {
    },
    mounted() {
        this.initPage();
        this.getAccountGroupTree(() => {
            this.$nextTick(() => {
                this.$refs.groupTree.setCurrentKey(this.currentNode);
                let node = this.$refs.groupTree.getNode(this.currentNode);
                this.handleTreeNodeClick(node.data);
            });
        });
    },
    methods: {
        // 初始化
        initPage() {
            this.groupId = localStorage.getItem('groupId');
            this.role = localStorage.getItem('root');
            if (this.role === 'PO_Admin') {
                this.createBtnDisabled = false;
            }
        },
        // 获取账号群组树
        getAccountGroupTree(callback) {
            this.loading = true;
            fetchAccountGroupTree(1).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let rootChildren = res.data.data || [];
                    let groupNum = 0, accountNum = 0;
                    rootChildren.forEach((child, idx) => {
                        groupNum += parseInt(child.accountGroupNum || '0') + 1;
                        accountNum += parseInt(child.accountNum || '0');
                    });
                    this.currentNode = rootChildren.length > 0 ? rootChildren[0].accountGroupId : '0';
                    this.groupData = [{
                        accountGroupId: '0',
                        accountGroupName: '全部账号群组',
                        description: '',
                        level: '0',
                        accountGroupNum: groupNum,
                        accountNum: accountNum,
                        children: rootChildren
                    }];
                    callback && callback();
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
        // 树节点点击事件
        handleTreeNodeClick(data) {
            this.currentNode = data.accountGroupId;
            this.currentPNode = data.parentGroupId;
            this.currentLevel = data.level;
            this.groupForm.name = data.accountGroupName;
            this.groupForm.groupNum = data.accountGroupNum + '';
            this.groupForm.accountNum = data.accountNum + '';
            this.groupForm.remarks = data.description;
            this.checkRole();
        },
        // 按钮可用性处理
        checkRole() {
            if (this.currentNode === '0' && this.currentLevel === '0') {
                if (this.role === 'PO_Admin') {
                    this.createBtnDisabled = false;
                    this.modifyBtnDisabled = true;
                    this.deleteBtnDisabled = true;
                } else if (this.role === 'PU_Admin') {
                    this.createBtnDisabled = true;
                    this.modifyBtnDisabled = true;
                    this.deleteBtnDisabled = true;
                } else {
                    this.createBtnDisabled = true;
                    this.modifyBtnDisabled = true;
                    this.deleteBtnDisabled = true;
                }
            } else if (this.currentLevel === '4') {
                if (this.role === 'PO_Admin') {
                    this.createBtnDisabled = true;
                    this.modifyBtnDisabled = false;
                    this.deleteBtnDisabled = false;
                } else if (this.role === 'PU_Admin') {
                    if (this.groupId == this.currentNode) {
                        this.createBtnDisabled = true;
                        this.modifyBtnDisabled = false;
                        this.deleteBtnDisabled = false;
                    } else {
                        this.createBtnDisabled = true;
                        this.modifyBtnDisabled = true;
                        this.deleteBtnDisabled = false;
                    }
                } else {
                    this.createBtnDisabled = true;
                    this.modifyBtnDisabled = true;
                    this.deleteBtnDisabled = false;
                }
            } else if (this.currentNode === '1') {
                this.createBtnDisabled = true;
                this.modifyBtnDisabled = true;
                this.deleteBtnDisabled = true;
            } else {
                if (this.role === 'PO_Admin') {
                    this.createBtnDisabled = false;
                    this.modifyBtnDisabled = false;
                    this.deleteBtnDisabled = false;
                } else if (this.role === 'PU_Admin') {
                    if (this.groupId == this.currentNode) {
                        this.createBtnDisabled = false;
                        this.modifyBtnDisabled = false;
                        this.deleteBtnDisabled = false;
                    } else {
                        this.createBtnDisabled = false;
                        this.modifyBtnDisabled = false;
                        this.deleteBtnDisabled = false;
                    }
                } else {
                    this.createBtnDisabled = true;
                    this.modifyBtnDisabled = true;
                    this.deleteBtnDisabled = true;
                }
            }
        },
        // 新建账号群组事件
        handleCreateGroup() {
            let node = this.$refs.groupTree.getNode(this.currentNode);
            this.groupDialogOptions = {
                type: 'create',
                data: {
                    parentGroupId: this.currentNode
                }
            };
            this.groupDialogVisible = true;
            this.groupDialogTitle = this.$t('accountGroup.addGroup');
        },
        // 编辑账号群组事件
        handleModifyGroup() {
            let node = this.$refs.groupTree.getNode(this.currentNode);
            this.groupDialogOptions = {
                type: 'modify',
                data: {
                    accountGroupId: this.currentNode,
                    accountGroupName: this.groupForm.name,
                    description: this.groupForm.remarks,
                    parentGroupId: this.currentPNode
                }
            };
            this.groupDialogVisible = true;
            this.groupDialogTitle = this.$t('accountGroup.modifyGroup');
        },
        // 删除账号群组事件
        handleDeleteGroup() {
            let _node = this.$refs.groupTree.getNode(this.currentNode);
            if (_node.childNodes && _node.childNodes.length > 0) {
                this.$message({
                    message: this.$t('accountGroup.hasChild'),
                    type: 'error',
                    duration: 2000
                });
                return;
            } else {
                this.$confirm(this.$t('text.confirmDelete') +
                    this.$t('accountGroup.group') + this.groupForm.name + ' ?', {
                    center: true
                }).then(_ => {
                    this.deleteGroup();
                }).catch(_ => {});
            }
        },
        // 删除账号群组
        deleteGroup() {
            this.loading = true;
            let params = {accountGroupId: this.currentNode};
            deleteAccountGroup(params).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('text.resetSuccess')
                    });
                    this.getAccountGroupTree(() => {
                        this.$nextTick(() => {
                            this.$refs.groupTree.setCurrentKey(this.currentPNode);
                            let node = this.$refs.groupTree.getNode(this.currentPNode);
                            this.handleTreeNodeClick(node.data);
                        });
                    });
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            });
        },
        // 表单提交成功后的回调
        success() {
            this.getAccountGroupTree(() => {
                this.$nextTick(() => {
                    this.$refs.groupTree.setCurrentKey(this.currentNode);
                    let node = this.$refs.groupTree.getNode(this.currentNode);
                    this.handleTreeNodeClick(node.data);
                });
            });
        },
        // 关闭弹出的表单窗口
        close(val) {
            this.groupDialogVisible = val;
        },
        getIconText(name) {
            let pattern = new RegExp('[\u4E00-\u9FA5]+');
            let firstChar = name.substring(0, 1);
            if (pattern.test(firstChar)) {
                return firstChar;
            } else {
                return firstChar.toUpperCase();
            }
        }
    }
}
</script>

<style scoped>
.module-wrapper {
    position: relative;
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
.content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 78%;
}
.content-wrapper .action-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 180px;
    padding: 10px 12px 16px 56px;
    box-sizing: border-box;
}
.detail-info .el-form >>> .detail-info-header {
    display: flex;
    flex-direction: row;
    height: 32px;
    padding: 38px 12px 10px 56px;
    font-weight: bold;
    font-size: 16px;
}
.detail-info .el-form >>> .detail-info-header .header-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
}
.detail-info .el-form >>> .detail-info-header .header-label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 32px;
    padding-left: 6px;
}
.detail-info .el-form >>> .el-form-item {
    margin-bottom: 0;
}
.detail-info .el-form >>> .el-form-item .link:hover {
    text-decoration: underline;
}
.detail-info .el-form >>> .el-form-item__label {
    font-size: 12px;
    color: #2E384D;
    font-weight: bold;
}
.detail-info .el-form >>> .el-form-item__content {
    font-size: 12px;
}
.detail-info .el-form .number-txt {
    color: #409EFF;
    font-size: 14px;
    font-weight: bold;
    margin-right: 2px;
}
.detail-info .el-form .remarks {
    line-height: 24px;
    padding: 6px 0;
    text-overflow: ellipsis;
    overflow: hidden;
}
.tree-top-row >>> .el-button.is-disabled {
    cursor: not-allowed;
    border: 1px solid transparent;
    background-color: transparent!important;
    border-color: transparent!important;
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
