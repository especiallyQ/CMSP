<template>
  <div class="smallView">
    <el-table :data="initTableData" style="width: 100%" align="center">
      <el-table-column
        align="center"
        v-for="(label, index) in titleList"
        :key="index"
        :prop="label"
        :label="label"
        min-width="110"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :prop="this.$t('table.templateDescription')"
        :label="this.$t('table.templateDescription')"
        min-width="200"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :label="this.$t('table.templateOperation')"
        min-width="300"
      >
        <div class="operation-container">
          <ul>
            <li @click="operationContract($event, 'delete')">
              {{ $t("contracts.deleteTemplate") }}
            </li>
            <li @click="operationContract($event, 'update')">
              {{ $t("contracts.updateTemplate") }}
            </li>
            <li @click="operationContract($event, 'add')">
              {{ $t("contracts.addContractTemplateVersion") }}
            </li>
            <li @click="operationContract($event, 'view')">
              {{ $t("contracts.viewContractTemplateVersion") }}
            </li>
          </ul>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "smallView",
  props: {
    propTableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    operationContract(e, val) {
      switch (val) {
        case "delete":
          break;
        case "update":
          break;
        case "add":
          break;
        case "view":
          break;
        default:
          break;
      }
    },
  },
  data() {
    return {
      titleList: [
        this.$t("table.templateName"),
        this.$t("table.templateCreator"),
        this.$t("table.templateVisibility"),
        this.$t("table.templateVersionCount"),
      ],
      tableData: this.propTableData,
    };
  },
  computed: {
    initTableData: {
      get() {
        let drawList = [];

        this.tableData.forEach((obj, index) => {
          let newObj = {};
          Object.keys(obj.data).forEach((key, index) => {
            if (key == this.$t("table.templateCreatorShort")) {
              newObj[this.$t("table.templateCreator")] = obj.data[key];
            } else if (key == this.$t("table.templateVisibilityShort")) {
              newObj[this.$t("table.templateVisibility")] = obj.data[key];
            } else {
              newObj[key] = obj.data[key];
            }
          });
          newObj[this.$t("table.templateName")] = obj.templateName;
          drawList.push(newObj);
        });

        return drawList;
      },
    },
  },
};
</script>

<style scoped>
.operation-container ul {
  display: flex;
  justify-content: space-evenly;
}

.operation-container ul li {
  color: #409eff;
  cursor: pointer;
}

.operation-container ul li:nth-child(1) {
  color: red;
}
</style>