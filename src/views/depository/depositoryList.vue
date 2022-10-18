<template>
  <div class="module-wrapper">
    <div class="search-tabs">
      <div class="left-search-tabs">
        <el-form :inline="true" label-width="60px" class="search-form">
          <el-form-item :label="$t('blockchain4App.appChain')">
            <el-select
              v-model="appChainId"
              style="width: 140px"
              @change="handleAppChainChange"
            >
              <el-option
                v-for="item in appChainList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-form :inline="true" label-width="60px" class="search-form">
          <el-form-item :label="$t('contracts.contractName')">
            <el-select
              v-model="contractNameId"
              style="width: 140px"
              @change="handleContractNameChange"
            >
              <el-option
                v-for="item in contractNameList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-form :inline="true" label-width="60px" class="search-form">
          <el-form-item :label="$t('depository.template')">
            <el-select
              v-model="templateId"
              style="width: 140px"
              @change="handleTemplateChange"
            >
              <el-option
                v-for="item in templateList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-search-tabs">
        <el-button
          type="primary"
          size="small"
          @click="changeTemplateDialog(true)"
          >{{ $t("depository.createTemplate") }}</el-button
        >
        <el-button type="primary" size="small">{{
          $t("depository.saveDepository")
        }}</el-button>
      </div>
    </div>
    <div class="depository-list">
      <el-table
        :data="newTableData"
        style="width: 100%"
        :empty-text="$t('text.noData')"
      >
        <template v-if="TableHeaderFlag">
          <el-table-column
            v-for="item in tableHeader"
            :key="item.enName"
            :label="item.name"
            :align="item.align"
            :min-width="item.width"
            :prop="item.props"
            show-overflow-tooltip
          >
          </el-table-column>
        </template>
        <el-table-column
          v-if="TableHeaderFlag"
          align="center"
          :label="$t('text.operation')"
          min-width="225px"
        >
          <template slot-scope="scope">
            <el-button type="text">{{ $t("text.update") }}</el-button>
            <el-button type="text">{{ $t("depository.history") }}</el-button>
            <el-button type="text">{{ $t("depository.validate") }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <CreateTemplateDialog
      :visible.sync="createTemplateDialogVisible"
      @update="changeTemplateDialog"
      :appChainList="appChainList"
      v-if="createTemplateDialogVisible"
      @getSelectTemplateName="getSelectTemplateName"
    ></CreateTemplateDialog>
  </div>
</template>

<script>
import {
  getAppChain4Depo,
  getContractsByChain,
  getDepoTemplateByContract,
  getDepositoryList,
} from "@/util/api";

import { getDate } from "@/util/util";

import CreateTemplateDialog from "@/views/depository/templateDialog/createTemplateDialog";
export default {
  name: "depositoryList",

  components: {
    CreateTemplateDialog,
  },

  data() {
    return {
      appChainId: "", //被选中应用链Id
      contractNameId: "", //被选中合约Id
      templateId: "", //被选中存证模板Id
      appChainList: [], //应用链列表
      contractNameList: [], // 合约名称列表
      templateList: [], //存证模板列表
      newTableHeader: [], //存证模板表格表头
      newTableData: [], //存证模板表格数据
      currentPage: 1, // 分页-当前页码
      pageSize: 10, // 分页-每页数据条目数
      total: 0, // 分页-数据条目总数
      TableHeaderFlag: false, //存证模板表格表头是否显示
      createTemplateDialogVisible: false, //新建存证模板Dialog是否显示
    };
  },

  methods: {
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getDepositoryData();
    },
    // 切换当前页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDepositoryData();
    },

    // 点击应用链下拉框获取数据
    handleAppChainChange() {
      this.getSelectContractName();
    },
    // 点击合约名称下拉框获取数据
    handleContractNameChange() {
      this.getSelectTemplateName();
    },
    // 点击存证模板下拉框获取数据
    handleTemplateChange() {
      this.getDepositoryData();
    },

    // 点击新建存证模板显示Dialog
    async changeTemplateDialog(val) {
      if (val) {
        const res = await getAppChain4Depo();
        if (res.data.code === 0) {
          this.appChainList = res.data.data;
        } else {
          this.$message({
            message: this.$chooseLang(res.data.code),
            type: "error",
            duration: 2000,
          });
        }
      }
      this.createTemplateDialogVisible = val;
    },

    // 获取应用链下拉数据
    async getSelectAppChain() {
      const res = await getAppChain4Depo();
      if (res.data.code === 0) {
        this.appChainList = res.data.data;
        if (this.appChainList.length > 0) {
          this.appChainId = res.data.data[0].id;
          this.getSelectContractName();
        }
      } else {
        this.$message({
          message: this.$chooseLang(res.data.code),
          type: "error",
          duration: 2000,
        });
      }
    },

    // 获取合约名称下拉数据
    async getSelectContractName() {
      const res = await getContractsByChain(this.appChainId);
      if (res.data.code === 0) {
        this.contractNameList = res.data.data;
        if (this.contractNameList.length > 0) {
          this.contractNameId = res.data.data[0].id;
          this.getSelectTemplateName();
        }
      } else {
        this.$message({
          message: this.$chooseLang(res.data.code),
          type: "error",
          duration: 2000,
        });
      }
    },

    // 获取存证模板下拉数据
    async getSelectTemplateName() {
      this.currentPage = 1;
      const res = await getDepoTemplateByContract(this.contractNameId);
      if (res.data.code === 0) {
        this.templateList = res.data.data;
        if (this.templateList.length > 0) {
          this.templateId = res.data.data[0].id;
          this.getDepositoryData();
        }
      } else {
        this.$message({
          message: this.$chooseLang(res.data.code),
          type: "error",
          duration: 2000,
        });
      }
    },

    // 获取存证列表数据
    async getDepositoryData() {
      if (this.templateList.length > 0) {
        const depositoryListData = await getDepositoryList({
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          templateId: this.templateId,
        });

        // 列表表头数据
        this.newTableHeader = [];
        for (let key of depositoryListData.data.header) {
          this.newTableHeader.push({
            enName: key.parameterName,
            name: key.parameterName,
            props: key.parameterName,
            align: "center",
            width: "162px",
          });
        }

        this.total = depositoryListData.data.totalCount;

        // 列表表格数据
        this.newTableData = [];
        for (let key of depositoryListData.data.data) {
          this.newTableData.push({
            ...JSON.parse(key.content),
            id: key.id,
            submitTime: getDate(key.submitTime),
            validateTime: getDate(key.validateTime),
          });
        }

        this.TableHeaderFlag = true;
      } else {
        this.$message({
          type: "error",
          message: this.$t("depository.selectTemplate"),
        });
      }
    },
  },

  mounted() {
    this.getSelectAppChain();
  },

  computed: {
    tableHeader() {
      let data = [
        {
          enName: "submitTime",
          name: this.$t("depository.timestamp"),
          props: "submitTime",
          align: "center",
          width: "195px",
        },
        {
          enName: "validateTime",
          name: this.$t("depository.validateTime"),
          props: "validateTime",
          align: "center",
          width: "195px",
        },
      ];
      return this.newTableHeader.concat(data);
    },
  },
};
</script>

<style scoped>
.module-wrapper {
  position: relative;
  background-color: #fff;
}
.search-tabs {
  width: 100%;
  height: 80px;
  padding: 30px 20px 18px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.left-search-tabs {
  width: 638px;
  display: flex;
  justify-content: space-between;
  margin-left: 15px;
}
.el-select-label {
  height: 32px;
}
.el-select-label > span {
  padding-right: 12px;
}

.depository-list {
  width: 97%;
  margin: 0 auto;
}

.pagination {
  width: 100%;
  height: 200px;
}
</style>