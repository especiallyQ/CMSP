<template>
    <div class="chain-org-mgmt-wrapper">
        <content-head :headTitle="$t('title.chainOrgManagement')"></content-head>
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-left">
                    <el-form
                        ref="searchForm"
                        :inline="true"
                        label-width="70px"
                        class="search-form">
                        <el-form-item>
                            <el-input
                                :placeholder="$t('chainOrg.nameSearch')"
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
                    <el-button-group>
                        <el-button
                            type="primary"
                            size="small"
                            v-if="createBtnVisable"
                            @click="createChainOrg">
                            {{$t('chainOrg.addOrg')}}
                        </el-button>
                    </el-button-group>
                    <el-button-group>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            :content="$t('text.viewTable')"
                            placement="bottom"
                            :open-delay="1000">
                            <el-button
                                size="small"
                                :type="viewType === '0' ? 'primary' : 'info'"
                                icon="cmsp-icon-caidan"
                                @click="handleChangeView('0')">
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            :content="$t('text.viewCard')"
                            placement="bottom"
                            :open-delay="1000">
                            <el-button
                                size="small"
                                :type="viewType === '1' ? 'primary' : 'info'"
                                icon="el-icon-menu"
                                @click="handleChangeView('1')">
                            </el-button>
                        </el-tooltip>
                    </el-button-group>
                </div>
            </div>
            <div class="search-table">
                <template v-if="viewType === '0'">
                    <list-view
                        :data="chainOrgList"
                        @refresh="getChainOrgList"
                        @updateChainOrg="updateChainOrg">
                    </list-view>
                </template>
                <template v-else-if="viewType === '1'">
                    <card-view
                        :data="chainOrgList"
                        @refresh="getChainOrgList"
                        @updateChainOrg="updateChainOrg">
                    </card-view>
                </template>
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
            <el-dialog
                :visible.sync="chainOrgDialogVisible"
                :title="chainOrgDialogTitle"
                width="500px"
                :append-to-body="true"
                :center="true"
                :close-on-click-modal="false"
                class="dialog-wrapper"
                v-if="chainOrgDialogVisible">
                <chain-org-dialog
                    :dialogOptions="dialogOptions"
                    @success="success"
                    @close="close">
                </chain-org-dialog>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { chainOrgList } from '@/util/api';
import {
    getCookie,
    setCookie
} from '@/util/util';
import listView from './view/listView';
import cardView from './view/cardView';
import contentHead from '@/components/contentHead';
import chainOrgDialog from './components/chainOrgDialog';
export default {
    name: 'chainOrgMgmt',
    components: {
        contentHead,
        listView,
        cardView,
        chainOrgDialog
    },
    data() {
        return {
            loading: false,
            accountName: '', // 登录账号
            accountGroupId: '', // 登录账号所属群组ID
            accountType: '', // 登录账号类型(角色)
            createBtnVisable: true,
            // 视图类型: 0-列表视图, 1-卡片视图
            viewType: getCookie('org-view') || '1',
            chainOrgList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            chainOrgDialogVisible: false,
            chainOrgDialogTitle: '',
            dialogOptions: {},
            searchData: ''
        }
    },
    computed: {
    },
    mounted() {
        this.initPage();
        this.getChainOrgList();
    },
    methods: {
        initPage() {
            this.accountName = localStorage.getItem('user');
            this.accountGroupId = localStorage.getItem('groupId');
            this.accountType = localStorage.getItem('root');
            if (this.accountType !== 'PU_Admin') {
                this.createBtnVisable = false;
            }
        },
        getChainOrgList() {
            this.loading = true;
            let reqData = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            };
            let query = {
                orgName: this.searchData
            };
            chainOrgList(reqData, query).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.chainOrgList = res.data.data || [];
                    this.total = res.data.totalCount;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            });
        },
        search() {
            this.currentPage = 1;
            this.getChainOrgList();
        },
        // 页面视图变更事件
        handleChangeView(type) {
            this.viewType = type;
            setCookie('org-view', type, 30);
        },
        createChainOrg() {
            this.dialogOptions = {
                type: 'create',
                data: {
                    orgId: '',
                    orgName: '',
                    creator: this.accountName,
                    accountGroupId: this.accountGroupId,
                    accountGroupName: localStorage.getItem('groupName'),
                    remarks: ''
                }
            };
            this.chainOrgDialogVisible = true;
            this.chainOrgDialogTitle = this.$t('chainOrg.createChainOrg');
        },
        updateChainOrg(row) {
            this.dialogOptions = {
                type: 'modify',
                data: {
                    orgId: row.id,
                    orgName: row.orgName,
                    creator: row.creator,
                    accountGroupId: row.accountGroupId,
                    accountGroupName: row.accountGroupName,
                    remarks: row.description || ''
                }
            };
            this.chainOrgDialogVisible = true;
            this.chainOrgDialogTitle = this.$t('chainOrg.modifyChainOrg');
        },
        deleteChainOrg(row) {
            this.$confirm(this.$t('text.confirmDelete') +
                this.$t('monitor.chainOrg') + row.orgName + ' ?', {
                center: true
            }).then(() => {
                this.removeChainOrg(row.id);
            }).catch(() => {});
        },
        removeChainOrg(orgId) {
            deleteChainOrg(orgId).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('system.deleteSuccess')
                    });
                    this.success();
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
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getChainOrgList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getChainOrgList();
        },
        clearInput() {
            this.searchData = '';
            this.currentPage = 1;
            this.getChainOrgList();
        },
        success() {
            this.getChainOrgList();
        },
        close(val) {
            this.chainOrgDialogVisible = val;
        }
    }
}
</script>

<style scoped>
.chain-org-mgmt-wrapper {
    display: flex;
    flex-direction: column;
}
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
