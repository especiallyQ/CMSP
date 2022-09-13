<template>
    <div>
        <el-form
            :model="chainOrgForm"
            :rules="rules"
            ref="chainOrgForm"
            label-width="110px"
            class="ruleForm">
            <el-form-item
                :label="$t('chainOrg.name')"
                prop="name">
                <el-input
                    v-model="chainOrgForm.name"
                    :placeholder="$t('chainOrg.inputName')"
                    maxlength="32"
                    :disabled="chainOrgForm.nameDisabled">
                </el-input>
            </el-form-item>
            <el-form-item
                :label="$t('chainOrg.creatorAccount')"
                prop="creator"
                v-if="chainOrgForm.creatorShow">
                <el-input
                    v-model="chainOrgForm.creator"
                    :disabled="true">
                </el-input>
            </el-form-item>
            <el-form-item
                :label="$t('chainOrg.accountGroup')"
                prop="group"
                v-if="chainOrgForm.groupShow">
                <el-input
                    v-model="chainOrgForm.group"
                    :disabled="true">
                </el-input>
            </el-form-item>
            <template v-if="chainIdentityModel === 'CA'">
                <el-form-item
                    :label="$t('chainOrg.uploadCertification')"
                    prop="uploadFlag"
                    v-if="!chainOrgForm.hideCertSwitch">
                    <el-switch
                        v-model="chainOrgForm.uploadFlag"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item
                    :class="['is-required', 'noselect']"
                    :label="$t('chainOrg.cert')"
                    prop="signCert"
                    v-show="chainOrgForm.uploadFlag">
                    <el-upload
                        class="custom-upload"
                        action="none"
                        :on-remove="onSignRemove"
                        :file-list="signFileList"
                        :on-change="onSignChange"
                        :show-file-list="true"
                        :multiple="false"
                        :limit="1"
                        :auto-upload="false"
                        :on-exceed="handleExceed"
                        accept=".crt"
                        :disabled="chainOrgForm.signCertDisabled">
                        <el-button slot="trigger" size="small" type="primary"
                            :disabled="chainOrgForm.signCertDisabled">
                            {{ $t('text.upLoadFile') }}
                        </el-button>
                        <div slot="tip" class="el-upload__tip">
                            {{ $t('chainOrg.certUploadTip') }}
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item
                    :class="['is-required', 'noselect']"
                    :label="$t('chainOrg.certKey')"
                    prop="signKey"
                    v-show="chainOrgForm.uploadFlag">
                    <el-upload
                        class="custom-upload"
                        action="none"
                        :on-remove="onSignKeyRemove"
                        :file-list="signKeyFileList"
                        :on-change="onSignKeyChange"
                        :show-file-list="true"
                        :multiple="false"
                        :limit="1"
                        :auto-upload="false"
                        :on-exceed="handleExceed"
                        accept=".key"
                        :disabled="chainOrgForm.signKeyDisabled">
                        <el-button slot="trigger" size="small" type="primary"
                            :disabled="chainOrgForm.signKeyDisabled">
                            {{ $t('text.upLoadFile') }}
                        </el-button>
                        <div slot="tip" class="el-upload__tip">
                            {{ $t('chainOrg.certKeyUploadTip') }}
                        </div>
                    </el-upload>
                </el-form-item>
            </template>
            <template v-else-if="chainIdentityModel === 'PWK'">
                <el-form-item
                    :label="$t('chainOrg.uploadPublicKeyIdentity')"
                    prop="isUploadPKI"
                    v-if="!chainOrgForm.hidePKISwitch">
                    <el-switch
                        v-model="chainOrgForm.isUploadPKI"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item
                    :class="['is-required', 'noselect']"
                    :label="$t('chainOrg.pemName')"
                    prop="orgPem"
                    v-show="chainOrgForm.isUploadPKI">
                    <el-upload
                        class="custom-upload"
                        action="none"
                        :on-remove="onPemRemove"
                        :file-list="pemFileList"
                        :on-change="onPemChange"
                        :show-file-list="true"
                        :multiple="false"
                        :limit="1"
                        :auto-upload="false"
                        :on-exceed="handleExceed"
                        accept=".pem"
                        :disabled="chainOrgForm.orgPemDisabled">
                        <el-button slot="trigger" size="small" type="primary"
                            :disabled="chainOrgForm.orgPemDisabled">
                            {{ $t('text.upLoadFile') }}
                        </el-button>
                        <div slot="tip" class="el-upload__tip">
                            {{ $t('chainOrg.pemUploadTip') }}
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item
                    :class="['is-required', 'noselect']"
                    :label="$t('chainOrg.keyName')"
                    prop="orgKey"
                    v-show="chainOrgForm.isUploadPKI">
                    <el-upload
                        class="custom-upload"
                        action="none"
                        :on-remove="onOrgKeyRemove"
                        :file-list="orgKeyFileList"
                        :on-change="onOrgKeyChange"
                        :show-file-list="true"
                        :multiple="false"
                        :limit="1"
                        :auto-upload="false"
                        :on-exceed="handleExceed"
                        accept=".key"
                        :disabled="chainOrgForm.orgKeyDisabled">
                        <el-button slot="trigger" size="small" type="primary"
                            :disabled="chainOrgForm.orgKeyDisabled">
                            {{ $t('text.upLoadFile') }}
                        </el-button>
                        <div slot="tip" class="el-upload__tip">
                            {{ $t('chainOrg.keyUploadTip') }}
                        </div>
                    </el-upload>
                </el-form-item>
            </template>
            <el-form-item
                :label="$t('text.remarks')"
                prop="remarks"
                v-if="chainOrgForm.remarkShow">
                <el-input
                    v-model="chainOrgForm.remarks"
                    :rows="5"
                    type="textarea"
                    resize="none">
                </el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('chainOrgForm')" :loading="loading">
                {{this.$t('text.sure')}}
            </el-button>
        </div>
    </div>
</template>

<script>
import {
    addChainOrg,
    updateChainOrg
} from '@/util/api';
export default {
    name: 'chainOrgDialog',
    props: {
        dialogOptions: { type: Object }
    },
    watch: {
        'dialogOptions.type': {
            handler(val) {
                this.type = val;
                switch (val) {
                    case 'create':
                        this.chainOrgForm = {
                            name: '',
                            nameDisabled: false,
                            creator: this.dialogOptions.data.creator,
                            creatorShow: true,
                            group: this.dialogOptions.data.accountGroupName,
                            groupShow: true,
                            remarks: '',
                            remarkShow: true,
                            signCert: '',
                            signCertDisabled: false,
                            signKey: '',
                            signKeyDisabled: false,
                            hideCertSwitch: this.dialogOptions.data.hideCertSwitch || false,
                            uploadFlag: this.dialogOptions.data.uploadFlag || false,
                            orgPem: '',
                            orgPemDisabled: false,
                            orgKey: '',
                            orgKeyDisabled: false,
                            hidePKISwitch: this.dialogOptions.data.hideCertSwitch || false,
                            isUploadPKI: this.dialogOptions.data.uploadFlag || false
                        };
                        this.signFileList = [];
                        this.signKeyFileList = [];
                        this.pemFileList = [];
                        this.orgKeyFileList = [];
                        break;
                    case 'modify':
                        this.chainOrgForm = {
                            name: this.dialogOptions.data.orgName,
                            nameDisabled: false,
                            creator: this.dialogOptions.data.creator,
                            creatorShow: true,
                            group: this.dialogOptions.data.accountGroupName,
                            groupShow: true,
                            remarks: this.dialogOptions.data.remarks,
                            remarkShow: true,
                            signCert: this.dialogOptions.data.signCert,
                            signCertDisabled: true,
                            signKey: this.dialogOptions.data.signKey,
                            signKeyDisabled: true,
                            hideCertSwitch: true,
                            uploadFlag: false,
                            orgPem: this.dialogOptions.data.publicKeyFile,
                            orgPemDisabled: true,
                            orgKey: this.dialogOptions.data.privateKeyFile,
                            orgKeyDisabled: true,
                            hidePKISwitch: true,
                            isUploadPKI: false
                        };

                        if (this.chainOrgForm.signCert) {
                            this.signFileList = [{
                                name: this.getUploadFileName(this.chainOrgForm.signCert)
                            }];
                        } else {
                            this.signFileList = [];
                        }

                        if (this.chainOrgForm.signKey) {
                            this.signKeyFileList = [{
                                name: this.getUploadFileName(this.chainOrgForm.signKey)
                            }];
                        } else {
                            this.signKeyFileList = [];
                        }

                        if (this.chainOrgForm.orgPem) {
                            this.pemFileList = [{
                                name: this.getUploadFileName(this.chainOrgForm.orgPem)
                            }];
                        } else {
                            this.pemFileList = [];
                        }

                        if (this.chainOrgForm.orgKey) {
                            this.orgKeyFileList = [{
                                name: this.getUploadFileName(this.chainOrgForm.orgKey)
                            }];
                        } else {
                            this.orgKeyFileList = [];
                        }
                        break;
                }
            },
            deep: true,
            immediate: true
        },
        signFileList(nval, oval) {
            let file = nval && nval[0];
            this.chainOrgForm.signCert = file && file.name || '';
        },
        signKeyFileList(nval, oval) {
            let file = nval && nval[0];
            this.chainOrgForm.signKey = file && file.name || '';
        },
        pemFileList(nval, oval) {
            let file = nval && nval[0];
            this.chainOrgForm.orgPem = file && file.name || '';
        },
        orgKeyFileList(nval, oval) {
            let file = nval && nval[0];
            this.chainOrgForm.orgKey = file && file.name || '';
        }
    },
    data() {
        return {
            type: this.dialogOptions.type,
            chainIdentityModel: this.$configOpt('chainIdentityModel'), // 身份模式配置
            loading: false,
            chainOrgForm: {
                name: '',
                nameDisabled: true,
                creator: '',
                creatorShow: true,
                group: '',
                groupShow: true,
                remarks: '',
                remarkShow: true,
                signCert: '',
                signCertDisabled: false,
                signKey: '',
                signKeyDisabled: false,
                orgPem: '',
                orgPemDisabled: false,
                orgKey: '',
                orgKeyDisabled: false
            },
            signFileList: [], // 签名证书文件
            signKeyFileList: [], // 签名密钥文件
            pemFileList: [], // 公钥文件
            orgKeyFileList: [] // 私钥文件
        };
    },
    computed: {
        rules() {
            let data = {
                name: [{
                    required: true,
                    message: this.$t('chainOrg.inputName'),
                    trigger: 'blur'
                }, {
                    min: 1,
                    max: 32,
                    message: this.$t('rule.textLong'),
                    trigger: 'blur'
                }],
                signCert: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (!this.chainOrgForm.uploadFlag) {
                            callback();
                            return;
                        }
                        if (!this.signFileList.length) {
                            callback(new Error(this.$t('chainOrg.certRequired')));
                            return;
                        }
                        let file = this.signFileList && this.signFileList[0];
                        let idx = file.name.lastIndexOf('.');
                        let suffix = idx != -1 ? file.name.substring(idx + 1) : '';
                        suffix = suffix.toLowerCase();
                        if (suffix != 'crt') {
                            callback(new Error(this.$t('chainOrg.uploadCertInvalid')));
                        } else if (file.raw && !file.size) {
                            callback(new Error(this.$t('text.uploadFileEmpty')));
                        } else if (file.size > 1 * 1024 * 1024) {
                            callback(new Error(this.$t('chainOrg.uploadCertSizeExceedsLmit')));
                        } else {
                            callback();
                        }
                    }
                }],
                signKey: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (!this.chainOrgForm.uploadFlag) {
                            callback();
                            return;
                        }
                        if (!this.signKeyFileList.length) {
                            callback(new Error(this.$t('chainOrg.certKeyRequired')));
                            return;
                        }
                        let file = this.signKeyFileList && this.signKeyFileList[0];
                        let idx = file.name.lastIndexOf('.');
                        let suffix = idx != -1 ? file.name.substring(idx + 1) : '';
                        suffix = suffix.toLowerCase();
                        if (suffix != 'key') {
                            callback(new Error(this.$t('chainOrg.uploadCertInvalid')));
                        } else if (file.raw && !file.size) {
                            callback(new Error(this.$t('text.uploadFileEmpty')));
                        } else if (file.size > 1 * 1024 * 1024) {
                            callback(new Error(this.$t('chainOrg.uploadCertSizeExceedsLmit')));
                        } else {
                            callback();
                        }
                    }
                }],
                orgPem: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (!this.chainOrgForm.isUploadPKI) {
                            callback();
                            return;
                        }
                        if (!this.pemFileList.length) {
                            callback(new Error(this.$t('chainOrg.pemRequired')));
                            return;
                        }
                        let file = this.pemFileList && this.pemFileList[0];
                        let idx = file.name.lastIndexOf('.');
                        let suffix = idx != -1 ? file.name.substring(idx + 1) : '';
                        suffix = suffix.toLowerCase();
                        if (suffix != 'pem') {
                            callback(new Error(this.$t('chainOrg.uploadPemInvalid')));
                        } else if (file.raw && !file.size) {
                            callback(new Error(this.$t('text.uploadFileEmpty')));
                        } else if (file.size > 1 * 1024 * 1024) {
                            callback(new Error(this.$t('chainOrg.uploadPemSizeExceedsLmit')));
                        } else {
                            callback();
                        }
                    }
                }],
                orgKey: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (!this.chainOrgForm.isUploadPKI) {
                            callback();
                            return;
                        }
                        if (!this.orgKeyFileList.length) {
                            callback(new Error(this.$t('chainOrg.keyRequired')));
                            return;
                        }
                        let file = this.orgKeyFileList && this.orgKeyFileList[0];
                        let idx = file.name.lastIndexOf('.');
                        let suffix = idx != -1 ? file.name.substring(idx + 1) : '';
                        suffix = suffix.toLowerCase();
                        if (suffix != 'key') {
                            callback(new Error(this.$t('chainOrg.uploadKeyInvalid')));
                        } else if (file.raw && !file.size) {
                            callback(new Error(this.$t('text.uploadFileEmpty')));
                        } else if (file.size > 1 * 1024 * 1024) {
                            callback(new Error(this.$t('chainOrg.uploadKeySizeExceedsLmit')));
                        } else {
                            callback();
                        }
                    }
                }]
            }
            return data;
        }
    },
    mounted() {
    },
    methods: {
        modelClose() {
            this.$emit('close', false);
        },
        // 表单提交事件
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.submitChainOrg();
                } else {
                    return false;
                }
            });
        },
        submitChainOrg() {
            let type = this.type;
            switch (type) {
                case 'create':
                    this.createChainOrg();
                    break;
                case 'modify':
                    this.modifyChainOrg();
                    break;
            }
        },
        // 新建组织
        createChainOrg() {
            let formData = new FormData();
            formData.append('orgName', this.chainOrgForm.name);
            formData.append('description', this.chainOrgForm.remarks);
            if (this.chainIdentityModel === 'CA') {
                if (this.chainOrgForm.uploadFlag) {
                    let signCertBlob = this.signFileList && this.signFileList[0]
                        && this.signFileList[0].raw;
                    if (signCertBlob) {
                        formData.append('certFile', signCertBlob);
                    } else {
                        formData.append('certFile', null);
                    }
                    let signKeyBlob = this.signKeyFileList && this.signKeyFileList[0]
                        && this.signKeyFileList[0].raw;
                    if (signKeyBlob) {
                        formData.append('keyFile', signKeyBlob);
                    } else {
                        formData.append('keyFile', null);
                    }
                }
            } else if (this.chainIdentityModel === 'PWK') {
                if (this.chainOrgForm.isUploadPKI) {
                    let orgPemBlob = this.pemFileList && this.pemFileList[0]
                        && this.pemFileList[0].raw;
                    if (orgPemBlob) {
                        formData.append('publicKeyFile', orgPemBlob);
                    } else {
                        formData.append('publicKeyFile', null);
                    }
                    let orgKeyBlob = this.orgKeyFileList && this.orgKeyFileList[0]
                        && this.orgKeyFileList[0].raw;
                    if (orgKeyBlob) {
                        formData.append('privateKeyFile', orgKeyBlob);
                    } else {
                        formData.append('privateKeyFile', null);
                    }
                }
            }

            addChainOrg(formData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('text.addSuccess')
                    });
                    this.modelClose();
                    this.$emit('success');
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
        // 编辑组织
        modifyChainOrg() {
            let formData = new FormData();
            formData.append('id', this.dialogOptions.data.orgId);
            formData.append('orgName', this.chainOrgForm.name);
            formData.append('description', this.chainOrgForm.remarks);
            if (this.chainIdentityModel === 'CA') {
                if (this.chainOrgForm.uploadFlag) {
                    let signCertBlob = this.signFileList && this.signFileList[0]
                        && this.signFileList[0].raw;
                    if (signCertBlob) {
                        formData.append('signCertFile', signCertBlob);
                    } else {
                        formData.append('signCertFile', null);
                    }
                    let signKeyBlob = this.signKeyFileList && this.signKeyFileList[0]
                        && this.signKeyFileList[0].raw;
                    if (signKeyBlob) {
                        formData.append('signKeyFile', signKeyBlob);
                    } else {
                        formData.append('signKeyFile', null);
                    }
                }
            } else if (this.chainIdentityModel === 'PWK') {
                if (this.chainOrgForm.isUploadPKI) {
                    let orgPemBlob = this.pemFileList && this.pemFileList[0]
                        && this.pemFileList[0].raw;
                    if (orgPemBlob) {
                        formData.append('pemFile', orgPemBlob);
                    } else {
                        formData.append('pemFile', null);
                    }
                    let orgKeyBlob = this.orgKeyFileList && this.orgKeyFileList[0]
                        && this.orgKeyFileList[0].raw;
                    if (orgKeyBlob) {
                        formData.append('keyFile', orgKeyBlob);
                    } else {
                        formData.append('keyFile', null);
                    }
                }
            }

            updateChainOrg(formData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('text.updateSuccessMsg')
                    });
                    this.modelClose();
                    this.$emit('success');
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
        // 从路径中截取上传文件的文件名
        getUploadFileName(path) {
            if (!path) {
                return '';
            }
            let idx = path.lastIndexOf('/');
            if (idx == -1) {
                idx = path.lastIndexOf('\\');
            }
            return path.substring(idx + 1);
        },
        handleExceed() {
            this.$message.warning(this.$t('text.oneUploadFileTip'));
        },
        // 移除待上传的签名证书
        onSignRemove(file, fileList) {
            this.signFileList = fileList;
            this.$nextTick(() => {
                this.$refs.chainOrgForm.validateField('signCert');
            });
        },
        // 删除待上传的签名密钥
        onSignKeyRemove(file, fileList) {
            this.signKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.chainOrgForm.validateField('signKey');
            });
        },
        // 移除待上传的公钥
        onPemRemove(file, fileList) {
            this.pemFileList = fileList;
            this.$nextTick(() => {
                this.$refs.chainOrgForm.validateField('orgPem');
            });
        },
        // 移除待上传的私钥
        onOrgKeyRemove(file, fileList) {
            this.orgKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.chainOrgForm.validateField('orgKey');
            });
        },
        // 变更签名证书文件
        onSignChange(file, fileList) {
            this.signFileList = fileList;
            this.$nextTick(() => {
                this.$refs.chainOrgForm.validateField('signCert');
            });
        },
        // 变更签名密钥文件
        onSignKeyChange(file, fileList) {
            this.signKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.chainOrgForm.validateField('signKey');
            });
        },
        // 变更公钥文件
        onPemChange(file, fileList) {
            this.pemFileList = fileList;
            this.$nextTick(() => {
                this.$refs.chainOrgForm.validateField('orgPem');
            });
        },
        // 变更私钥文件
        onOrgKeyChange(file, fileList) {
            this.orgKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.chainOrgForm.validateField('orgKey');
            });
        }
    }
}
</script>

<style scoped>
.dialog-footer {
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
}
.isNone {
    display: none;
}
.isShow {
    display: block;
}
.ruleForm >>> .el-form-item__error {
    padding-top: 2px;
}
.ruleForm .custom-upload .el-upload__tip {
    display: inline-block;
    margin-top: 0;
    color: #999;
    line-height: 36px;
    padding-left: 20px;
}
.ruleForm .custom-upload >>> .el-upload-list__item:first-child {
    margin-top: 4px;
}
</style>
