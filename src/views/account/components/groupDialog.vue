<template>
    <div>
        <el-form
            :model="groupForm"
            :rules="rules"
            ref="groupForm"
            label-width="100px"
            class="ruleForm">
            <el-form-item
                :label="$t('accountGroup.groupName')"
                prop="name">
                <el-input
                    v-model="groupForm.name"
                    :placeholder="$t('accountGroup.inputName')"
                    maxlength="40">
                </el-input>
            </el-form-item>
            <el-form-item
                :label="$t('accountGroup.remarks')"
                prop="remarks">
                <el-input
                    v-model="groupForm.remarks"
                    :rows="5"
                    type="textarea"
                    resize="none">
                </el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit('groupForm')" :loading="loading">
                {{this.$t('text.sure')}}
            </el-button>
        </div>
    </div>
</template>

<script>
import {
    addAccountGroup,
    updateAccountGroup
} from '@/util/api';
export default {
    name: 'groupDialog',
    props: {
        groupDialogOptions: {
            type: Object
        }
    },
    watch: {
        'groupDialogOptions.type': {
            handler(val) {
                this.type = val;
                switch (val) {
                    case 'create':
                        this.groupForm = {
                            name: '',
                            remarks: ''
                        };
                        break;
                    case 'modify':
                        this.groupForm = {
                            name: this.groupDialogOptions.data.accountGroupName,
                            remarks: this.groupDialogOptions.data.description
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
            type: this.groupDialogOptions.type,
            loading: false,
            groupForm: {
                name: '',
                remarks: ''
            }
        };
    },
    computed: {
        rules() {
            let data = {
                name: [{
                    required: true,
                    message: this.$t('accountGroup.inputGroupEmpty'),
                    trigger: 'blur'
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
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.submitGroupInfo();
                } else {
                    return false;
                }
            });
        },
        submitGroupInfo() {
            let type = this.type;
            this.loading = true;
            switch (type) {
                case 'create':
                    this.createAccountGroup();
                    break;
                case 'modify':
                    this.modifyAccountGroup();
                    break;
            }
        },
        // 新建账号群组
        createAccountGroup() {
            let params = {
                accountGroupName: this.groupForm.name,
                description: this.groupForm.remarks,
                parentGroupId: this.groupDialogOptions.data.parentGroupId
            };
            addAccountGroup(params).then(res => {
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
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
                this.reset();
            });
        },
        // 编辑账号群组
        modifyAccountGroup() {
            let params = {
                accountGroupId: this.groupDialogOptions.data.accountGroupId,
                accountGroupName: this.groupForm.name,
                description: this.groupForm.remarks,
                parentGroupId: this.groupDialogOptions.data.parentGroupId
            };
            updateAccountGroup(params).then(res => {
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