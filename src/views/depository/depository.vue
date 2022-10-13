<template>
  <div class="depository_wrapper">
    <ContentHead :headTitle="$t('title.depositoryTitle')"></ContentHead>
    <div class="module-wrapper">
      <div class="search-tabs">
        <div class="left-search-tabs">
          <el-form :inline="true" label-width="60px" class="search-form">
            <el-form-item :label="$t('blockchain4App.appChain')">
              <el-select
                v-model="appChainId"
                style="width: 140px"
                @change="handleFilterChange"
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
            <el-form-item :label="$t('chainEvent.contractName')">
              <el-select
                v-model="contractNameId"
                style="width: 140px"
                @change="handleFilterChange"
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
                @change="handleFilterChange"
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
          <el-button type="primary" size="small" style="width: 104px"
            >新建存证模板</el-button
          >
          <el-button type="primary" size="small" style="width: 104px"
            >录入存证信息</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead";
import {
  getAppChain4Depo,
  getContractsByChain,
  getDepoTemplateByContract,
} from "@/util/api";

export default {
  name: "depository",

  components: {
    ContentHead,
  },

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

  watch: {
    appChainId: {
      handler() {
        this.getSelectContractName();
      },
      immediate: true,
    },

    contractNameId: {
      handler() {
        this.getSelectTemplateName();
      },
      immediate: true,
    },
  },

  methods: {
    // 点击应用链下拉框获取数据
    handleFilterChange() {},

    // 获取数据通用处理方法
    handleGetData(res, abs) {
      if (res.data.code) {
        abs = res.data.data || [];
      } else {
        this.$message({
          message: this.$chooseLang(res.data.code),
          type: "error",
          duration: 2000,
        });
      }
    },

    // 获取应用链下拉数据
    getSelectAppChain() {
      getAppChain4Depo().then((res) => {
        if (res.data.code === 0) {
          this.appChainList = res.data.data || [];
        } else {
          this.$message({
            message: this.$chooseLang(res.data.code),
            type: "error",
            duration: 2000,
          });
        }
      });
    },

    // 获取合约名称下拉数据
    async getSelectContractName() {
      const res = await getContractsByChain(this.appChainId);
      if (res.data.code === 0) {
        this.contractNameList = res.data.data || [];
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
      console.log(res);
      if (res.data.code === 0) {
        this.templateList = res.data.data || [];
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
  display: flex;
  height: 500px;
  background-color: #fff;
}
.search-tabs {
  width: 100%;
  height: 80px;
  padding: 30px 20px 18px 20px;
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
</style>