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
        :prop="this.$t('table.templateOperation')"
        min-width="300"
      >
        <template slot-scope="scope">
          <div class="operation-container">
            <ul>
              <li
                v-for="obj in scope.row[$t('table.templateOperation')]"
                :key="obj.name"
              >
                <el-button
                  class="operationItems"
                  :style="{ color: obj.propColor }"
                  :disabled="!obj.propAction"
                  >{{ $t(`contracts.${obj.name}`) }}</el-button
                >
              </li>
            </ul>
          </div>
        </template>
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
    operationContract(e, val, scope) {
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
    };
  },
  computed: {
    initTableData: {
      get() {
        let tableData = this.propTableData
        let drawList = [];

        tableData.forEach((obj, index) => {
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
          newObj[this.$t("table.templateOperation")] = obj.navList;
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

.operationItems {
  border: none;
  padding: 0;
  font-size: 8px;
  font-weight: 500;
  background-color: transparent !important;
}

.operationItems:hover {
  color: initial;
}
</style>