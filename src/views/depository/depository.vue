<template>
  <div class="depository_wrapper">
    <ContentHead :headTitle="$t('title.depositoryTitle')"></ContentHead>
    <div class="module-wrapper">
      <div class="search-tabs">
        <div class="left-search-tabs">
          <el-form :inline="true" label-width="60px" class="search-form">
            <el-form-item :label="$t('blockchain4App.appChain')">
              <el-select
                v-model="id.appChainId"
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
                v-model="id.contractNameId"
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
                v-model="id.templateId"
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
        <div
          class="right-search-tabs"
          v-if="
            (role === 'PU_Admin' && chainIdentity) ||
            (role === 'AD_Admin' && chainIdentity) ||
            (role === 'PU_Operator' && chainIdentity)
          "
        >
          <el-button
            type="primary"
            size="small"
            v-if="role === 'PU_Admin' || role === 'AD_Admin'"
            @click="changeTemplateDialog(true)"
            >{{ $t("depository.createTemplate") }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            v-if="
              role === 'PU_Admin' ||
              (role === 'PU_Operator' && chainIdentity) ||
              role === 'AD_Admin'
            "
            @click="changeAllDialog(true, 0)"
            >{{ $t("depository.saveDepository") }}</el-button
          >
        </div>
      </div>
      <div class="depository-list">
        <el-table
          v-loading="loading"
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
              <el-button
                type="text"
                class="el-button-text"
                @click="changeAllDialog(true, 1, scope.row)"
                :disabled="role === 'PO_Admin' || role === 'PO_Operator'"
                >{{ $t("text.update") }}</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                @click="goDepositoryHis(scope.row)"
                :disabled="role === 'PO_Admin' || role === 'PO_Operator'"
                >{{ $t("depository.history") }}</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                @click="changeAllDialog(true, 2, scope.row)"
                :disabled="role === 'PO_Admin' || role === 'PO_Operator'"
                >{{ $t("depository.validate") }}</el-button
              >
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
        v-if="createTemplateDialogVisible"
        :createTemplateDialogVisible.sync="createTemplateDialogVisible"
        @updateTemplateDialog="changeTemplateDialog"
        @getSelectTemplateName="getSelectTemplateName"
      ></CreateTemplateDialog>
      <AllDialog
        v-if="allDialogVisible"
        :visible.sync="allDialogVisible"
        :flag="allDialogFlag"
        :templateName="allDialogTemplateData"
        :editData="editData"
        :id="id"
        @updateAllDialog="changeAllDialog"
      ></AllDialog>
    </div>
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
import ContentHead from "@/components/contentHead";
import CreateTemplateDialog from "@/views/depository/templateDialog/createTemplateDialog";
import AllDialog from "@/views/depository/templateDialog/allDialog";
export default {
  name: "depositoryList",

  components: {
    CreateTemplateDialog,
    ContentHead,
    AllDialog,
  },

  data() {
    return {
      id: {
        appChainId: "", //被选中应用链Id
        contractNameId: "", //被选中合约Id
        templateId: "", //被选中存证模板Id
      },
      appChainList: [], //应用链列表
      contractNameList: [], // 合约名称列表
      templateList: [], //存证模板列表
      newTableHeader: [], //存证模板表格表头
      newTableData: [], //存证模板表格数据
      currentPage: 1, // 分页-当前页码
      pageSize: 10, // 分页-每页数据条目数
      total: 0, // 分页-数据条目总数
      TableHeaderFlag: false, //存证模板表格表头是否显示
      loading: false, //loading标识
      role: localStorage.getItem("root"), // 登录账号的类型(角色)
      chainIdentity: localStorage.getItem("chainIdentity"), //链上用户身份

      createTemplateDialogVisible: false, //新建存证模板Dialog是否显示
      allDialogVisible: false, //录入存证信息、编辑、数据校验Dialog是否显示
      allDialogFlag: 0, //区分  0录入存证信息、 1编辑、 2数据校验 Dialog标识
      allDialogTemplateData: null, //当前存证模板信息
      editData: null, //编辑当前选中的数据
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
      this.loading = true;
      this.getDepositoryData();
    },

    // 切换新建存证模板Dialog是否显示
    changeTemplateDialog(val) {
      this.createTemplateDialogVisible = val;
    },

    // 切换录入存证信息、编辑、数据校验Dialog是否显示
    changeAllDialog(val, flag = 0, data) {
      if (this.templateList.length > 0) {
        this.allDialogFlag = flag;
        this.editData = data;
        this.allDialogVisible = val;
        this.allDialogTemplateData = this.templateList.filter((item) => {
          return item.id === this.id.templateId;
        })[0].name;
      } else {
        this.allDialogFlag = false;
        this.$message({
          message: "请先选择模板数据",
          type: "warning",
          duration: 2000,
        });
      }

      if (!val && flag) {
        this.getDepositoryData();
      }
    },

    //  跳转历史版本
    goDepositoryHis(row) {
      const { appChainId, contractNameId, templateId } = this.id;
      this.$router.push(
        `/depositoryHis/${appChainId}/${contractNameId}/${templateId}/${row.id}`
      );
    },

    // 获取应用链下拉数据
    getSelectAppChain() {
      getAppChain4Depo()
        .then((res) => {
          if (res.data.code === 0) {
            this.appChainList = res.data.data;
            if (this.appChainList.length > 0) {
              this.id.appChainId = res.data.data[0].id;
              this.getSelectContractName();
            }
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },

    // 获取合约名称下拉数据
    getSelectContractName() {
      getContractsByChain(this.id.appChainId)
        .then((res) => {
          if (res.data.code === 0) {
            this.contractNameList = res.data.data;
            if (this.contractNameList.length > 0) {
              this.id.contractNameId = res.data.data[0].id;
              this.getSelectTemplateName();
            }
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },

    // 获取存证模板下拉数据
    getSelectTemplateName(flag) {
      this.currentPage = 1;
      getDepoTemplateByContract(this.id.contractNameId)
        .then((res) => {
          if (res.data.code === 0) {
            this.templateList = res.data.data;
            if (this.templateList.length > 0) {
              if (flag) {
                let maxId = [];
                for (let key of this.templateList) {
                  maxId.push(key.id);
                }
                this.id.templateId = String(Math.max(...maxId));
              } else {
                this.id.templateId = res.data.data[0].id;
              }
              this.getDepositoryData();
            }
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },

    // 获取存证列表数据
    getDepositoryData() {
      this.loading = true;
      if (this.templateList.length > 0) {
        getDepositoryList({
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          templateId: this.id.templateId,
        })
          .then((res) => {
            // 列表表头数据
            this.newTableHeader = [];
            for (let key of res.data.header) {
              this.newTableHeader.push({
                enName: key.parameterName,
                name: key.parameterName,
                props: key.parameterName,
                align: "center",
                width: "150px",
              });
            }

            this.total = res.data.totalCount;

            // 列表表格数据
            this.newTableData = [];
            for (let key of res.data.data) {
              this.newTableData.push({
                ...JSON.parse(key.content),
                id: key.id,
                submitTime: getDate(key.submitTime),
                validateTime: getDate(key.validateTime),
              });
            }
            this.loading = false;
            this.TableHeaderFlag = true;
          })
          .catch(() => {
            this.$message({
              message: this.$t("text.systemError"),
              type: "error",
              duration: 2000,
            });
          });
      } else {
        this.$message({
          type: "error",
          message: this.$t("depository.selectTemplate"),
        });
      }
    },
  },

  mounted() {
    // 获取应用链数据
    this.getSelectAppChain();
  },

  computed: {
    // 计算最后渲染表头信息
    tableHeader() {
      let headerData = [
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
      return this.newTableHeader.concat(headerData);
    },
  },
};
</script>

<style scoped>
.module-wrapper {
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
  margin-bottom: 10px;
}

.pagination {
  width: 100%;
  height: 200px;
}

.el-button-text {
  background-color: transparent !important;
  border: 1px solid transparent !important;
}
</style>