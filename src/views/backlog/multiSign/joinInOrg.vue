<template>
    <div class="template-form-wrapper">
        <el-form
            ref="templateForm"
            :model="formData"
            label-width="90px">
            <el-form-item
                :label="$t('chainOrg.joinInOrgName')"
                prop="orgName">
                <div class="form-div__unselect">{{ formData.orgName }}</div>
            </el-form-item>
            <el-form-item
                :label="$t('chainUser.userName')"
                prop="userName">
                <div class="form-div__unselect">{{ formData.userName }}</div>
            </el-form-item>
            <el-form-item
                :label="$t('chainNode.nodeName')"
                prop="nodeName">
                <div class="form-div__unselect">{{ formData.nodeName }}</div>
            </el-form-item>
            <el-form-item
                :label="$t('chainNode.nodeAddr')"
                prop="nodeAddress">
                <div class="form-div__unselect">{{ formData.nodeAddress }}</div>
            </el-form-item>
            <el-form-item
                :label="$t('chainNode.nodeP2pPort')"
                prop="nodeP2pPort">
                <div class="form-div__unselect">{{ formData.nodeP2pPort }}</div>
            </el-form-item>
            <el-form-item
                :label="$t('chainOrg.chainOrgRemarks')"
                prop="description">
                <div class="form-div__unselect">{{ formData.description }}</div>
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
import {
    getBacklogDetail4JoinInOrg
} from '@/util/api';
import mixins from './mixins.js'
export default {
    name: 'deployContractDialog',
    props: {
        dialogOptions: { type: Object }
    },
    computed: {
    },
    mixins: [ mixins ],
    data() {
        return {
            loading: false,
            formData: {
                orgName: '',
                userName: '',
                nodeName: '',
                nodeAddress: '',
                nodeP2pPort: '',
                description: ''
            }
        };
    },
    mounted() {
        this.fetchInitData();
    },
    methods: {
        modelClose() {
            this.$emit('close', '10');
        },
        // 获取页面初始化数据
        fetchInitData() {
            getBacklogDetail4JoinInOrg({id: this.dialogOptions.id}).then(res => {
                if (res.data.code === 0) {
                    let resData = res.data.data || {};
                    this.formData.orgName = resData.orgName;
                    this.formData.userName = resData.userName;
                    this.formData.nodeName = resData.nodeName;
                    this.formData.nodeAddress = resData.nodeAddress;
                    this.formData.nodeP2pPort = resData.p2pPort;
                    this.formData.description = resData.description;
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
        },
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
