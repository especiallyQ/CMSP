<template>
    <div class="template-form-wrapper">
        <el-form
            ref="templateForm"
            :model="formData"
            label-width="90px">
            <el-form-item :label="$t('table.contractName')">
                <div class="form-div__unselect">{{ formData.contractName }}</div>
            </el-form-item>
            <el-form-item :label="$t('table.contractVersion')">
                <div class="form-div__unselect">{{ formData.contractVersion }}</div>
            </el-form-item>
            <el-form-item :label="$t('table.templateName')">
                <div class="form-div__unselect">{{ formData.templateSource }}</div>
            </el-form-item>
            <el-form-item :label="$t('contracts.contractTemplateVersion')">
                <div class="form-div__unselect">{{ formData.templateVersion }}</div>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.close')}}</el-button>
            <el-button
                type="danger"
                @click="handleVote(2)"
                :loading="loading"
                v-if="dialogOptions.status == 0">
                {{this.$t('backlog.refuse')}}
            </el-button>
            <el-button
                type="primary"
                @click="handleVote(1)"
                :loading="loading"
                v-if="dialogOptions.status == 0">
                {{this.$t('backlog.agree')}}
            </el-button>
        </div>
    </div>
</template>

<script>
import { getBacklogDetail4Contract } from '@/util/api';
import mixins from './mixins.js';
export default {
    name: 'revokeContractDialog',
    props: {
        dialogOptions: { type: Object }
    },
    mixins: [ mixins ],
    computed: {
    },
    data() {
        return {
            loading: false,
            formData: {
                contractName: '',
                contractVersion: '',
                templateSource: '',
                templateVersion: ''
            }
        };
    },
    mounted() {
        this.fetchInitData();
    },
    methods: {
        modelClose() {
            this.$emit('close', '3');
        },
        // 获取页面初始化数据
        fetchInitData() {
            getBacklogDetail4Contract({id: this.dialogOptions.id}).then(res => {
                if (res.data.code === 0) {
                    let resData = res.data.data || {};
                    this.formData = {
                        contractName: resData.contractName,
                        contractVersion: resData.contractVersion,
                        templateSource: resData.templateName,
                        templateVersion: resData.templateVersion
                    };
                    this.setParams(resData.id, resData.notificationId);
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
.template-form-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.template-form-wrapper .dialog-footer {
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
    width: 100%;
}
.template-form-wrapper .el-form {
    width: 100%;
}
</style>
