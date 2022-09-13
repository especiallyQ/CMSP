<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :title="$t('chainOrg.viewCertification')"
        :width="certType != 1 ? '800px' : '450px'"
        :append-to-body="true"
        :center="true"
        class="dialog-wrapper"
        :close-on-click-modal="false">
        <div class="cert-view-wrapper">
            <div class="cert-row">
                <div class="cert-content-wrapper">
                    <span class="title">
                        {{ certType != 1 ? $t('chainOrg.signCertification') : $t('chainOrg.certification') }}
                    </span>
                    <el-input
                        v-model="certData.signCertContent"
                        :rows="10"
                        resize="none"
                        readonly
                        type="textarea"/>
                </div>
                <div class="cert-content-wrapper ml20" v-if="certType != 1">
                    <span class="title">
                        {{ $t('chainOrg.tlsCertification') }}
                    </span>
                    <el-input
                        v-model="certData.tlsCertContent"
                        :rows="10"
                        resize="none"
                        readonly
                        type="textarea"/>
                </div>
            </div>
            <div class="cert-row">
                <div class="cert-content-wrapper">
                    <span class="title">
                        {{ certType != 1 ? $t('chainOrg.signCertificationExpiryTime') : $t('chainOrg.certificationExpiryTime') }}
                    </span>
                    <el-input
                        v-model="certData.signCertExpiryTime"
                        readonly/>
                </div>
                <div class="cert-content-wrapper ml20" v-if="certType != 1">
                    <span class="title">{{ $t('chainOrg.tlsCertificationExpiryTime') }}</span>
                    <el-input
                        v-model="certData.tlsCertExpiryTime"
                        readonly/>
                </div>
            </div>
            <div class="dialog-footer">
                <el-button @click="modelClose">{{ $t('text.close') }}</el-button>
                <el-button
                    type="primary"
                    :loading="loading"
                    :disabled="signCertRenewalDisabled()"
                    @click="handleRenewalCert(certData.signCertOrgId, certData.signCertSn)">
                    {{ certType != 1 ? $t('chainOrg.signCertificationRenewal') : $t('chainOrg.certificationRenewal') }}
                </el-button>
                <el-button
                    type="primary"
                    :loading="loading"
                    :disabled="tlsCertRenewalDisabled()"
                    @click="handleRenewalCert(certData.tlsCertOrgId, certData.tlsCertSn)"
                    v-if="certType != 1">
                    {{ $t('chainOrg.tlsCertificationRenewal') }}
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import {
    viewChainOrgCert,
    renewalChainOrgCert
} from "@/util/api";
import { getDate } from "@/util/util";
export default {
    name: 'certViewDialog',
    props: {
        visible: {
            type: Boolean,
            required: false,
            default: false
        },
        certType: {
            // 1组织证书，2节点证书，3用户证书
            type: Number,
            required: false,
            default: null
        },
        id: {
            type: Number,
            required: false,
            default: null
        }
    },
    watch: {
        visible(nval, oval) {
            this.dialogVisible = nval;
            if (nval) {
                this.delayFetchData();
            }
        },
        dialogVisible(nval, oval) {
            if (!nval) {
                this.modelClose();
            }
        }
    },
    data() {
        return {
            lang: localStorage.getItem('lang') || 'zh',
            role: localStorage.getItem('root'),
            dialogVisible: this.visible || false,
            loading: false,
            certData: {}
        };
    },
    mounted() {
    },
    methods: {
        modelClose() {
            this.$emit('close', false);
        },
        delayFetchData(ms) {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.timer = null;
                this.fetchData();
            }, ms || 20);
        },
        getDateTime(seconds) {
            return isNaN(seconds) ? null : seconds * 1000;
        },
        renewalBtnDisabled(ms) {
            if (ms == null) {
                return true;
            }
            if (ms - new Date().getTime() < 4 * 365 * 24 * 60 * 60 * 1000) {
                // 距离过期时间小于4年时，允许续签
                return false;
            }
            return true;
        },
        fetchData() {
            this.certData = {};
            if (this.certType == null || this.id == null) {
                return;
            }
            this.loading = true;
            viewChainOrgCert({
                certType: this.certType,
                id: this.id
            }).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let certList = res.data.data || [];
                    certList.forEach(cert => {
                        if (cert.certUsage == 'sign') {
                            this.certData.signCertContent = cert.certContent;
                            let ms = this.getDateTime(cert.expirationDate);
                            this.certData.signCertExpiryTime = getDate(ms);
                            this.certData.signCertRenewalTooLong = this.renewalBtnDisabled(ms);
                            this.certData.signCertSn = cert.certSn;
                            this.certData.signCertOrgId = cert.chainOrgId;
                        } else if (cert.certUsage == 'tls') {
                            this.certData.tlsCertContent = cert.certContent;
                            let ms = this.getDateTime(cert.expirationDate);
                            this.certData.tlsCertExpiryTime = getDate(ms);
                            this.certData.tlsCertRenewalTooLong = this.renewalBtnDisabled(ms);
                            this.certData.tlsCertSn = cert.certSn;
                            this.certData.tlsCertOrgId = cert.chainOrgId;
                        }
                    });
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
        handleRenewalCert(orgId, certSn) {
            this.$confirm(this.$t('chainOrg.certificationRenewalConfirm'), {
                center: true
            }).then(() => {
                this.loading = true;
                orgId = (orgId + '').replaceAll('chainOrg', '');
                renewalChainOrgCert({
                    orgId: orgId,
                    certSn: certSn
                }).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$t('chainOrg.certificationRenewalSuccess')
                        });
                        this.fetchData();
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
        },
        signCertRenewalDisabled() {
            return !this.certData.signCertSn || this.certData.signCertRenewalTooLong;
        },
        tlsCertRenewalDisabled() {
            return !this.certData.tlsCertSn || this.certData.tlsCertRenewalTooLong;
        }
    }
};
</script>

<style scoped>
.cert-view-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.cert-view-wrapper .cert-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 25px;
}
.cert-view-wrapper .cert-row .cert-content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
}
.cert-view-wrapper .cert-row .cert-content-wrapper.ml20 {
    margin-left: 20px;
}
.cert-view-wrapper .cert-row .cert-content-wrapper .title {
    margin-bottom: 10px;
    font-size: 12px;
    color: #737a86;
}
.cert-view-wrapper .dialog-footer {
    text-align: right;
    margin-right: -5px;
    width: 100%;
}
</style>
