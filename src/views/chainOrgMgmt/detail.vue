<template>
    <div class="chain-org-detail-wrapper">
        <content-head
            :headTitle="$t('title.chainOrgManagement')"
            :headSubTitle="$t('title.chainOrgDetail')">
        </content-head>
        <div class="module-wrapper">
            <div class="org-info">
                <div class="org-info-header">
                    <div class="org-info-title">
                        {{ $t('chainOrg.detailPageTitle') }}
                    </div>
                    <el-button @click="goBack" class="backbtn" size="small">
                        {{ $t('text.back') }}
                    </el-button>
                </div>
                <el-form ref="orgInfoForm" label-width="180px">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item
                                :label="$t('chainOrg.name') + ':'"
                                prop="quotaName"
                                class="form-item">
                                {{ chainOrgDetail.orgName }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                :label="$t('chainOrg.creator') + ':'"
                                class="form-item">
                                {{ chainOrgDetail.creator }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item
                                :label="$t('chainOrg.chainNodeTotal') + ':'"
                                prop="quotaType"
                                class="form-item">
                                {{ chainOrgDetail.nodeNum || 0 }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                :label="$t('chainOrg.chainUserTotal') + ':'"
                                prop="quotaState"
                                class="form-item">
                                {{ chainOrgDetail.userNum || 0 }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item
                                :label="$t('chainOrg.accountGroup') + ':'"
                                class="form-item">
                                {{ chainOrgDetail.accountGroupName }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                :label="$t('chainOrg.chainOrgRemarks') + ':'"
                                class="form-item">
                                {{ chainOrgDetail.description }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" v-if="role === 'PU_Admin'">
                        <el-col :span="8">
                            <template v-if="chainIdentityModel === 'CA'">
                                <el-form-item
                                    :label="$t('chainOrg.chainOrgCertification') + ':'"
                                    class="form-item">
                                    <span
                                        class="link"
                                        @click="handleViewCert">
                                        {{ $t('chainOrg.viewCertification') }}
                                    </span>
                                    <span
                                        class="link"
                                        @click="handleDownloadCert">
                                        {{ $t('chainOrg.downloadCertification') }}
                                    </span>
                                </el-form-item>
                            </template>
                            <template v-else-if="chainIdentityModel === 'PWK'">
                                <el-form-item
                                    :label="$t('chainOrg.chainOrgPem') + ':'"
                                    class="form-item">
                                    <span
                                        class="link"
                                        @click="handleViewPem">
                                        {{ $t('chainOrg.viewPem') }}
                                    </span>
                                    <span
                                        class="link"
                                        @click="handleDownloadPem">
                                        {{ $t('chainOrg.downloadPem') }}
                                    </span>
                                </el-form-item>
                            </template>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="tabs-wrapper">
                <el-tabs type="border-card">
                    <el-tab-pane :label="$t('chainOrg.nodeList')">
                        <chainOrgNode
                            :nodeTypeList="nodeTypeList"
                            :orgId="chainOrgDetail.id"/>
                    </el-tab-pane>
                    <el-tab-pane :label="$t('chainOrg.chainUserList')">
                        <chainOrgUser
                            :userTypeList="userTypeList"
                            :accountList="accountList"
                            :orgId="chainOrgDetail.id"/>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <certViewDialog
            :visible="certViewVisible"
            :certType="1"
            :id="Number(chainOrgDetail.id)"
            @close="certViewVisible = false"/>
        <keyViewDialog
            :visible="pemViewVisible"
            :keyType="1"
            :id="Number(chainOrgDetail.id)"
            @close="pemViewVisible = false"/>
    </div>
</template>

<script>
import {
    getChainOrgDetail,
    downloadChainOrgCert,
    downloadChainOrgKey
} from "@/util/api";
import contentHead from "@/components/contentHead";
import chainOrgNode from "./node/index";
import chainOrgUser from "./user/index";
import certViewDialog from "./components/certViewDialog";
import keyViewDialog from "./components/keyViewDialog";
export default {
    name: 'chainOrgDetail',
    components: {
        contentHead,
        chainOrgNode,
        chainOrgUser,
        certViewDialog,
        keyViewDialog
    },
    data() {
        return {
            accountId: localStorage.getItem('userId'),
            role: localStorage.getItem('root'),
            chainIdentityModel: this.$configOpt('chainIdentityModel'), // 身份模式配置
            certViewVisible: false,
            pemViewVisible: false,
            chainOrgDetail: {},
            nodeTypeList: [],
            userTypeList: [],
            accountList: []
        };
    },
    computed: {
    },
    mounted() {
        this.fetchChainOrgDetail();
    },
    methods: {
        fetchChainOrgDetail() {
            let orgId = this.$route.params.id;
            if (!orgId) {
                return;
            }
            this.loading = true;
            getChainOrgDetail(orgId).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.chainOrgDetail = res.data.data && res.data.data.orgDetail || {};
                    this.nodeTypeList = res.data.data && res.data.data.nodeType || [];
                    this.userTypeList = res.data.data && res.data.data.userType || [];
                    this.accountList = res.data.data && res.data.data.accounts || [];
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
        // 查看组织证书
        handleViewCert() {
            if (!this.chainOrgDetail.id) {
                return;
            }
            this.certViewVisible = true;
        },
        // 查看组织公钥
        handleViewPem() {
            if (!this.chainOrgDetail.id) {
                return;
            }
            this.pemViewVisible = true;
        },
        // 下载组织证书
        handleDownloadCert() {
            if (!this.chainOrgDetail.id) {
                return;
            }
            this.loading = true;
            downloadChainOrgCert({
                certType: 1,
                id: this.chainOrgDetail.id
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
        // 下载组织公钥
        handleDownloadPem() {
            if (!this.chainOrgDetail.id) {
                return;
            }
            this.loading = true;
            downloadChainOrgKey({
                type: 1,
                id: this.chainOrgDetail.id
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
        goBack() {
            this.$router.push({
                path: '/chainOrgMgmt'
            });
        }
    }
};
</script>

<style scoped>
.org-info .org-info-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 30px 50px 20px 50px;
}
.org-info .org-info-header .org-info-title {
    font-weight: bold;
    font-size: 18px;
}
.org-info .el-form >>> .el-form-item {
    margin-bottom: 0;
}
.org-info .el-form >>> .el-form-item .link:hover {
    text-decoration: underline;
}
.tabs-wrapper {
    padding: 20px 40px 50px 40px;
}
</style>
