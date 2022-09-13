import router from '@/router';
import { deleteChainOrg } from '@/util/api';

export const comp = {
    data() {
        return {
            accountName: localStorage.getItem('user'),
            accountGroupId: localStorage.getItem('groupId'),
            accountType: localStorage.getItem('root')
        };
    },
    methods: {
        deleteChainOrg(row) {
            if (this.isDeleteChainOrgDisabled(row)) return;
            this.$confirm(this.$t('text.confirmDelete') +
                this.$t('monitor.chainOrg') + row.orgName + ' ?', {
                center: true
            }).then(() => {
                this.removeChainOrg(row.id);
            }).catch(() => {});
        },
        removeChainOrg(orgId) {
            deleteChainOrg(orgId, {}).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('system.deleteSuccess')
                    });
                    this.$emit('refresh');
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
        updateChainOrg(row) {
            if (this.isUpdateChainOrgDisabled(row)) return;
            this.$emit('updateChainOrg', row);
        },
        viewChainOrg(row) {
            router.push('/chainOrgDetail/' + row.id);
        },
        // 删除组织可用性判断
        isDeleteChainOrgDisabled(row) {
            return this.accountType !== 'PU_Admin';
        },
        // 编辑组织可用性判断
        isUpdateChainOrgDisabled(row) {
            return this.accountType !== 'PU_Admin';
        }
    }
}

export default comp;
