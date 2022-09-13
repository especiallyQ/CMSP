<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogTitle"
        width="500px"
        :append-to-body="true"
        :center="true"
        class="dialog-wrapper"
        :close-on-click-modal="false">
        <div class="node-form-wrapper">
            <el-form
                ref="nodeForm"
                :model="formData"
                :rules="rules"
                label-width="100px">
                <el-form-item
                    :label="$t('chainNode.nodeName')"
                    prop="nodeName">
                    <el-input
                        v-model="formData.nodeName"
                        :placeholder="$t('chainNode.inputNodeName')"
                        maxlength="30">
                    </el-input>
                </el-form-item>
                <el-form-item
                    :label="$t('chainNode.nodeAddr')"
                    prop="nodeAddress">
                    <el-input
                        v-model="formData.nodeAddress"
                        :placeholder="$t('chainNode.inputNodeAddr')"
                        maxlength="30"
                        :disabled="!isNodeOffline()">
                    </el-input>
                </el-form-item>
                <el-form-item
                    :label="$t('chainNode.nodePort')"
                    prop="nodePort">
                    <el-input
                        v-model="formData.nodePort"
                        :placeholder="$t('chainNode.inputNodePort')"
                        maxlength="5"
                        :disabled="!isNodeOffline()">
                    </el-input>
                </el-form-item>
                <el-form-item
                    :label="$t('chainNode.nodeMonitorPort')"
                    prop="monitorPort">
                    <el-input
                        v-model="formData.monitorPort"
                        :placeholder="$t('chainNode.inputNodeMonitorPort')"
                        maxlength="5"
                        :disabled="!isNodeOffline()">
                    </el-input>
                </el-form-item>
                <el-form-item
                    :label="$t('chainNode.nodeP2pPort')"
                    prop="p2pPort">
                    <el-input
                        v-model="formData.p2pPort"
                        :placeholder="$t('chainNode.inputNodeP2pPort')"
                        maxlength="5"
                        :disabled="!isNodeOffline()">
                    </el-input>
                </el-form-item>
                <el-form-item
                    :label="$t('chainNode.nodeType')"
                    prop="nodeType">
                    <el-select
                        v-model="formData.nodeType"
                        :placeholder="$t('chainNode.selectNodeType')"
                        :disabled="disabled()">
                        <el-option
                            v-for="item in nodeTypeList"
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
                        prop="nodeSignCert"
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
                        prop="nodeSignKey"
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
                        prop="nodeTlsCert"
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
                        prop="nodeTlsKey"
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
                            inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                    <el-form-item
                        :class="['is-required', 'noselect']"
                        :label="$t('chainOrg.pemName')"
                        prop="nodePem"
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
                        prop="nodeKey"
                        v-show="!disabled() && formData.isUploadPKI">
                        <el-upload
                            class="custom-upload"
                            action="none"
                            :on-remove="onNodeKeyRemove"
                            :file-list="nodeKeyFileList"
                            :on-change="onNodeKeyChange"
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
                    :label="$t('chainNode.remarks')"
                    prop="description">
                    <el-input
                        v-model="formData.description"
                        type="textarea"
                        :placeholder="$t('chainNode.remarks')"
                        :rows="2"
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
    modifyChainOrgNode,
    addChainOrgNode
} from "@/util/api";
export default {
    name: 'nodeFormDialog',
    props: {
        visible: {
            type: Boolean,
            required: false,
            default: false
        },
        nodeTypeList: {
            type: Array,
            required: false,
            default: () => {
                return [];
            }
        },
        nodeData: {
            type: Object,
            required: true
        }
    },
    computed: {
        dialogTitle() {
            return this.nodeData.model == 1 ? this.$t('chainNode.nodeAddText')
                : this.$t('chainNode.nodeModifyText');
        }
    },
    watch: {
        visible(nval, oval) {
            this.dialogVisible = nval;
            if (!this.dialogVisible) {
                return;
            }
            if (this.nodeData.model == 1) {// 新增
                this.formData = Object.assign({
                    nodeName: '',
                    nodeAddress: null,
                    nodePort: null,
                    monitorPort: null,
                    p2pPort: null,
                    nodeType: null,
                    description: '',
                    nodeSignCert: '',
                    nodeSignKey: '',
                    nodeTlsCert: '',
                    nodeTlsKey: '',
                    nodePem: '',
                    nodeKey: '',
                    chainId: null
                }, this.nodeData);
                this.signFileList = [];
                this.signKeyFileList = [];
                this.tlsFileList = [];
                this.tlsKeyFileList = [];
                this.pemFileList = [];
                this.nodeKeyFileList = [];
            } else {// 修改
                this.formData = Object.assign({}, this.nodeData);
                if (this.nodeData.nodeSignCert) {
                    this.signFileList = [{
                        name: this.getUploadFileName(this.nodeData.nodeSignCert)
                    }];
                } else {
                    this.signFileList = [];
                }

                if (this.nodeData.nodeSignKey) {
                    this.signKeyFileList = [{
                        name: this.getUploadFileName(this.nodeData.nodeSignKey)
                    }];
                } else {
                    this.signKeyFileList = [];
                }

                if (this.nodeData.nodeTlsCert) {
                    this.tlsFileList = [{
                        name: this.getUploadFileName(this.nodeData.nodeTlsCert)
                    }];
                } else {
                    this.tlsFileList = [];
                }

                if (this.nodeData.nodeTlsKey) {
                    this.tlsKeyFileList = [{
                        name: this.getUploadFileName(this.nodeData.nodeTlsKey)
                    }];
                } else {
                    this.tlsKeyFileList = [];
                }

                if (this.nodeData.publicKeyFile) {
                    this.pemFileList = [{
                        name: this.getUploadFileName(this.nodeData.publicKeyFile)
                    }];
                } else {
                    this.pemFileList = [];
                }

                if (this.nodeData.privateKeyFile) {
                    this.nodeKeyFileList = [{
                        name: this.getUploadFileName(this.nodeData.privateKeyFile)
                    }];
                } else {
                    this.nodeKeyFileList = [];
                }
            }
            this.$nextTick(() => {
                this.$refs.nodeForm.clearValidate();
            });
        },
        dialogVisible(nval, oval) {
            if (!nval) {
                this.modelClose();
            }
        },
        signFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.nodeSignCert = file && file.name || '';
        },
        signKeyFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.nodeSignKey = file && file.name || '';
        },
        tlsFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.nodeTlsCert = file && file.name || '';
        },
        tlsKeyFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.nodeTlsKey = file && file.name || '';
        },
        pemFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.nodePem = file && file.name || '';
        },
        nodeKeyFileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.nodeKey = file && file.name || '';
        }
    },
    data() {
        return {
            dialogVisible: this.visible || false,
            chainIdentityModel: this.$configOpt('chainIdentityModel'), // 身份模式配置
            loading: false,
            formData: {
                nodeName: '',
                nodeAddress: null,
                nodePort: null,
                monitorPort: null,
                p2pPort: null,
                nodeType: null,
                description: '',
                nodeSignCert: '',
                nodeSignKey: '',
                nodeTlsCert: '',
                nodeTlsKey: '',
                nodePem: '',
                nodeKey: '',
                chainId: null
            },
            rules: {
                nodeName: [{
                    required: true,
                    message: this.$t('chainNode.inputNodeName'),
                    trigger: 'blur'
                }],
                nodeAddress: [{
                    required: true,
                    message: this.$t('chainNode.inputNodeAddr'),
                    trigger: 'blur'
                }],
                nodePort: [{
                    required: true,
                    message: this.$t('chainNode.inputNodePort'),
                    trigger: 'blur'
                }, {
                    pattern: /^[0-9]+$/,
                    message: this.$t('rule.portRule'),
                    trigger: 'blur'
                }],
                monitorPort: [{
                    required: true,
                    message: this.$t('chainNode.inputNodeMonitorPort'),
                    trigger: 'blur'
                }, {
                    pattern: /^[0-9]+$/,
                    message: this.$t('rule.portRule'),
                    trigger: 'blur'
                }],
                p2pPort: [{
                    required: true,
                    message: this.$t('chainNode.inputNodeP2pPort'),
                    trigger: 'blur'
                }, {
                    pattern: /^[0-9]+$/,
                    message: this.$t('rule.portRule'),
                    trigger: 'blur'
                }],
                nodeType: [{
                    required: true,
                    message: this.$t('chainNode.selectNodeType'),
                    trigger: 'change'
                }],
                nodeSignCert: [{
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
                nodeSignKey: [{
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
                nodeTlsCert: [{
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
                nodeTlsKey: [{
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
                nodePem: [{
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
                nodeKey: [{
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.disabled() || !this.formData.isUploadPKI) {
                            callback();
                            return;
                        }
                        if (!this.nodeKeyFileList.length) {
                            callback(new Error(this.$t('chainOrg.keyRequired')));
                            return;
                        }
                        let file = this.nodeKeyFileList && this.nodeKeyFileList[0];
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
            nodeKeyFileList: []
        };
    },
    mounted() {
    },
    methods: {
        modelClose() {
            this.$emit('close', false);
        },
        disabled() {
            return this.nodeData.model != 1;
        },
        isNodeOffline() { // 节点是否离线
            // 不在应用链上且节点未运行
            return !this.formData.chainId && this.formData.nodeStatus != 1;
        },
        handleSubmit() {
            this.$refs.nodeForm.validate(valid => {
                if (!valid) {
                    return;
                }
                let formData = new FormData();
                Object.keys(this.formData).forEach((key, idx) => {
                    if (key != 'model') {
                        formData.append(key, this.formData[key]);
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
                        let nodePemBlob = this.pemFileList && this.pemFileList[0]
                            && this.pemFileList[0].raw;
                        if (nodePemBlob) {
                            formData.append('publicKeyFile', nodePemBlob);
                        } else {
                            formData.append('publicKeyFile', null);
                        }

                        let nodeKeyBlob = this.nodeKeyFileList && this.nodeKeyFileList[0]
                            && this.nodeKeyFileList[0].raw;
                        if (nodeKeyBlob) {
                            formData.append('privateKeyFile', nodeKeyBlob);
                        } else {
                            formData.append('privateKeyFile', null);
                        }
                    }
                }

                this.loading = true;
                let promiseObj;
                let message;
                if (this.nodeData.model == 1) {
                    promiseObj = addChainOrgNode(formData);
                    message = this.$t('text.addSuccess');
                } else {
                    promiseObj = modifyChainOrgNode(formData);
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
                this.$refs.nodeForm.validateField('nodeSignCert');
            });
        },
        onSignChange(file, fileList) {
            this.signFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodeSignCert');
            });
        },
        onSignKeyRemove(file, fileList) {
            this.signKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodeSignKey');
            });
        },
        onSignKeyChange(file, fileList) {
            this.signKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodeSignKey');
            });
        },
        onTlsRemove(file, fileList) {
            this.tlsFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodeTlsCert');
            });
        },
        onTlsChange(file, fileList) {
            this.tlsFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodeTlsCert');
            });
        },
        onTlsKeyRemove(file, fileList) {
            this.tlsKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodeTlsKey');
            });
        },
        onTlsKeyChange(file, fileList) {
            this.tlsKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodeTlsKey');
            });
        },
        // 删除待上传的公钥
        onPemRemove(file, fileList) {
            this.pemFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodePem');
            });
        },
        // 变更公钥文件
        onPemChange(file, fileList) {
            this.pemFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodePem');
            });
        },
        // 删除待上传的私钥
        onNodeKeyRemove(file, fileList) {
            this.nodeKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodeKey');
            });
        },
        // 变更私钥文件
        onNodeKeyChange(file, fileList) {
            this.nodeKeyFileList = fileList;
            this.$nextTick(() => {
                this.$refs.nodeForm.validateField('nodeKey');
            });
        }
    }
};
</script>

<style scoped>
.dialog-wrapper >>> .el-dialog {
    margin-top: 8vh!important;
}
.dialog-wrapper >>> .el-form-item__label {
    font-size: 12px;
    color: #737a86;
}
.dialog-wrapper >>> .el-upload-list__item:first-child {
    margin-top: 4px;
}
.node-form-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.node-form-wrapper .dialog-footer {
    text-align: right;
    margin-top: 10px;
    margin-right: -5px;
    padding-top: 12px;
    width: 100%;
}
.node-form-wrapper .el-form {
    width: 100%;
}
.node-form-wrapper .el-form .el-select {
    width: 100%;
}
.node-form-wrapper .custom-upload .el-upload__tip {
    display: inline-block;
    margin-top: 0;
    color: #999;
    line-height: 36px;
    padding-left: 20px;
}
</style>
