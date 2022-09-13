<template>
    <div class="reset-password-wrapper">
        <el-form
            :model="rulePasswordForm"
            status-icon
            :rules="rules"
            ref="rulePasswordForm"
            label-width="80px">
            <el-form-item :label="$t('main.oldPassword')" prop="oldPass">
                <el-input
                    type="password"
                    v-model="rulePasswordForm.oldPass"
                    autocomplete="off">
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('main.newPassword')" prop="pass">
                <el-input
                    type="password"
                    v-model="rulePasswordForm.pass"
                    autocomplete="off">
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('main.confirmPassword')" prop="checkPass">
                <el-input
                    type="password"
                    v-model="rulePasswordForm.checkPass"
                    autocomplete="off">
                </el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button
                @click="closeDialog">
                {{$t('text.close')}}
            </el-button>
            <el-button
                @click="resetForm('rulePasswordForm')">
                {{$t('main.reset')}}
            </el-button>
            <el-button
                type="primary"
                @click="submitForm('rulePasswordForm')">
                {{$t('main.submit')}}
            </el-button>
        </div>
    </div>
</template>

<script>
import { sm3 } from 'sm-crypto';
import { resetPassword } from '@/util/api';
export default {
    name: 'changePasswordDialog',
    props: {},
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('main.inputPassword')));
            } else {
                if (this.rulePasswordForm.checkPass !== '') {
                    this.$refs.rulePasswordForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('main.againPassword')));
            } else if (value !== this.rulePasswordForm.pass) {
                callback(new Error(this.$t('main.passwordError')));
            } else {
                callback();
            }
        };
        return {
            rulePasswordForm: {
                oldPass: '',
                pass: '',
                checkPass: ''
            },
            rules: {
                oldPass: [{
                    required: true,
                    message: this.$t('main.inputOldPassword'),
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 12,
                    message: this.$t('main.longPassword'),
                    trigger: 'blur'
                }],
                pass: [{
                    required: true,
                    validator: validatePass,
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 12,
                    message: this.$t('main.longPassword'),
                    trigger: 'blur'
                }, {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/,
                    message: this.$t('main.passwordPattern'),
                    trigger: 'blur'
                }],
                checkPass: [{
                    required: true,
                    validator: validatePass2,
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 12,
                    message: this.$t('main.longPassword'),
                    trigger: 'blur'
                }]
            },
            account: localStorage.getItem('user')
        };
    },
    methods: {
        closeDialog() {
            this.rulePasswordForm = {
                oldPass: '',
                pass: '',
                checkPass: ''
            };
            this.$refs.rulePasswordForm.resetFields();
            this.$emit('success', true);
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.getResetPassword();
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        getResetPassword() {
            let reqData = {
                oldAccountPwd: sm3(this.rulePasswordForm.oldPass),
                newAccountPwd: sm3(this.rulePasswordForm.pass)
            };
            resetPassword(reqData, {}).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('main.updatePsdSuccess')
                    });
                    this.rulePasswordForm = {
                        oldPass: '',
                        pass: '',
                        checkPass: ''
                    }
                    this.$emit('success', true)
                    this.accountStatus = '2';
                    sessionStorage.setItem('accountStatus', '2');
                } else {
                    this.$message({
                        type: 'error',
                        message: this.$chooseLang(res.data.code)
                    });
                }
            }).catch(err => {
                this.$message({
                    type: 'error',
                    message: err.data || this.$t('text.systemError'),
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
</style>
