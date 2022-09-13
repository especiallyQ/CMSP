<template>
    <div class="org-list-view search-table">
        <el-table :data="chainOrgList" tooltip-effect="light" v-loading="loading">
            <el-table-column
                :label="$t('chainOrg.name')"
                key="orgName"
                show-overflow-tooltip
                align="center">
                <template slot-scope="scope">
                    {{scope.row.orgName}}
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('chainOrg.creator')"
                key="creator"
                show-overflow-tooltip
                align="center">
                <template slot-scope="scope">
                    {{scope.row.creator}}
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('chainOrg.accountGroup')"
                key="accountGroupName"
                show-overflow-tooltip
                align="center">
                <template slot-scope="scope">
                    {{scope.row.accountGroupName}}
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('chainOrg.chainNodeTotal')"
                key="chainNodeCount"
                show-overflow-tooltip
                align="center">
                <template slot-scope="scope">
                    {{scope.row.chainNodeCount}}
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('chainOrg.chainUserTotal')"
                key="chainUserCount"
                show-overflow-tooltip
                align="center">
                <template slot-scope="scope">
                    {{scope.row.chainUserCount}}
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('text.operation')"
                show-overflow-tooltip
                align="center"
                min-width="140">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="small"
                        :disabled="isDeleteChainOrgDisabled(scope.row)"
                        @click="deleteChainOrg(scope.row)"
                        style="color:#ed5454">
                        {{$t('text.delete')}}
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        :disabled="isUpdateChainOrgDisabled(scope.row)"
                        @click="updateChainOrg(scope.row)">
                        {{$t('text.update')}}
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="viewChainOrg(scope.row)">
                        {{$t('text.viewDetail')}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import mixins from './mixins.js';
export default {
    name: 'orgListView',
    components: {
    },
    mixins: [ mixins ],
    props: {
        // 组织数据
        data: { type: Array, required: false, default: () => { return [] } }
    },
    data() {
        return {
            loading: false,
            chainOrgList: this.data
        }
    },
    watch: {
        data: function (val) {
            this.chainOrgList = val;
        }
    },
    created() {
    },
    beforeDestroy() {
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<style scoped>
</style>
