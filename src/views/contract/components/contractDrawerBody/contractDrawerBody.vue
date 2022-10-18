<template>
  <div class="contractDrawer">
    <el-checkbox
      :disabled="!isCreator"
      class="contractDrawer-title"
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >{{ `已选 ${checkNum} 项` }}</el-checkbox
    >
    <div class="deleteBtn-box">
      <el-button
        type="danger"
        size="small"
        class="deleteBtn"
        :disabled="!isCreator"
        >{{ $t("contracts.deleteVersion") }}</el-button
      >
    </div>
    <div style="margin: 15px 0"></div>
    <el-checkbox-group
      v-model="checkedList"
      @change="handleCheckedCitiesChange"
    >
      <ContractDrawerCard
        v-for="obj in templateVersionList"
        :key="obj.id"
        :propRemark="description"
      >
        <template v-slot:checkBox>
          <el-checkbox :label="obj" :disabled="!isCreator"
            ><span class="versionIcon">v</span
            >{{ `${obj.templateVersion}` }}</el-checkbox
          >
        </template>
        <template v-slot:checkBox2>
          <BottomNav
            v-for="(navObj, index) in obj.bottomList"
            :key="index"
            :propRemark="navObj.remark"
            :propAction="navObj.propAction"
            :propColor="navObj.propColor"
            :propIconName="navObj.propIconName"
            @click="drawerNavBtn($event, obj.id, navObj.name, navObj)"
          />
        </template>
      </ContractDrawerCard>

      <el-button type="primary" class="addContractTemplateVersion">{{
        $t("contracts.addContractTemplateVersion")
      }}</el-button>

      <el-dialog
        :title="this.$t('contracts.contractTemplateVersionCopyText')"
        :visible.sync="dialogShow"
        width="30%"
        :modal="false"
      >
        <span>需要注意的是内容是默认不居中的</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogShow = false">取 消</el-button>
          <el-button type="primary" @click="dialogShow = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-checkbox-group>
  </div>
</template>

<script>
import ContractDrawerCard from "./components/contractDrawerCard.vue";
import BottomNav from "@/components/templateCard/components/bottomNav.vue";

import { downloadContractTemplateVersion } from "@/util/api";

export default {
  name: "contractDrawer",
  components: {
    ContractDrawerCard,
    BottomNav,
  },
  props: {
    propCreator: {
      type: String,
      default: "",
      required: true,
    },
    propDescription: {
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      checkAll: false,
      checkedList: [],
      isIndeterminate: true,
      checkNum: 0,
      dialogShow: false,
    };
  },
  computed: {
    templateVersionList: {
      get() {
        let versionList =
          this.$store.state.contractTemplate.templateVersionList.data;

        let len = versionList ? versionList.length : 0;

        let user = localStorage.getItem("user");

        let filterList = ["downloadContractTemplate", "editCode"];

        for (let i = 0; i < len; i++) {
          let contractDrawerBottomList = [
            {
              name: "downloadContractTemplate",
              remark: this.$t("contracts.downloadContractTemplate"),
              propIconName: "cmsp-icon-xiazai",
              propAction: false,
              propColor: "#62a2eb",
            },
            {
              name: "copyContractTemplateVersion",
              remark: this.$t("contracts.copyContractTemplateVersion"),
              propIconName: "cmsp-icon-fuzhi",
              propAction: false,
              propColor: "#62a2eb",
            },
            {
              name: "editCode",
              remark: this.$t("contracts.editCode"),
              propIconName: "cmsp-icon-wangzhan",
              propAction: false,
              propColor: "#62a2eb",
            },
            {
              name: "updateVersion",
              remark: this.$t("contracts.updateVersion"),
              propIconName: "cmsp-icon-shezhi",
              propAction: false,
              propColor: "#62a2eb",
            },
            {
              name: "deleteVersion",
              remark: this.$t("contracts.deleteVersion"),
              propIconName: "cmsp-icon-guanbi1",
              propAction: false,
              propColor: "red",
            },
          ];
          contractDrawerBottomList.forEach((obj) => {
            if (this.propCreator == user) {
              obj.propAction = true;
            } else {
              if (filterList.includes(obj.name)) {
                obj.propAction = true;
              } else {
                obj.propColor = "#969494";
              }
            }
            obj.id = versionList[i].id;
          });
          versionList[i].bottomList = contractDrawerBottomList;
        }
        return versionList;
      },
    },
    isCreator: {
      get() {
        let user = localStorage.getItem("user");
        return this.propCreator == user;
      },
    },
    description: {
      get() {
        return this.propDescription;
      },
    },
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedList = val ? this.templateVersionList.data : [];
      this.checkNum = this.checkedList.length;
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      this.checkNum = value.length;
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.templateVersionList.data.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.templateVersionList.data.length;
    },
    async downloadContractTemplate(id) {
      let { data } = await downloadContractTemplateVersion(id);
      var blob = new Blob([data], {
        type: "application/pdf;chartset=UTF-8",
      });

      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);

      a.setAttribute("href", url);
      a.setAttribute("download", "filename.zip");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    copyContractTamplateVersion(navObj) {
      this.dialogShow = !this.dialogShow;
    },
    async drawerNavBtn(e, id, name, navObj) {
      switch (name) {
        case "downloadContractTemplate":
          this.downloadContractTemplate(id);
          break;
        case "copyContractTemplateVersion":
          this.copyContractTamplateVersion(navObj);
          break;
        case "editCode":
          break;
        case "updateVersion":
          break;
        case "deleteVersion":
          break;

        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.contractDrawer {
  padding: 10px 20px !important;
}

.contractDrawer-title {
  margin-left: 10px;
  margin-right: 18px;
  font-weight: 600;
}

.deleteBtn-box {
  display: inline-block;
  padding: 0 0 0 18px;
  border-left: 2px solid #edeef3;
}

.addContractTemplateVersion {
  width: 100%;
}
</style>