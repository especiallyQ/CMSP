<template>
  <div class="depository_wrapper">
    <ContentHead
      :headTitle="$t('title.depositoryTitle')"
      :headSubTitle="$t('depository.history')"
    ></ContentHead>
    <div class="module-wrapper">
      <div class="goBack-tabs">
        <el-button type="small" @click="goBack">{{
          $t("text.back")
        }}</el-button>
      </div>
      <div class="depository-list">
        <el-table
          v-loading="loading"
          :data="tableData"
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
            ></el-table-column>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getDepositoryHistoryList } from "@/util/api";
import { getDate } from "@/util/util";
import ContentHead from "@/components/contentHead";
export default {
  name: "depositoryHis",
  components: {
    ContentHead,
  },

  data() {
    return {
      tableHeaderData: [], //用户自定义表头数据
      tableData: [], //用户列表数据
      TableHeaderFlag: false, //存证模板表格表头是否显示
      loading: true, //loading标识
    };
  },

  methods: {
    goBack() {
      this.$router.push("/depository");
    },

    getDepositoryHistory() {
      const { templateId, id } = this.$route.params;
      getDepositoryHistoryList({
        templateId,
        id,
      }).then((res) => {
        if (res.data.code === 0) {
          // 动态生成表头
          for (let key of res.data.header) {
            this.tableHeaderData.push({
              enName: key.parameterName,
              name: key.parameterName,
              props: key.parameterName,
              align: "center",
              width: "150px",
            });
          }
          for (let key of res.data.data) {
            this.tableData.push({
              ...JSON.parse(key.content),
              submitOrg: key.submitOrg,
              submitTime: getDate(key.submitTime),
            });
          }
          this.TableHeaderFlag = true;
          this.loading = false;
        } else {
          this.$message({
            message: this.$chooseLang(res.data.code),
            type: "error",
            duration: 2000,
          });
        }
      });
    },
  },

  mounted() {
    this.getDepositoryHistory();
  },

  computed: {
    tableHeader() {
      let headerData = [
        {
          enName: "submitOrg",
          name: this.$t("depository.org"),
          props: "submitOrg",
          align: "center",
          width: "195px",
        },
        {
          enName: "submitTime",
          name: this.$t("depository.timestamp"),
          props: "submitTime",
          align: "center",
          width: "195px",
        },
      ];
      return this.tableHeaderData.concat(headerData);
    },
  },
};
</script>

<style>
.goBack-tabs {
  width: 100%;
  height: 80px;
  padding: 30px 20px 18px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
}
</style>