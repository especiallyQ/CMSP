<template>
    <div class="main-wrapper">
        <div id="shade" v-if="accountStatus === '1'"></div>
        <div id="reset-password" v-if="accountStatus === '1'">
            <div class="reset-password-title">
                {{$t('main.changePassword')}}
            </div>
            <el-form
                :model="rulePasswordForm"
                status-icon
                :rules="rules"
                ref="rulePasswordForm"
                label-width="90px"
                class="ruleForm">
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
                <div class="dialog-footer">
                    <el-button
                        @click="resetForm('rulePasswordForm')">
                        {{$t('main.reset')}}
                    </el-button>
                    <el-button
                        type="primary"
                        @click="submitForm('rulePasswordForm')"
                        :loading="loading">
                        {{$t('main.submit')}}
                    </el-button>
                </div>
            </el-form>
        </div>
        <div class="menu-wrapper header" :class="{'menu-show': menuShow, 'menu-hide': menuHide}">
            <v-menu @sidebarChange="change($event)" :minMenu="show" ref='menu'></v-menu>
        </div>
        <div class="view-wrapper" :class="{'view-show': menuShow, 'view-hide': menuHide}">
            <router-view class="bg-f7f7f7"></router-view>
        </div>
    </div>
</template>

<script>
import Bus from '@/bus';
import sidebar from './sidebar';
import { resetPassword, checkToken } from '@/util/api';
import router from '@/router';
import { sm3 } from 'sm-crypto';
import utils from '@/util/sm_sha';
export default {
    name: 'Main',
    components: {
        'v-menu': sidebar
    },
    data: function () {
        return {
            menuShow: true,
            menuHide: false,
            loading: false,
            accountStatus: 0,
            account: localStorage.getItem('user'),
            rulePasswordForm: {
                oldPass: '',
                pass: '',
                checkPass: ''
            },
        };
    },
    computed: {
        show: function () {
            return this.menuShow;
        },
        rules() {
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
            let data = {
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
            }
            return data;
        }
    },
    mounted() {
        this.checkToken();
        //this.getGroupList();
    },
    methods: {
        // 登录状态token测试
        checkToken() {
            checkToken().then(res => {
                if (res.data.code === 0) {
                    this.accountStatus = sessionStorage.getItem('accountStatus');
                    if (this.$route.path && this.$route.path !== '/main') {
                        router.push(this.$route.path);
                    } else if (this.$route.path == '/main') {
                        router.push('/home');
                        Bus.$emit('routing', '/home');
                    } else {
                        router.push('/home');
                        Bus.$emit('routing', '/home');
                    }
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                    router.push('/login');
                }
            }).catch(err => {
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
                router.push('/login');
            });
        },
        change: function (val) {
            this.menuShow = !val;
            this.menuHide = val;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.getResetPassword();
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 修改密码
        getResetPassword() {
            let reqData;
            reqData = {
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
                    this.accountStatus = '2';
                    sessionStorage.setItem('accountStatus', this.accountStatus);
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
        }
    }
};
</script>
<style scoped>
.header .el-menu {
    height: 100%;
}
.main-wrapper {
    width: 100%;
    background: #f7f7f7;
    height: 100%;
}
.main-wrapper::after {
    display: block;
    content: "";
    clear: both;
}
.menu-wrapper {
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 1;
}
.menu-wrapper::-webkit-scrollbar {
    width: 1px;
    height: 1px;
    background-color: rgb(12, 18, 32);
}
.menu-wrapper::-webkit-scrollbar-track {
    background-color: rgb(12, 18, 32);
}
.menu-wrapper::-webkit-scrollbar-thumb {
    background-color: rgb(12, 18, 32);
}
.menu-wrapper::-webkit-scrollbar-track-piece {
    background-color: rgb(12, 18, 32);
}
.view-wrapper {
    min-height: calc(100%);
    padding-left: 200px;
    box-sizing: content-box;
}
.menu-show {
    width: 200px;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
}
.menu-hide {
    width: 56px;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 2s;
}
.view-show {
    width: calc(100% - 200px);
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
}
.view-hide {
    padding-left: 56px;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 2s;
}
.bg-f7f7f7 {
    background-color: #f7f7f7;
}
#shade {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.3;
    /*兼容IE8及以下版本浏览器*/
    filter: alpha(opacity=30);
}

#reset-password {
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 30%;
    height: 320px;
    margin: auto;
    background-color: #fff;
    padding-top: 15px;
    border: 1px solid #eaedf3;
    box-shadow: 0 12px 27px 0 rgb(159 166 189 / 33%);
    border-radius: 4px;
}
.reset-password-title {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    padding-top: 20px;
    margin-bottom: 10px;
}
.ruleForm {
    padding-top: 20px;
    padding-right: 25px;
}
.ruleForm .dialog-footer {
    width: 100%;
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
}
.ruleForm >>> .el-form-item__label {
    font-size: 12px;
    color: #737a86;
}
</style>
