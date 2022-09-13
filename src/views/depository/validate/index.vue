<template>
    <div class="validate-depository-wrapper">
        <el-form
            ref="depositoryForm"
            :model="formData"
            :rules="rules"
            label-width="90px">
            <template v-for="item in parameterList">
                <template v-if="item.parameterType === 'file'">
                    <el-form-item
                        :label="item.parameterName"
                        :prop="item.parameterKey"
                        :class="['is-required', 'noselect']">
                        <el-upload
                            class="custom-upload"
                            action="none"
                            :on-remove="onFileRemove"
                            :file-list="fileList"
                            :on-change="onFileChange"
                            :show-file-list="true"
                            :multiple="false"
                            :limit="1"
                            :auto-upload="false"
                            :on-exceed="handleExceed">
                            <el-button slot="trigger" size="small" type="primary">
                                {{ $t('text.upLoadFile') }}
                            </el-button>
                            <div slot="tip" class="el-upload__tip"></div>
                        </el-upload>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item
                        :label="item.parameterName"
                        :prop="item.parameterKey">
                        <el-input
                            v-model="formData[item.parameterKey]"
                            :disabled="true">
                        </el-input>
                    </el-form-item>
                </template>
            </template>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">
                {{ $t('text.cancel') }}
            </el-button>
            <el-button type="primary"
                @click="handleSubmit"
                :loading="loading">
                {{ $t('depository.validateBtn') }}
            </el-button>
        </div>
    </div>
</template>

<script>
import {
    getDepoTemplateById,
    validateDepositoryContent
} from '@/util/api';
export default {
    name: 'validateDepositoryDialog',
    props: {
        // 应用链id
        chainId: { type: String, required: true, default: null },
        // 合约id
        contractId: { type: String, required: true, default: null },
        // 存证模板id与名称
        template: { type: Object, required: true, default: null },
        // 校验的存证数据
        data: { type: Object, required: true, default: null }
    },
    data() {
        return {
            loading: false,
            parameterList: [], // 存证模板参数
            // 存证数据表单
            formData: {
                templateName: this.template.name
            },
            rules: {},
            fileList: [] // 文件存证
        };
    },
    watch: {
        fileList(nval, oval) {
            let file = nval && nval[0];
            this.formData.file = file && file.name || '';
        }
    },
    mounted() {
        this.initDepositoryTemplate();
    },
    methods: {
        // 初始化存证模板
        initDepositoryTemplate() {
            getDepoTemplateById(this.template.id).then(res => {
                if (res.data.code === 0) {
                    let parameters = [], parameterRules = {}, resData = res.data.data;
                    this.rules = {};
                    for (let i = 0; i < resData.length; i++) {
                        parameters.push({
                            parameterKey: 'parameter' + i,
                            parameterName: resData[i].parameterName,
                            parameterType: resData[i].parameterType
                        });

                        parameterRules['parameter' + i] = [];
                        if (resData[i].parameterType === 'file') {
                            this.fileFormKey = 'parameter' + i;
                            this.fileFieldKey = resData[i].parameterName;
                            parameterRules['parameter' + i].push({
                                validator: (rule, value, callback) => {
                                    if (!this.fileList.length) {
                                        callback(new Error(resData[i].parameterName +
                                            this.$t('depository.fileRequired')));
                                        return;
                                    }
                                    let file = this.fileList && this.fileList[0];
                                    let idx = file.name.lastIndexOf('.');
                                    let suffix = idx != -1 ? file.name.substring(idx + 1) : '';
                                    suffix = suffix.toLowerCase();
                                    if (file.raw && !file.size) {
                                        callback(new Error(this.$t('text.uploadFileEmpty')));
                                    } else if (file.size > 5 * 1024 * 1024) {
                                        callback(new Error(this.$t('depository.uploadFileSizeExceedsLmit')));
                                    } else {
                                        callback();
                                    }
                                },
                                trigger: 'blur'
                            });
                        }
                    }
                    this.parameterList = parameters;
                    this.rules = parameterRules;
                    this.bindingFormData();
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
        // 数据绑定
        bindingFormData() {
            if (this.data === null) return;
            this.formData.id = this.data.id;
            for (let field in this.data) {
                if (field.search('col') !== -1) {
                    let paramKey = 'parameter' + field.replace('col', ''),
                        paramValue = this.data[field];
                    this.$set(this.formData, paramKey, paramValue);
                }
            }
        },
        modelClose() {
            this.$emit('close');
        },
        // 校验事件
        handleSubmit() {
            this.$refs.depositoryForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.validateDepositoryData();
                } else {
                    return false;
                }
            });
        },
        // 存证数据链上验证
        validateDepositoryData() {
            let isFileExist = false;
            for (let parameterKey in this.formData) {
                for (let i = 0; i < this.parameterList.length; i++) {
                    let parameterType = this.parameterList[i].parameterType;
                    isFileExist = isFileExist || parameterType === 'file';
                }
            }
            let formData = new FormData();
            if (isFileExist) {
                let fileBlob = this.fileList && this.fileList[0] && this.fileList[0].raw;
                formData.append('file', fileBlob);
            }

            validateDepositoryContent(this.formData.id, formData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('depository.validateSuccess')
                    });
                    this.modelClose();
                    this.$emit('success');
                } else if (res.data.code === 700005) { // 校验发现不同
                    // 1.普通校验发现不同,自动修复表中数据
                    // 2.文件校验发现不同,且表中文件Hash与链上Hash不同,自动修复表中文件Hash
                    this.modelClose();
                    this.$emit('success');
                    this.$emit('validateDetail', this.formData.id);
                } else if (res.data.code === 700008) { // 校验发现不同
                    // 仅针对文件校验,当表中文件Hash与链上Hash相同,只是本次上传文件的Hash不同,则不会进行自动修改
                    this.modelClose();
                    this.$emit('success');
                    this.$message({
                        message: this.$t('depository.validateFileFailed'),
                        type: 'warning',
                        duration: 2000
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
        // 移除文件存证
        onFileRemove(file, fileList) {
            this.fileList = fileList;
            this.$nextTick(() => {
                this.$refs.depositoryForm.validateField(this.fileFormKey);
            });
        },
        // 变更文件存证
        onFileChange(file, fileList) {
            this.fileList = fileList;
            this.$nextTick(() => {
                this.$refs.depositoryForm.validateField(this.fileFormKey);
            });
        },
        handleExceed() {
            this.$message.warning(this.$t('text.oneUploadFileTip'));
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
</style>
