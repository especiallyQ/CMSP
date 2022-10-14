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
          <el-button type="primary" size="small" style="width: 104px">{{
            $t("depository.createTemplate")
          }}</el-button>
          <el-button type="primary" size="small" style="width: 104px">{{
            $t("depository.saveDepository")
          }}</el-button>
        </div>
      </div>
      <div class="depository-list">
      </div>
    </div>
</template>

<script>
import {
  getAppChain4Depo,
  getContractsByChain,
  getDepoTemplateByContract,
} from "@/util/api";

export default {
  name: "depositoryList",

  data() {
    return {
      appChainId: "", //被选中应用链Id
      contractNameId: "", //被选中合约Id
      templateId: "", //被选中存证模板Id
      appChainList: [], //应用链列表
      contractNameList: [], // 合约名称列表
      templateList: [], //存证模板列表
    };
  },

  methods: {
    // 点击应用链下拉框获取数据
    handleAppChainChange() {
      this.getSelectContractName();
    },
    // 点击合约名称下拉框获取数据
    handleContractNameChange() {
      this.getSelectTemplateName();
    },
    // 点击存证模板下拉框获取数据
    handleTemplateChange() {},

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
      const res = await getDepoTemplateByContract(this.contractNameId);
      if (res.data.code === 0) {
        this.templateList = res.data.data;
        this.templateId = res.data.data[0].id;
      } else {
        this.$message({
          message: this.$chooseLang(res.data.code),
          type: "error",
          duration: 2000,
        });
      }
    },
  },

  mounted() {
    this.getSelectAppChain();
  },
};
</script>

<style scoped>
.module-wrapper {
  position: relative;
  height: 500px;
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

.right-search-tabs {
  width: 228px;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
}

.depository-list{
  width: 100%;
  height: 50vh;
  background-color: red;
}
</style>