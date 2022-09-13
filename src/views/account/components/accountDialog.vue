<template>
    <div>
        <el-form
            :model="accountForm"
            :rules="rules"
            ref="accountForm"
            label-width="80px"
            class="ruleForm">
            <el-form-item
                :label="$t('account.user')"
                prop="name">
                <el-input
                    v-model="accountForm.name"
                    :placeholder="$t('system.inputUser')"
                    maxlength="12"
                    :disabled="accountForm['disabled']">
                </el-input>
            </el-form-item>
            <el-form-item
                :label="$t('account.group')"
                prop="group"
                v-if="accountForm['gShow']">
                <el-input
                    v-model="accountForm.group"
                    :disabled="true">
                </el-input>
            </el-form-item>
            <el-form-item
                v-if='accountForm.emailshow'
                :label="$t('account.contact')"
                prop="email">
                <el-input
                    v-model="accountForm.email"
                    :placeholder="$t('account.inputEmail')">
                </el-input>
            </el-form-item>
            <el-form-item
                :label="$t('account.accountType')"
                prop="type"
                v-if="accountForm['tShow']">
                <el-select
                    v-model="accountForm.type"
                    :placeholder="$t('text.select')"
                    :disabled="accountForm.tDisabled">
                    <el-option
                        v-for="item in typeList"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('accountForm')" :loading="loading">
                {{this.$t('text.sure')}}
            </el-button>
        </div>
    </div>
</template>

<script>
import {
    accountTypeList,
    creatAccountInfo,
    modifyAccountInfo
} from "@/util/api";
export default {
    name: 'accountDialog',
    props: {
        accountDialogOptions: {
            type: Object
        }
    },
    watch: {
        'accountDialogOptions.type': {
            handler(val) {
                this.type = val;
                switch (val) {
                    case 'creat':
                        this.accountForm = {
                            name: '',
                            group: this.accountDialogOptions.data['accountGroupName'],
                            disabled: false,
                            gShow: true,
                            email: '',
                            emailshow: true,
                            type: '',
                            tShow: true,
                            tDisabled: false
                        };
                        break;
                    case 'modify':
                        this.accountForm = {
                            name: this.accountDialogOptions.data['account'],
                            group: this.accountDialogOptions.data['accountGroupName'],
                            disabled: true,
                            gShow: true,
                            email: this.accountDialogOptions.data['email'],
                            emailshow: true,
                            type: this.accountDialogOptions.data['roleId'] + '',
                            tShow: true,
                            tDisabled: true
                        };
                        break;
                }
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            type: this.accountDialogOptions.type,
            role: '',
            loading: false,
            accountForm: {
                name: '',
                group: '',
                email: '',
                type: ''
            },
            typeList: []
        };
    },
    computed: {
        rules() {
            let data = {
                name: [{
                    required: true,
                    message: this.$t('system.inputUser'),
                    trigger: 'blur'
                }, {
                    min: 1,
                    max: 12,
                    message: this.$t('rule.folderLong'),
                    trigger: 'blur'
                }, {
                    pattern: /^[A-Za-z0-9]+$/,
                    message: this.$t('rule.accountRule'),
                    trigger: 'blur'
                }],
                group: [{
                    // required: true,
                    message: this.$t('accountGroup.inputGroupEmpty'),
                    trigger: 'blur'
                }],
                email: [{
                    required: true,
                    message: this.$t('account.inputEmail'),
                    trigger: 'blur'
                }, {
                    pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                    message: this.$t('account.emailTypeError'),
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: this.$t('account.inputAccountType'),
                    trigger: 'change'
                }]
            }
            return data;
        }
    },
    mounted() {
        this.role = localStorage.getItem('root');
        this.fetchAccountTypeList();
    },
    methods: {
        modelClose() {
            this.$emit('close', false);
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.submitAccountInfo();
                } else {
                    return false;
                }
            });
        },
        // 获取账号类型(角色)列表
        fetchAccountTypeList() {
            accountTypeList().then(res => {
                if (res.data.code === 0) {
                    this.typeList = [];
                    res.data.data.forEach(item => {
                        let _roleId = item.roleId + '';
                        if (this.role === 'PU_Admin' &&
                            (_roleId === '100003' || _roleId === '100004')) {
                            // PUAdmin不能绑定平台运维方管理员和运营人员
                            return true;
                        } else if (this.accountDialogOptions.data['accountGroupId'] == 1 &&
                            (_roleId === '100005' || _roleId === '100006' || _roleId === '100007')) {
                            // 'CSMP管理团队'账号群组下只能绑定平台运维方管理员和运营人员
                            return true;
                        } else if (this.accountDialogOptions.data['accountGroupId'] != 1 &&
                            (_roleId === '100003' || _roleId === '100004')) {
                            // 非'CSMP管理团队'账号群组下可绑定平台使用方管理员和运营人员和开发方管理员
                            return true;
                        }
                        this.typeList.push({
                            roleId: _roleId,
                            roleName: {
                                '100003': this.$t('text.poadmin'),
                                '100004': this.$t('text.pooper'),
                                '100005': this.$t('text.puadmin'),
                                '100006': this.$t('text.puoper'),
                                '100007': this.$t('text.adadmin')
                            }[_roleId]
                        });
                    });
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
        submitAccountInfo() {
            let type = this.type;
            switch (type) {
                case 'creat':
                    this.createAccount();
                    break;
                case 'modify':
                    this.modifyAccount();
                    break;
                case 'delete':
                    this.deleteAccount();
                    break;
            }
        },
        createAccount() {
            let reqData = {
                account: this.accountForm.name,
                accountGroupId: this.accountDialogOptions.data['accountGroupId'],
                roleId: this.accountForm.type,
                email: this.accountForm.email
            };
            creatAccountInfo(reqData, {}).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t('text.addSuccess')
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
                this.modelClose();
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            });
        },
        modifyAccount() {
            let reqData = {
                accountId: this.accountDialogOptions.data['accountId'],
                account: this.accountForm.name,
                accountGroupId: this.accountDialogOptions.data['accountGroupId'],
                roleId: this.accountForm.type,
                email: this.accountForm.email
            };
            modifyAccountInfo(reqData, {}).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t('text.updateSuccessMsg')
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
                this.modelClose();
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: "error",
                    duration: 2000
                });
            });
        }
    }
};
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
