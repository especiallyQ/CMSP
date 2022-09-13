<template>
    <div>
        <div class="tree-wrapper">
            <el-tree
                :data="treeNodes"
                :props="defaultProps"
                node-key="accountGroupId"
                :current-node-key="currentNode"
                :highlight-current="true"
                :default-expand-all="true"
                :expand-on-click-node="false"
                @node-click="handleTreeNodeClick">
            </el-tree>
        </div>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{this.$t('text.cancel')}}</el-button>
            <el-button type="primary" @click="submit()" :loading="loading">
                {{this.$t('text.sure')}}
            </el-button>
        </div>
    </div>
</template>
 
<script>
import {
    modifyAccountInfo,
    batchModifyAccountInfo
} from '@/util/api';
export default {
    name: 'groupDialog',
    props: {
        treeNodes: { type: Array, required: true },
        accountDialogOptions: { type: Object },
        currentNode: { type: String }
    },
    data() {
        return {
            loading: false,
            groupData: [],
            defaultProps: {
                id: 'accountGroupId',
                label: 'accountGroupName',
                children: 'children'
            },
            selectNode: ''
        };
    },
    mounted() {
    },
    methods: {
        modelClose() {
            this.$emit('close', false);
        },
        submit() {
            if (this.selectNode === '0') {
                this.$message({
                    message: this.$t('account.selectAccountGroup'),
                    type: 'error',
                    duration: 2000
                });
            } else {
                this.loading = true;
                let isBatch = this.accountDialogOptions.isBatch;
                if (isBatch) {
                    this.modifyAccountsGroup()
                } else {
                    this.modifyAccountGroup();
                }
            }
        },
        modifyAccountGroup() {
            let reqData = {
                accountId: this.accountDialogOptions.data['accountId'],
                account: this.accountDialogOptions.data['account'],
                accountGroupId: this.selectNode,
                roleId: this.accountDialogOptions.data['roleId'],
                email: this.accountDialogOptions.data['email']
            };
            modifyAccountInfo(reqData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$t('text.updateSuccessMsg')
                    });
                    this.modelClose();
                    this.$emit("success");
                } else {
                    this.modelClose();
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
        // 批量
        modifyAccountsGroup() {
            let accountList = this.accountDialogOptions.data;
            let accountIds = [];
            accountList.forEach(item => {
                accountIds.push(item.accountId);
            });
            if (accountIds.length === 0) return;
            let reqData = {
                accountIds: accountIds.join(','),
                accountGroupId: this.selectNode
            };
            batchModifyAccountInfo(reqData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let resData = res.data.data || [];
                    if (resData.length === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$t('text.updateSuccessMsg')
                        });
                    } else {
                        let msg = this.$t('account.batchModifyGroupMsg') + '<br /><br />';
                        resData.forEach(item => {
                            msg += item.name + '&nbsp;:&nbsp;' + this.$chooseLang(item.errorCode) + '<br />';
                        });
                        this.$message({
                            type: 'warning',
                            message: msg,
                            dangerouslyUseHTMLString: true,
                            duration: 8000
                        });
                    }
                    this.modelClose();
                    this.$emit('success');
                } else {
                    this.modelClose();
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
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
        handleTreeNodeClick(data) {
            this.selectNode = data.accountGroupId + '';
        }
    }
}
</script>
 
<style scoped>
.tree-wrapper {
    height: 400px;
    overflow: auto;
}
.dialog-footer {
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
}
</style>