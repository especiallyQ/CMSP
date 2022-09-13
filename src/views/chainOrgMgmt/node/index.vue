<template>
    <div class="chain-org-detail-node-wrapper">
        <div class="search-part search-part-inner">
            <div class="search-part-left"></div>
            <div class="search-part-right">
                <el-button
                    type="primary"
                    size="small"
                    class="search-part-left-btn btn-add"
                    @click="handleAddButton"
                    v-if="accountType === 'PU_Admin'">
                    {{ $t('chainNode.nodeAddText') }}
                </el-button>
            </div>
        </div>
        <div class="search-table search-table-inner">
            <el-table :data="tableList" tooltip-effect="light" v-loading="loading">
                <el-table-column
                    v-for="head in tableHeader"
                    :label="head.name"
                    :key="head.enName"
                    show-overflow-tooltip
                    align="center"
                    :min-width="head.enName === 'operate' ? 250 : 100">
                    <template slot-scope="scope">
                        <template v-if="head.enName !== 'operate'">
                            <span>{{scope.row[head.enName]}}</span>
                        </template>
                        <template v-else>
                            <el-button
                                type="text"
                                size="small"
                                style="color:#ed5454"
                                @click="deleteRow(scope.row)"
                                :disabled="!(accountType === 'PU_Admin' && isNodeOffline(scope.row))">
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
                                :disabled="accountType !== 'PU_Admin'">
                                {{ $t('chainNode.viewCertification') }}
                            </el-button>
                            <el-button
                                type="text"
                                size="small"
                                @click="downloadCert(scope.row)"
                                v-if="chainIdentityModel === 'CA'"
                                :disabled="accountType !== 'PU_Admin'">
                                {{ $t('chainNode.downloadCertification') }}
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
        </div>
        <nodeFormDialog
            :visible="nodeDialogVisible"
            :nodeTypeList="nodeTypeList"
            :nodeData="nodeModifyData"
             @close="nodeDialogVisible = false"
             @success="getTableList()"/>
        <certViewDialog
            :visible="certViewVisible"
            :certType="2"
            :id="Number(chainOrgNodeId)"
            @close="certViewVisible = false" />
        <keyViewDialog
            :visible="pemViewVisible"
            :keyType="2"
            :id="Number(chainOrgNodeId)"
            @close="pemViewVisible = false" />
    </div>
</template>

<script>
import {
    getChainOrgNodeList,
    deleteChainOrgNode,
    downloadChainOrgCert,
    downloadChainOrgKey
} from "@/util/api";
import url from '@/util/url';
import nodeFormDialog from './formDialog';
import certViewDialog from "../components/certViewDialog";
import keyViewDialog from "../components/keyViewDialog";
export default {
    name: 'chainOrgNode',
    components: {
        nodeFormDialog,
        certViewDialog,
        keyViewDialog
    },
    props: {
        orgId: {
            type: String,
            required: false,
            default: null
        },
        nodeTypeList: {
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
            accountType: localStorage.getItem('root'),
            chainIdentityModel: this.$configOpt('chainIdentityModel'), // 身份模式配置
            loading: false,
            nodeDialogVisible: false,
            nodeModifyData: {
                model: 1,
                orgId: this.orgId
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableList: [],
            certViewVisible: false,
            pemViewVisible: false,
            chainOrgNodeId: null
        };
    },
    computed: {
        tableHeader() {
            let data = [{
                enName: 'nodeName',
                name: this.$t('chainNode.nodeName')
            }, {
                enName: 'nodeId',
                name: this.$t('chainNode.nodeId')
            }, {
                enName: 'nodeType',
                name: this.$t('chainNode.nodeType')
            }, {
                enName: 'nodeAddress',
                name: this.$t('chainNode.nodeAddr')
            }, {
                enName: 'nodePort',
                name: this.$t('chainNode.nodePort')
            }, {
                enName: 'monitorPort',
                name: this.$t('chainNode.nodeMonitorPort')
            }, {
                enName: 'description',
                name: this.$t('chainNode.remarks')
            }, {
                enName: 'operate',
                name: this.$t('chainNode.operation')
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
            getChainOrgNodeList({
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
            this.nodeModifyData = { orgId: this.orgId, model: 1 };
            this.nodeDialogVisible = true;
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
        isNodeOffline(rowData) { // 节点是否离线
            // 不在应用链上且节点未运行
            return !rowData.chainId && rowData.nodeStatus != 1;
        },
        deleteRow(rowData) {
            this.$confirm(this.$t('text.confirmDelete') +
                this.$t('chainNode.node') + rowData.nodeName + ' ?', {
                center: true
            }).then(() => {
                this.loading = true;
                deleteChainOrgNode(rowData.id)
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
            this.nodeModifyData = Object.assign({ model: 2 }, rowData);
            this.nodeDialogVisible = true;
        },
        viewCert(rowData) {
            this.chainOrgNodeId = rowData.id;
            this.$nextTick(() => {
                this.certViewVisible = true;
            });
        },
        // 查看公钥
        viewPem(rowData) {
            this.chainOrgNodeId = rowData.id;
            this.$nextTick(() => {
                this.pemViewVisible = true;
            });
        },
        downloadCert(rowData) {
            this.loading = true;
            downloadChainOrgCert({
                certType: 2,
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
                type: 2,
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
        }
    }
};
</script>

<style scoped>
</style>
