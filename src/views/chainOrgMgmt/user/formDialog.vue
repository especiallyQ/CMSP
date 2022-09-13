<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogTitle"
        width="500px"
        :append-to-body="true"
        :center="true"
        class="dialog-wrapper"
        :close-on-click-modal="false">
        <div class="user-form-wrapper">
            <el-form
                ref="userForm"
                :model="formData"
                :rules="rules"
                label-width="100px">
                <el-form-item
                    :label="$t('chainUser.userName')"
                    prop="userName">
                    <el-input
                        v-model="formData.userName"
                        :placeholder="$t('chainUser.inputUserName')"
                        maxlength="30">
                    </el-input>
                </el-form-item>
                <el-form-item
                    :label="$t('chainUser.account')"
                    prop="accountId">
                    <el-select
                        v-model="formData.accountId"
                        :filterable="true"
                        :no-data-text="$t('text.noData')"
                        :placeholder="$t('chainUser.selectAccount')"
                        :disabled="disabled()"
                        @change="changeUserTypeList">
                        <el-option
                            v-for="item in accountList"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                    <el-input
                        v-model="formData.account"
                        :placeholder="$t('chainUser.inputUserName')"
                        :disabled="true"
                        v-if="false">
                    </el-input>
                </el-form-item>
                <el-form-item
                    :label="$t('chainUser.userType')"
                    prop="userType">
                    <el-select
                        v-model="formData.userType"
                        :placeholder="$t('chainUser.selectUserType')"
                        :disabled="true">
                        <el-option
                            v-for="item in userTypeList"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <template v-if="chainIdentityModel === 'CA'">
                    <el-form-item
                        :label="$t('chainOrg.uploadCertification')"
                        prop="uploadFlag"
                        v-if="!disabled() && !formData.hideCertSwitch">
                        <el-switch
                            v-model="formData.uploadFlag"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                    <el-form-item
                        :class="['is-required', 'noselect']"
                        :label="$t('chainOrg.signCert')"
                        prop="userSignCert"
                        v-show="!disabled() && formData.uploadFlag">
                        <el-upload
                            class="custom-upload"
                            action="none"
                            :on-remove="onSignRemove"
                            :file-list="signFileList"
                            :on-change="onSignChange"
                            :show-file-list="true"
                            :multiple = "false"
                            :limit="1"
                            :auto-upload="false"
                            :on-exceed="handleExceed"
                            accept=".crt"
                            :disabled="disabled()">
                            <el-button slot="trigger" size="small" type="primary"
                                :disabled="disabled()">
                                {{ $t('text.upLoadFile') }}
                            </el-button>
                            <div slot="tip" class="el-upload__tip">
                                {{ $t('chainOrg.certUploadTip') }}
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item
                        :class="['is-required', 'noselect']"
                        :label="$t('chainOrg.signKey')"
                        prop="userSignKey"
                        v-show="!disabled() && formData.uploadFlag">
                        <el-upload
                            class="custom-upload"
                            action="none"
                            :on-remove="onSignKeyRemove"
                            :file-list="signKeyFileList"
                            :on-change="onSignKeyChange"
                            :show-file-list="true"
                            :multiple = "false"
                            :limit="1"
                            :auto-upload="false"
                            :on-exceed="handleExceed"
                            accept=".key"
                            :disabled="disabled()">
                            <el-button slot="trigger" size="small" type="primary"
                                :disabled="disabled()">
                                {{ $t('text.upLoadFile') }}
                            </el-button>
                            <div slot="tip" class="el-upload__tip">
                                {{ $t('chainOrg.certKeyUploadTip') }}
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item
                        :class="['is-required', 'noselect']"
                        :label="$t('chainOrg.tlsCert')"
                        prop="userTlsCert"
                        v-show="!disabled() && formData.uploadFlag">
                        <el-upload
                            class="custom-upload"
                            action="none"
                            :on-remove="onTlsRemove"
                            :file-list="tlsFileList"
                            :on-change="onTlsChange"
                            :show-file-list="true"
                            :multiple = "false"
                            :limit="1"
                            :auto-upload="false"
                            :on-exceed="handleExceed"
                            accept=".crt"
                            :disabled="disabled()">
                            <el-button slot="trigger" size="small" type="primary"
                                :disabled="disabled()">
                                {{ $t('text.upLoadFile') }}
                            </el-button>
                            <div slot="tip" class="el-upload__tip">
                                {{ $t('chainOrg.certUploadTip') }}
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item
                        :class="['is-required', 'noselect']"
                        :label="$t('chainOrg.tlsKey')"
                        prop="userTlsKey"
                        v-show="!disabled() && formData.uploadFlag">
                        <el-upload
                            class="custom-upload"
                            action="none"
                            :on-remove="onTlsKeyRemove"
                            :file-list="tlsKeyFileList"
                            :on-change="onTlsKeyChange"
                            :show-file-list="true"
                            :multiple = "false"
                            :limit="1"
                            :auto-upload="false"
                            :on-exceed="handleExceed"
                            accept=".key"
                            :disabled="disabled()">
                            <el-button slot="trigger" size="small" type="primary"
                                :disabled="disabled()">
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
                        v-if="!disabled() && !formData.hidePKISwitch">
                        <el-switch
                            v-model="formData.isUploadPKI"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :disabled="uploadPKIDisabled">
                        </el-switch>
                    </el-form-item>
                    <el-form-item
                        :class="['is-required', 'noselect']"
                        :label="$t('chainOrg.pemName')"
                        prop="userPem"
                        v-show="!disabled() && formData.isUploadPKI">
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
                            :disabled="disabled()">
                            <el-button slot="trigger" size="small" type="primary"
                                :disabled="disabled()">
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
                        prop="userKey"
                        v-show="!disabled() && formData.isUploadPKI">
                        <el-upload
                            class="custom-upload"
                            action="none"
                            :on-remove="onUserKeyRemove"
                            :file-list="userKeyFileList"
                            :on-change="onUserKeyChange"
                            :show-file-list="true"
                            :multiple="false"
                            :limit="1"
                            :auto-upload="false"
                            :on-exceed="handleExceed"
                            accept=".key"
                            :disabled="disabled()">
                            <el-button slot="trigger" size="small" type="primary"
                                :disabled="disabled()">
                                {{ $t('text.upLoadFile') }}
                            </el-button>
                            <div slot="tip" class="el-upload__tip">
                                {{ $t('chainOrg.keyUploadTip') }}
                            </div>
                        </el-upload>
                    </el-form-item>
                </template>
                <el-form-item
                    :label="$t('chainUser.remarks')"
                    prop="description">
                    <el-input
                        v-model="formData.description"
                        type="textarea"
                        :placeholder="$t('chainUser.inputRemarks')"
                        :rows="5"
                        resize="none"
                        maxlength="120">
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button @click="modelClose">{{ $t('text.cancel') }}</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="loading">
                    {{ $t('text.sure') }}
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import {
    modifyChainOrgUser,
    addChainOrgUser
} from "@/util/api";
export default {
    name: 'userFormDialog',
    props: {
        visible: {
            type: Boolean,
            required: false,
            default: false
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
        },
        userData: {
            type: Object,
            required: true
        }
    },
    computed: {
        dialogTitle() {
            return this.userData.model == 1 ? this.$t('chainUser.userAddText')
                : this.$t('chainUser.userModifyText');
        }
    },
    watch: {
        visible(nval, oval) {
            this.dialogVisible = nval;
            if (!this.dialogVisible) {
                return;
            }
            if (this.userData.model == 1) {// 新增
                this.formData = Object.assign({
                    userName: '',
                    accountId: null,
                    userType: null,
                    description: '',
                    userSignCert: '',
                    userSignKey: '',
                    userTlsCert: '',
                    userTlsKey: '',
                    userPem: '',
                    userKey: ''
                }, this.userData);
                this.signFileList = [];
                this.signKeyFileList = [];
                this.tlsFileList = [];
                this.tlsKeyFileList = [];
                this.pemFileList = [];
                this.userKeyFileList = [];
            } else {// 修改
                this.formData = Object.assign({}, this.userData);
                if (this.userData.userSignCert) {
                    this.signFileList = [{
                        name: this.getUploadFileName(this.userData.userSignCert)
                    }];
                } else {
                    this.signFileList = [];
                }

                if (this.userData.userSignKey) {
                    this.signKeyFileList = [{
                        name: this.getUploadFileName(this.userData.userSignKey)
                    }];
                } else {
                    this.signKeyFileList = [];
                }

                if (this.userData.userTlsCert) {
                    this.tlsFileList = [{
                        name: this.getUploadFileName(this.userData.userTlsCert)
                    }];
                } else {
                    this.tlsFileList = [];
                }

                if (this.userData.userTlsKey) {
                    this.tlsKeyFileList = [{
                        name: this.getUploadFileName(this.userData.userTlsKey)
                    }];
                } else {
                    this.tlsKeyFileList = [];
                }

                if (this.userData.publicKeyFile) {
                    this.pemFileList = [{
                        name: this.getUploadFileName(this.userData.publicKeyFile)
                    }];
                } else {
                    this.pemFileList = [];
                }

                if (this.userData.privateKeyFile) {
                    this.userKeyFileList = [{
                        name: this.getUploadFileName(this.userData.privateKeyFile)
                    }];
                } else {
                    this.userKeyFileList = [];
                }
            }
            this.$nextTick(() => {
                this.$refs.userForm.clearValidate();
            });
        },
        dialogVisible(nval, oval) {
            if (!nval) {
                this.modelClose();
            }
        },
        signFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.userSignCert = file && file.name || '';
        },
        signKeyFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.userSignKey = file && file.name || '';
        },
        tlsFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.userTlsCert = file && file.name || '';
        },
        tlsKeyFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.userTlsKey = file && file.name || '';
        },
        pemFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.userPem = file && file.name || '';
        },
        userKeyFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.userKey = file && file.name || '';
        }
    },
    data() {
        return {
            dialogVisible: this.visible || false,
            chainIdentityModel: this.$configOpt('chainIdentityModel'), // 身份模式配置
            loading: false,
            formData: {
                userName: '',
                accountId: null,
                userType: null,
                description: '',
                userSignCert: '',
                userSignKey: '',
                userTlsCert: '',
                userTlsKey: '',
                userPem: '',
                userKey: ''
            },
            uploadPKIDisabled: false,
            rules: {
                userName: [{
                    required: true,
                    message: this.$t('chainUser.inputUserName'),
                    trigger: 'blur'
                }],
                accountId: [{
                    required: true,
                    message: this.$t('chainUser.selectAccount'),
                    trigger: 'change'
                }],
                userType: [{
                    required: true,
                    message: this.$t('chainUser.selectUserType'),
                    trigger: 'change'
                }],
                userSignCert: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.disabled() || !this.formData.uploadFlag) {
                            callback();
                            return;
                        }
                        if (!this.signFileList.length) {
                            callback(new Error(this.$t('chainOrg.signCertRequired')));
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
                userSignKey: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.disabled() || !this.formData.uploadFlag) {
                            callback();
                            return;
                        }
                        if (!this.signKeyFileList.length) {
                            callback(new Error(this.$t('chainOrg.signKeyRequired')));
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
                userTlsCert: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.disabled() || !this.formData.uploadFlag) {
                            callback();
                            return;
                        }
                        if (!this.tlsFileList.length) {
                            callback(new Error(this.$t('chainOrg.tlsCertRequired')));
                            return;
                        }
                        let file = this.tlsFileList && this.tlsFileList[0];
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
                userTlsKey: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.disabled() || !this.formData.uploadFlag) {
                            callback();
                            return;
                        }
                        if (!this.tlsKeyFileList.length) {
                            callback(new Error(this.$t('chainOrg.tlsKeyRequired')));
                            return;
                        }
                        let file = this.tlsKeyFileList && this.tlsKeyFileList[0];
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
                userPem: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.disabled() || !this.formData.isUploadPKI) {
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
                userKey: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.disabled() || !this.formData.isUploadPKI) {
                            callback();
                            return;
                        }
                        if (!this.userKeyFileList.length) {
                            callback(new Error(this.$t('chainOrg.keyRequired')));
                            return;
                        }
                        let file = this.userKeyFileList && this.userKeyFileList[0];
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
            },
            signFileList: [],
            signKeyFileList: [],
            tlsFileList: [],
            tlsKeyFileList: [],
            pemFileList: [],
            userKeyFileList: []
        };
    },
    mounted() {
    },
    methods: {
        modelClose() {
            this.$emit('close', false);
        },
        disabled() {
            return this.userData.model != 1;
        },
        handleSubmit() {
            this.$refs.userForm.validate(valid => {
                if (!valid) {
                    return;
                }
                let userData = Object.assign({}, this.formData);
                userData.userRole = userData.userType;
                delete userData.userType;
                let formData = new FormData();
                Object.keys(userData).forEach((key, idx) => {
                    if (key != 'model') {
                        formData.append(key, userData[key]);
                    }
                });
                if (this.chainIdentityModel === 'CA') {
                    if (this.formData.uploadFlag) {
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
                        let tlsCertBlob = this.tlsFileList && this.tlsFileList[0]
                                && this.tlsFileList[0].raw;
                        if (tlsCertBlob) {
                            formData.append('tlsCertFile', tlsCertBlob);
                        } else {
                            formData.append('tlsCertFile', null);
                        }
                        let tlsKeyBlob = this.tlsKeyFileList && this.tlsKeyFileList[0]
                                && this.tlsKeyFileList[0].raw;
                        if (tlsKeyBlob) {
                            formData.append('tlsKeyFile', tlsKeyBlob);
                        } else {
                            formData.append('tlsKeyFile', null);
                        }
                    }
                } else if (this.chainIdentityModel === 'PWK') {
                    if (this.formData.isUploadPKI) {
                        let userPemBlob = this.pemFileList && this.pemFileList[0]
                            && this.pemFileList[0].raw;
                        if (userPemBlob) {
                            formData.append('publicKeyFile', userPemBlob);
                        } else {
                            formData.append('publicKeyFile', null);
                        }

                        let userKeyBlob = this.userKeyFileList && this.userKeyFileList[0]
                            && this.userKeyFileList[0].raw;
                        if (userKeyBlob) {
                            formData.append('privateKeyFile', userKeyBlob);
                        } else {
                            formData.append('privateKeyFile', null);
                        }
                    }
                }

                this.loading = true;
                let promiseObj;
                let message;
                if (this.userData.model == 1) {
                    promiseObj = addChainOrgUser(formData);
                    message = this.$t('text.addSuccess');
                } else {
                    promiseObj = modifyChainOrgUser(formData);
                    message = this.$t('text.updateSuccessMsg');
                }
                promiseObj.then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: message
                        });
                        this.modelClose();
                        this.$emit("success");
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
            });
        },
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
        onSignRemove(file, fileList) {
            this.signFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('userSignCert');
            });
        },
        onSignChange(file, fileList) {
            this.signFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('userSignCert');
            });
        },
        onSignKeyRemove(file, fileList) {
            this.signKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('userSignKey');
            });
        },
        onSignKeyChange(file, fileList) {
            this.signKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('userSignKey');
            });
        },
        onTlsRemove(file, fileList) {
            this.tlsFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('userTlsCert');
            });
        },
        onTlsChange(file, fileList) {
            this.tlsFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('userTlsCert');
            });
        },
        onTlsKeyRemove(file, fileList) {
            this.tlsKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('userTlsKey');
            });
        },
        onTlsKeyChange(file, fileList) {
            this.tlsKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('userTlsKey');
            });
        },
        // 删除待上传的公钥
        onPemRemove(file, fileList) {
            this.pemFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('userPem');
            });
        },
        // 变更公钥文件
        onPemChange(file, fileList) {
            this.pemFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('userPem');
            });
        },
        // 删除待上传的私钥
        onUserKeyRemove(file, fileList) {
            this.userKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('nodeKey');
            });
        },
        // 变更私钥文件
        onUserKeyChange(file, fileList) {
            this.userKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.userForm.validateField('nodeKey');
            });
        },
        // 根据链上用户类型需根据选择的账号类型变化
        changeUserTypeList(val) {
            if (!val) return;
            let accountId = val;
            for (let i = 0; i < this.accountList.length; i++) {
                if (this.accountList[i].code == accountId) {
                    let accountType = this.accountList[i].roleName;
                    if (accountType === 'PU_Operator' || accountType === 'AD_Admin') {
                        this.formData.userType = '4';
                        if (this.chainIdentityModel === 'PWK') {
                            this.formData.isUploadPKI = false;
                            this.uploadPKIDisabled = false;
                        }
                    } else if (accountType === 'PU_Admin') {
                        this.formData.userType = '3';
                        if (this.chainIdentityModel === 'PWK') {
                            this.formData.isUploadPKI = false;
                            this.uploadPKIDisabled = true;
                        }
                    }

                    if (this.chainIdentityModel === 'PWK') {
                        this.formData.userPem = '';
                        this.formData.userKey = '';
                        this.pemFileList = [];
                        this.userKeyFileList = [];
                    }
                }
            }
        }
    }
};
</script>

<style scoped>
.dialog-wrapper >>> .el-form-item__label {
    font-size: 12px;
    color: #737a86;
}
.dialog-wrapper >>> .el-upload-list__item:first-child {
    margin-top: 4px;
}
.user-form-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.user-form-wrapper .dialog-footer {
    text-align: right;
    margin-top: 10px;
    margin-right: -5px;
    padding-top: 12px;
    width: 100%;
}
.user-form-wrapper .el-form {
    width: 100%;
}
.user-form-wrapper .el-form .el-select {
    width: 100%;
}
.user-form-wrapper .custom-upload .el-upload__tip {
    display: inline-block;
    margin-top: 0;
    color: #999;
    line-height: 36px;
    padding-left: 20px;
}
</style>
