<template>
    <div class="notice-list-wrapper">
        <div class="search-part search-part-inner">
            <div class="search-part-left">
                <el-form
                    ref="searchForm"
                    :inline="true"
                    label-width="60px"
                    class="search-form">
                    <el-form-item :label="$t('noticeCenter.noticeType')">
                        <el-select
                            v-model="filterData"
                            style="width: 140px"
                            @change="handleFilterChange">
                            <el-option
                                v-for="item in filterList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="search-part-right"></div>
        </div>
        <div class="search-table search-table-inner">
            <el-table
                ref="noticeTable"
                :data="tableList"
                row-key="logId"
                tooltip-effect="light"
                v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column
                    v-if="status === 0"
                    type="selection"
                    reserve-selection
                    width="50"
                    align="center">
                </el-table-column>
                <el-table-column
                    v-for="head in tableHeader"
                    :label="head.name"
                    :key="head.enName"
                    show-overflow-tooltip
                    :align="head.align"
                    :min-width="head.width">
                    <template slot-scope="scope">
                        <template v-if="head.enName !== 'operate'">
                            <span
                                class="un-operate-col"
                                :style="{textAlign: head.align}"
                                @click="handleRowClick(scope.row)">
                                {{ scope.row[head.enName] }}
                            </span>
                        </template>
                        <template v-else>
                            <span
                                class="operate-col"
                                :style="{textAlign: head.align}">
                                <el-button
                                    type="text"
                                    size="small"
                                    @click="read(scope.row)">
                                    {{$t('noticeCenter.checkRead')}}
                                </el-button>
                            </span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="page"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <div class="batch-bar" v-if="isBatchHeaderDisplay">
                <div class="tip-wrap">
                    <div class="tip-prefix">
                        {{ $t('text.batchTipPrefix') }}
                    </div>
                    <div>{{ selectedRows.length }}</div>
                    <div class="tip-suffix">
                        {{ $t('text.batchTipSuffix') }}
                    </div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="btn-wrap">
                    <el-button
                        type="primary"
                        size="small"
                        v-if="status === 0"
                        :disabled="isBatchActionDisabled()"
                        @click="handleBatchCheckRead">
                        {{$t('noticeCenter.checkRead')}}
                    </el-button>
                </div>
            </div>
        </div>
        <el-dialog
            :visible.sync="depositoryValidateDialogVisible"
            :title="$t('depository.validateTitle')"
            width="600px"
            :append-to-body="true"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            v-if="depositoryValidateDialogVisible">
            <validate-depository-dialog
                :routeVisible="true"
                :contentId="depositoryContentId"
                @close="depositoryValidateDialogVisible = false">
            </validate-depository-dialog>
        </el-dialog>
    </div>
</template>

<script>
import Bus from '@/bus';
import {
    getAlarmLogList,
    readAlarmLog,
    batchReadAlarmLog,
    getAlarmLogTypeList
} from '@/util/api';
import validateDepositoryDialog from '@/views/depository/validate/detail';
export default {
    name: 'noticeList',
    components: {
        validateDepositoryDialog
    },
    props: {
        // 状态:已读未读
        status: { type: Number, required: true, default: null }
    },
    watch: {
        status(nval, oval) {
            if (nval !== oval) {
                this.currentPage = 1;
                this.getTableList();
            }
        }
    },
    data() {
        return {
            loading: false,
            currentPage: 1, // 分页-当前页码
            pageSize: 10, // 分页-每页数据条目数
            total: 0, // 分页-数据条目总数
            filterData: 'all', // 消息类型过滤条件
            filterList: [], // 消息类型
            tableList: [], // 表格数据
            selectedRows: [], // 列表中被选中的消息
            isBatchHeaderDisplay: false, // 批量操作表头层是否显示
            depositoryContentId: null, // 存证校验信息id
            depositoryValidateDialogVisible: false // 存证校验信息对话框可见性
        }
    },
    computed: {
        tableHeader() {
            let data = [{
                enName: 'alertType',
                name: this.$t('noticeCenter.noticeType'),
                width: 120,
                align: 'center'
            }, {
                enName: 'alertContent',
                name: this.$t('noticeCenter.noticeContent'),
                width: 360,
                align: 'left'
            }, {
                enName: 'createTime',
                name: this.$t('noticeCenter.noticeTime'),
                width: 140,
                align: 'center'
            }];
            if (this.status === 0) {
                data.push({
                    enName: 'operate',
                    name: this.$t('text.operation'),
                    width: 120,
                    align: 'center'
                });
            }
            return data;
        }
    },
    beforeDestroy() {
        Bus.$off('refreshReadList')
    },
    mounted() {
        this.fetchNoticeTypeList();
        this.getTableList();
        // 注册用于刷新已读列表的方法
        Bus.$on('refreshReadList', () => {
            if (this.status === 1) {
                this.getTableList();
            }
        });
    },
    methods: {
        // 获取消息类型列表
        fetchNoticeTypeList() {
            getAlarmLogTypeList().then(res => {
                if (res.data.code === 0) {
                    let typeArr = [];
                    typeArr.push({ code: 'all', name: this.$t('text.all') });
                    typeArr = typeArr.concat(res.data.data || []);
                    this.filterList = typeArr;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            });
        },
        // 获取消息列表数据
        getTableList() {
            this.loading = true;
            let reqData = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
                status: this.status
            };
            let searchData = {
                alertType: this.filterData !== 'all' ? this.filterData : ''
            };
            getAlarmLogList(reqData, searchData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.tableList = res.data.data || [];
                    this.total = res.data.totalCount;
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: 'error',
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.loading = false;
                this.$message({
                    message: err.data || this.$t('text.systemError'),
                    type: 'error',
                    duration: 2000
                });
            });
        },
        // 过滤条件变更事件
        handleFilterChange() {
            this.currentPage = 1;
            this.getTableList();
        },
        // 改变每页数据条目数
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getTableList();
        },
        // 改变当前页码
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTableList();
        },
        // 已读当前通知
        read(row) {
            let reqData = {
                logId: row.logId,
                status: 1
            };
            readAlarmLog(reqData, {}).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('noticeCenter.readSuccessMsg')
                    });
                    this.getTableList();
                    // 刷新未读数量
                    Bus.$emit('refreshUnReadNotice');
                    // 刷新已读列表
                    Bus.$emit('refreshReadList');
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
        // 行点击事件
        handleRowClick(row) {
            let noticeType = parseInt(row.alertTypeCode);
            switch (noticeType) {
                case 1: // 存证校验
                    this.depositoryValidate(row);
                    break;
            }
        },
        // 存证校验
        depositoryValidate(row) {
            if (!row.contentId) return;
            this.depositoryContentId = Number(row.contentId);
            this.depositoryValidateDialogVisible = true;
        },
        // 列表中每行复选框选择状态改变时触发事件
        handleSelectionChange(val) {
            this.selectedRows = val;
            if (this.selectedRows.length > 0) {
                this.isBatchHeaderDisplay = true;
            } else {
                this.isBatchHeaderDisplay = false;
            }
        },
        // 批量已读可用性判断
        isBatchActionDisabled() {
            return this.selectedRows.length === 0;
        },
        // 批量已读事件
        handleBatchCheckRead() {
            this.loading = true;
            let noticeList = this.selectedRows;
            let noticeIds = [];
            noticeList.forEach(item => {
                noticeIds.push(item.logId);
            });
            if (noticeIds.length === 0) return;
            batchReadAlarmLog(noticeIds.join(',')).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$t('noticeCenter.readSuccessMsg')
                    });
                    this.getTableList();
                    this.$refs.noticeTable.clearSelection();
                    // 刷新未读数量
                    Bus.$emit('refreshUnReadNotice');
                    // 刷新已读列表
                    Bus.$emit('refreshReadList');
                } else {
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
                    type: 'error',
                    duration: 2000
                });
            });
        }
    }
}
</script>

<style scoped>
.notice-list-wrapper .search-part-inner {
    padding-bottom: 2px;
}
.notice-list-wrapper >>> .el-table td .cell {
    display: flex;
}
.notice-list-wrapper >>> .el-table .el-table-column--selection .cell {
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.un-operate-col {
    flex: 1;
    cursor: pointer;
}
.operate-col {
    flex: 1;
}
</style>