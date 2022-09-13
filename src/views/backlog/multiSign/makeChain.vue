<template>
    <div class="template-form-wrapper">
        <el-form
            ref="templateForm"
            :model="formData"
            :rules="rules"
            label-width="120px">
            <el-form-item
                :label="$t('blockchain4App.name')"
                prop="chainName">
                <template v-if="detailMode">
                    <div class="form-div__unselect">{{ formData.chainName }}</div>
                </template>
                <template v-else>
                    <el-input
                        v-model="formData.chainName"
                        :placeholder="$t('blockchain4App.name')"
                        :disabled="true">
                    </el-input>
                </template>
            </el-form-item>
            <el-form-item
                :label="$t('blockchain4App.id')"
                prop="chainCode">
                <template v-if="detailMode">
                    <div class="form-div__unselect">{{ formData.chainCode }}</div>
                </template>
                <template v-else>
                    <el-input
                        v-model="formData.chainCode"
                        :placeholder="$t('blockchain4App.id')"
                        :disabled="true">
                    </el-input>
                </template>
            </el-form-item>
            <el-form-item
                :label="$t('text.remarks')"
                prop="remarks">
                <template v-if="detailMode">
                    <div class="form-div__unselect">{{ formData.remarks }}</div>
                </template>
                <template v-else>
                    <el-input
                        v-model="formData.remarks"
                        :rows="3"
                        :disabled="true"
                        type="textarea"
                        resize="none">
                    </el-input>
                </template>
            </el-form-item>
            <el-form-item
                :label="$t('chainOrg.name')"
                prop="orgName">
                <template v-if="detailMode">
                    <div class="form-div__unselect">{{ formData.orgName }}</div>
                </template>
                <template v-else>
                    <el-input
                        v-model="formData.orgName"
                        :placeholder="$t('chainOrg.name')"
                        :disabled="true">
                    </el-input>
                </template>
            </el-form-item>
            <el-form-item
                :label="$t('chainNode.joinInConsensusNode')"
                prop="nodeName"
                v-if="detailMode">
                <div class="form-div__unselect">{{ formData.nodeName }}</div>
            </el-form-item>
            <el-form-item
                :label="$t('chainNode.joinInConsensusNode')"
                prop="chainNodeId"
                v-else>
                <el-select
                    v-model="formData.chainNodeId"
                    :placeholder="$t('chainNode.joinInConsensusNode')">
                    <el-option
                        v-for="item in nodeList"
                        :key="item.id"
                        :label="item.nodeName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                :label="$t('chainNode.nodeAddr')"
                prop="nodeAddress">
                <template v-if="detailMode">
                    <div class="form-div__unselect">{{ formData.nodeAddress }}</div>
                </template>
                <template v-else>
                    <el-input
                        v-model="formData.nodeAddress"
                        :disabled="true">
                    </el-input>
                </template>
            </el-form-item>
            <el-form-item
                :label="$t('chainNode.nodeMonitorPort')"
                prop="monitorPort">
                <template v-if="detailMode">
                    <div class="form-div__unselect">{{ formData.monitorPort }}</div>
                </template>
                <template v-else>
                    <el-input
                        v-model="formData.monitorPort"
                        :disabled="true">
                    </el-input>
                </template>
            </el-form-item>
            <el-form-item
                :label="$t('chainUser.registerChainUser')"
                prop="userName"
                v-if="detailMode">
                <div class="form-div__unselect">{{ formData.userName }}</div>
            </el-form-item>
            <el-form-item
                :label="$t('chainUser.registerChainUser')"
                prop="chainUserId"
                v-else>
                <el-select
                    v-model="formData.chainUserId"
                    :placeholder="$t('chainUser.registerChainUser')">
                    <el-option
                        v-for="item in userList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.close')}}</el-button>
            <el-button
                type="primary"
                @click="handleSubmit"
                :loading="loading"
                v-if="!detailMode">
                {{this.$t('text.sure')}}
            </el-button>
        </div>
    </div>
</template>

<script>
import {
    makeChainBacklogInit,
    handleMakeChainBacklog,
    makeChainBacklogDetail
} from '@/util/api';
export default {
    name: 'deployContractDialog',
    props: {
        dialogOptions: { type: Object }
    },
    computed: {
        detailMode() {
            if (this.dialogOptions && this.dialogOptions.status != 22) {
                return true;
            }
            return false;
        }
    },
    watch: {
        'formData.chainNodeId': {
            handler(nval, oval) {
                let node = this.nodeList.find(o => o.id == nval) || {};
                this.formData.nodeAddress = node.nodeAddress || '';
                this.formData.monitorPort = node.monitorPort || '';
            }
        }
    },
    data() {
        return {
            loading: false,
            nodeList: [],
            userList: [],
            formData: {
                chainId: '',
                orgId: '',
                chainNodeId: '',
                chainUserId: '',
                chainName: '',
                chainCode: '',
                remarks: '',
                orgName: '',
                nodeName: '',
                userName: '',
                nodeAddress: '',
                monitorPort: ''
            },
            rules: {
                chainNodeId: [{
                    required: true,
                    message: this.$t('chainNode.selectJoinInConsensusNode'),
                    trigger: 'change'
                }],
                chainUserId: [{
                    required: true,
                    message: this.$t('chainUser.selectRegisterChainUser'),
                    trigger: 'change'
                }]
            },
        };
    },
    mounted() {
        if (this.detailMode) {
            this.fetchFormData();
        } else {
            this.fetchInitData();
        }
    },
    methods: {
        modelClose() {
            this.$emit('close');
        },
        // 获取表单详情
        fetchFormData() {
            makeChainBacklogDetail(this.dialogOptions.id).then(res => {
                if (res.data.code === 0) {
                    let resData = res.data.data || {};
                    this.formData.chainName = resData.chainName;
                    this.formData.chainCode = resData.chainCode;
                    this.formData.remarks = resData.description;
                    this.formData.orgName = resData.orgName;
                    this.formData.nodeName = resData.nodeName;
                    this.formData.nodeAddress = resData.nodeAddress;
                    this.formData.monitorPort = resData.monitorPort;
                    this.formData.userName = resData.userName;
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
        // 获取页面初始化数据
        fetchInitData() {
            this.formData.chainId = this.dialogOptions.id;
            makeChainBacklogInit(this.dialogOptions.id).then(res => {
                if (res.data.code === 0) {
                    let resData = res.data.data || {};
                    this.nodeList = resData.chainNodes || [];
                    this.userList = resData.chainUsers || [];
                    this.formData.orgId = resData.orgId;
                    this.formData.chainName = resData.chainName;
                    this.formData.chainCode = resData.chainCode;
                    this.formData.orgName = resData.orgName;
                    this.formData.remarks = resData.description;
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
        handleSubmit() {
            this.$refs.templateForm.validate(valid => {
                if (!valid) {
                    return;
                }
                let params = {
                    chainId: this.formData.chainId,
                    orgId: this.formData.orgId,
                    chainNodeId: this.formData.chainNodeId,
                    chainUserId: this.formData.chainUserId
                };
                this.loading = true;
                handleMakeChainBacklog(params).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$t('blockchain4App.makeChainApplySuccess')
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
.template-form-wrapper .el-form .el-select {
    width: 100%;
}
</style>
