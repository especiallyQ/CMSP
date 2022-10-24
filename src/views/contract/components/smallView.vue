<template>
  <div class="smallView">
    <el-table :data="initTableData.drawList" style="width: 100%" align="center">
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
                  @click="operationContract($event, obj.name, scope)"
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
    findCurrentObj(templateName) {
      let currentObj = this.initTableData.tableData.filter((obj) => {
        return obj.templateName == templateName;
      });

      return currentObj;
    },
    // deleteTemplate(templateName){
    //   let currentObj =  this.findCurrentObj(templateName)
    // },
    operationContract(e, val, scope) {
      let currentObj = this.findCurrentObj(
        scope.row[this.$t("table.templateName")]
      )[0];
      console.log(currentObj);
      let versionCount = currentObj.data[this.$t('table.templateVersionCount')]
      let description = currentObj.data[this.$t('table.templateDescriptionShort')]
      switch (val) {
        case "deleteTemplate":
          this.$emit("deleteTemplate", {
            id: currentObj.id,
            templateName: currentObj.templateName,
          });
          break;
        case "updateTemplate":
          this.$emit("updateTemplate", {
            id: currentObj.id,
            templateName: currentObj.templateName,
            versionCount,
            creator: currentObj.creator,
            description,
            currentObj,
          });
          break;
        case "addContractTemplateVersion":
          this.$emit("addContractTemplateVersion",{
            id: currentObj.id,
            templateName: currentObj.templateName,
            versionCount,
            creator: currentObj.creator,
            description,
            currentObj,
          })
          break;
        case "viewContractTemplateVersion":
          this.$emit("viewContractTemplateVersion",{
            id: currentObj.id,
            templateName: currentObj.templateName,
            versionCount,
            creator: currentObj.creator,
            description,
            currentObj,
          })
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
        let tableData = this.propTableData;
        let drawList = [];
        console.log(tableData);

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
        return {
          drawList,
          tableData,
        };
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