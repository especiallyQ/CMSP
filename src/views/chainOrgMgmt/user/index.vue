<template>
    <div class="chain-org-detail-user-wrapper">
        <div class="search-part search-part-inner">
            <div class="search-part-left"></div>
            <div class="search-part-right">
                <el-button
                    type="primary"
                    size="small"
                    @click="handleAddButton"
                    v-if="accountType === 'PU_Admin'">
                    {{ $t('chainUser.userAddText') }}
                </el-button>
            </div>
        </div>
        <div class="search-table search-table-inner">
            <el-table
                ref="orgUserTable"
                :data="tableList"
                row-key="id"
                tooltip-effect="light"
                v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    reserve-selection
                    width="50"
                    align="center"
                    :selectable="userSelectable">
                </el-table-column>
                <el-table-column
                    v-for="head in tableHeader"
                    :label="head.name"
                    :key="head.enName"
                    show-overflow-tooltip
                    align="center"
                    :min-width="head.enName === 'operate' ? 150 : 100">
                    <template slot-scope="scope">
                        <template v-if="head.enName !== 'operate'">
                            <span>{{ scope.row[head.enName] }}</span>
                        </template>
                        <template v-else>
                            <el-button
                                type="text"
                                size="small"
                                style="color:#ed5454"
                                @click="deleteRow(scope.row)"
                                :disabled="!(accountType === 'PU_Admin' && !scope.row.chainId)">
                                {{ $t('text.delete') }}
                            </el-button>
                            <el-button
                                type="text"
                                size="small"
                                @click="updateRow(scope.row)"
                                :disabled="accountType !== 'PU_Admin'">
                                {{ $t('text.update') }}
                            </el-button>
                            <el-button
                                type="text"
                                size="small"
                                @click="viewCert(scope.row)"
                                v-if="chainIdentityModel === 'CA'"
                                :disabled="accountId != scope.row.accountId">
                                {{ $t('chainUser.viewCertification') }}
                            </el-button>
                            <el-button
                                type="text"
                                size="small"
                                @click="downloadCert(scope.row)"
                                v-if="chainIdentityModel === 'CA'"
                                :disabled="accountId != scope.row.accountId">
                                {{ $t('chainUser.downloadCertification') }}
                            </el-button>
                            <el-button
                                type="text"
                                size="small"
                                @click="viewPem(scope.row)"
                                v-if="chainIdentityModel === 'PWK'"
                                :disabled="accountType !== 'PU_Admin'">
                                {{ $t('chainOrg.viewPem') }}
                            </el-button>
                            <el-button
                                type="text"
                                size="small"
                                @click="downloadPem(scope.row)"
                                v-if="chainIdentityModel === 'PWK'"
                                :disabled="accountType !== 'PU_Admin'">
                                {{ $t('chainOrg.downloadPem') }}
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
                    <div>{{ selectedUsers.length }}</div>
                    <div class="tip-suffix">
                        {{ $t('text.batchTipSuffix') }}
                    </div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="btn-wrap">
                    <el-button
                        type="danger"
                        size="small"
                        @click="handleBatchRemoveUser"
                        :disabled="isBatchRemoveUserDisabled()">
                        {{ $t('chainUser.userRemoveText') }}
                    </el-button>
                </div>
            </div>
        </div>
        <userFormDialog
            :visible="userDialogVisible"
            :userTypeList="userTypeList"
            :accountList="accountList"
            :userData="userModifyData"
            @close="userDialogVisible = false"
            @success="getTableList()"/>
        <certViewDialog
            :visible="certViewVisible"
            :certType="3"
            :id="Number(chainOrgUserId)"
            @close="certViewVisible = false" />
        <keyViewDialog
            :visible="pemViewVisible"
            :keyType="3"
            :id="Number(chainOrgUserId)"
            @close="pemViewVisible = false" />
    </div>
</template>

<script>
import {
    getChainOrgUserList,
    deleteChainOrgUser,
    downloadChainOrgCert,
    downloadChainOrgKey,
    batchDeleteChainOrgUser
} from "@/util/api";
import userFormDialog from './formDialog';
import certViewDialog from "../components/certViewDialog";
import keyViewDialog from "../components/keyViewDialog";
export default {
    name: 'chainOrgUser',
    components: {
        userFormDialog,
        certViewDialog,
        keyViewDialog
    },
    props: {
        orgId: {
            type: String,
            required: false,
            default: null
        },
        userTypeList: {
            type: Array,
            required: false,
            default: () => {
                return [];
            }
        },
        accountList: {
            type: Array,
            required: false,
            default: () => {
                return [];
            }
        }
    },
    watch: {
        orgId(nval, oval) {
            if (nval !== oval) {
                this.getTableList();
            }
        }
    },
    data() {
        return {
            accountId: localStorage.getItem('userId'),
            accountType: localStorage.getItem('root'),
            chainIdentityModel: this.$configOpt('chainIdentityModel'), // 身份模式配置
            loading: false,
            userDialogVisible: false,
            userModifyData: {
                model: 1,
                orgId: this.orgId
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableList: [],
            certViewVisible: false,
            pemViewVisible: false,
            chainOrgUserId: null,
            selectedUsers: [], // 列表中被选中的用户
            isBatchHeaderDisplay: false // 批量操作表头层是否显示
        };
    },
    computed: {
        tableHeader() {
            let data = [{
                enName: 'userName',
                name: this.$t('chainUser.userName')
            }, {
                enName: 'account',
                name: this.$t('chainUser.account')
            }, {
                enName: 'userRole',
                name: this.$t('chainUser.userType')
            }, {
                enName: 'description',
                name: this.$t('chainUser.remarks')
            }, {
                enName: 'operate',
                name: this.$t('chainUser.operation')
            }];
            return data;
        }
    },
    mounted() {
        this.getTableList();
    },
    methods: {
        getTableList() {
            if (!this.orgId) {
                return;
            }
            this.loading = true;
            getChainOrgUserList({
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
                id: this.orgId
            }).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.tableList = res.data.data || [];
                    this.total = res.data.totalCount || 0;
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
        handleAddButton() {
            if (!this.orgId) {
                return;
            }
            this.userModifyData = { orgId: this.orgId, model: 1 };
            this.userDialogVisible = true;
        },
        handleSizeChange: function (val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getTableList();
        },
        handleCurrentChange: function (val) {
            this.currentPage = val;
            this.getTableList();
        },
        deleteRow(rowData) {
            this.$confirm(this.$t('text.confirmDelete') +
                this.$t('chainUser.user') + rowData.userName + ' ?', {
                center: true
            }).then(() => {
                this.loading = true;
                deleteChainOrgUser(rowData.id)
                    .then(res => {
                        this.loading = false;
                        if (res.data.code === 0) {
                            this.$message({
                                type: "success",
                                message: this.$t('system.deleteSuccess')
                            });
                            this.getTableList();
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
            }).catch(() => {});
        },
        updateRow(rowData) {
            if (!this.orgId) {
                return;
            }
            this.userModifyData = {
                model: 2,
                id: rowData.id,
                orgId: rowData.orgId,
                userName: rowData.userName,
                // account: rowData.account,
                accountId: rowData.accountId,
                userType: rowData.userRoleId,
                description: rowData.description
            };
            this.userDialogVisible = true;
        },
        viewCert(rowData) {
            this.chainOrgUserId = rowData.id;
            this.$nextTick(() => {
                this.certViewVisible = true;
            });
        },
        // 查看公钥
        viewPem(rowData) {
            this.chainOrgUserId = rowData.id;
            this.$nextTick(() => {
                this.pemViewVisible = true;
            });
        },
        downloadCert(rowData) {
            this.loading = true;
            downloadChainOrgCert({
                certType: 3,
                id: rowData.id
            }).then(res => {
                this.loading = false;
                if (res.status === 200) {
                    const blob = new Blob([res.data]);
                    let fileName = `cert.zip`;
                    let disposition = res.headers['content-disposition'] || '';
                    let fileNameIdx = disposition.indexOf('filename=');
                    if (fileNameIdx != -1) {
                        let tmp = disposition.substring(fileNameIdx + 9);
                        if (tmp) {
                            fileName = decodeURIComponent(tmp);
                        }
                    }
                    if ('download' in document.createElement('a')) {
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href)
                        document.body.removeChild(elink)
                    } else {
                        navigator.msSaveBlob(blob, fileName)
                    }
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
        // 下载公钥
        downloadPem(rowData) {
            this.loading = true;
            downloadChainOrgKey({
                type: 3,
                id: rowData.id
            }).then(res => {
                this.loading = false;
                if (res.status === 200) {
                    const blob = new Blob([res.data]);
                    let fileName = `key.zip`;
                    let disposition = res.headers['content-disposition'] || '';
                    let fileNameIdx = disposition.indexOf('filename=');
                    if (fileNameIdx != -1) {
                        let tmp = disposition.substring(fileNameIdx + 9);
                        if (tmp) {
                            fileName = decodeURIComponent(tmp);
                        }
                    }
                    if ('download' in document.createElement('a')) {
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href)
                        document.body.removeChild(elink)
                    } else {
                        navigator.msSaveBlob(blob, fileName)
                    }
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
        // 列表中的复选框能否使用
        userSelectable(row, index) {
            return this.accountType === 'PU_Admin' && !row.chainId;
        },
        // 列表中每行复选框选择状态改变时触发事件
        handleSelectionChange(val) {
            this.selectedUsers = val;
            if (this.selectedUsers.length > 0) {
                this.isBatchHeaderDisplay = true;
            } else {
                this.isBatchHeaderDisplay = false;
            }
        },
        // 批量删除链上用户可用性
        isBatchRemoveUserDisabled() {
            return this.accountType !== 'PU_Admin' || this.selectedUsers.length === 0;
        },
        // 批量删除链上用户事件
        handleBatchRemoveUser() {
            this.$confirm(this.$t('text.confirmDelete') + this.$t('chainUser.user') + ' ?', {
                center: true
            }).then(() => {
                this.loading = true;
                let userList = this.selectedUsers;
                let userIds = [];
                userList.forEach(user => {
                    userIds.push(user.id);
                });
                if (userIds.length === 0) return;
                batchDeleteChainOrgUser(userIds.join(',')).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        let resData = res.data.data || [];
                        if (resData.length === 0) {
                            this.$message({
                                type: 'success',
                                message: this.$t('system.deleteSuccess')
                            });
                        } else {
                            let msg = this.$t('chainUser.batchDeleteUserMsg') + '<br /><br />';
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
                        this.getTableList();
                        this.$refs.orgUserTable.clearSelection();
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
            }).catch(() => {});
        }
    }
};
</script>

<style scoped>
</style>
