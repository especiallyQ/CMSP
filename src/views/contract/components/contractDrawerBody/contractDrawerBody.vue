<template>
  <div class="contractDrawer">
    <el-checkbox
      :disabled="!isCreator"
      class="contractDrawer-title"
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >{{
        `${this.$t("text.batchTipPrefix")} ${checkNum} ${this.$t(
          "text.batchTipSuffix"
        )}`
      }}</el-checkbox
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
            @click="drawerNavBtn($event, obj.id, navObj.name, currentObj, obj)"
          />
        </template>
      </ContractDrawerCard>

      <el-button type="primary" class="addContractTemplateVersion">{{
        $t("contracts.addContractTemplateVersion")
      }}</el-button>

      <el-dialog
        :title="this.$t('contracts.contractTemplateVersionCopyText')"
        class="dialog"
        :visible.sync="dialogShow"
        width="30%"
        :modal="false"
        center
        :close-on-click-modal="false"
      >
        <div class="dialog-body">
          <p>
            <span style="color: red">*</span
            ><span class="dialog-line-title">{{
              this.$t("contracts.contractTemplateName")
            }}</span
            ><el-input
              @blur="valiData($event, 'inputContractTemplateName')"
              v-model="copyReqData.templateName"
              :placeholder="this.$t('contracts.inputContractTemplateName')"
            ></el-input>
            <span class="warning">
              <div>
                {{ copyTemplateNameWarn }}
              </div>
            </span>
          </p>
          <p>
            <span style="color: red">*</span
            ><span class="dialog-line-title">{{
              this.$t("contracts.contractTemplateVisibility")
            }}</span>
            <el-select
              v-model="copySelectValue"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(obj, index) in versionList"
                :key="obj[index]"
                :label="$t(`permission.${obj[index]}`)"
                :value="$t(`permission.${obj[index]}`)"
              >
              </el-option>
            </el-select>
          </p>
          <p>
            <span style="color: red">*</span
            ><span class="dialog-line-title">{{
              this.$t("contracts.contractTemplateVersion")
            }}</span
            ><el-input
              @blur="valiData($event, 'inputContractTemplateVersion')"
              v-model="copyReqData.templateVersion"
              :placeholder="this.$t('contracts.inputContractTemplateVersion')"
            ></el-input>
            <span class="warning">
              <div>
                {{ copyTemplateVersionWarn }}
              </div>
            </span>
          </p>
          <p>
            <span
              class="
                dialog-line-title dialog-line-title-contractTemplateDescription
              "
              >{{ this.$t("contracts.contractTemplateDescription") }}</span
            ><el-input
              type="textarea"
              :rows="5"
              resize="none"
              v-model="copyReqData.description"
              :placeholder="
                this.$t('contracts.inputContractTemplateDescription')
              "
            ></el-input>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogSelectBtn($event, false)">取 消</el-button>
          <el-button type="primary" @click="dialogSelectBtn($event, true)"
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

import {
  downloadContractTemplateVersion,
  copyContractTemplateVersion,
} from "@/util/api";
import { root as Root } from "@/util/permissionConstant";
import { chooseLang } from "@/util/errcode";
import { JSONSwitchFormData } from '@/util/util'

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
    propCurrentObj: {
      type: Object,
      default: () => {
        return {};
      },
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
      versionList: [{ 0: "all" }, { 1: "group" }, { 2: "owner" }],
      originTemplateName: "",
      copySelectValue: "",
      copyTextarea: "",
      copyTemplateNameWarn: "",
      copyTemplateVersionWarn: "",
      copyReqData: {
        id: "",
        templateId: "",
        templateVersion: "",
        description: "",
        templateName: "",
        templateSource: "",
      },
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

        let filterRoot = [Root.AD_Admin, Root.PO_Admin, Root.PU_Admin];

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

          let root = localStorage.getItem("root") || "";
          contractDrawerBottomList.forEach((obj) => {
            if (this.propCreator == user) {
              obj.propAction = true;
            } else if (filterRoot.includes(root)) {
              filterList.push("copyContractTemplateVersion");
              if (filterList.includes(obj.name)) {
                obj.propAction = true;
              } else {
                obj.propColor = "#969494";
              }
              filterList.pop();
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
    currentObj: {
      get() {
        return this.propCurrentObj;
      },
    },
    copyVisivility: {
      get() {
        let versionObj = this.versionList.filter((obj, index) => {
          return this.$t(`permission.${obj[index]}`) == this.copySelectValue;
        })[0];
        if (versionObj) {
          return Object.keys(versionObj)[0];
        }
      },
    },
  },
  methods: {
    valiData(e, key) {
      switch (key) {
        case "inputContractTemplateName":
          if (!this.copyReqData.templateName) {
            this.copyTemplateNameWarn = this.$t(
              "contracts.inputContractTemplateName"
            );
          } else {
            this.copyTemplateNameWarn = "";
          }
          break;
        case "inputContractTemplateVersion":
          if (!this.copyReqData.templateVersion) {
            this.copyTemplateVersionWarn = this.$t(
              "contracts.selectContractTemplateVersion"
            );
          } else {
            this.copyTemplateVersionWarn = "";
          }
          break;
        default:
          break;
      }
    },
    async dialogSelectBtn(flag) {
      if (flag) {
        if (!this.copyTemplateNameWarn && !this.copyTemplateVersionWarn) {
          try {
            if (this.originTemplateName == this.copyReqData.templateName) {
              this.$message({
                message: this.$t("text.contractExist"),
                type: "warning",
              });
            } else {
              let requestData = {
                ...this.copyReqData,
                visibility: this.copyVisivility,
              };

              let formData = JSONSwitchFormData(requestData)

              const { data } = await copyContractTemplateVersion(formData);
              console.log(data);
              if (data.code == 202145) {
                this.$message({
                  message: chooseLang(data.code),
                  type: "warning",
                });
              } else {
                this.$message({
                  message: this.$t("text.addSuccess"),
                  type: "success",
                });
                return (this.dialogShow = false);
              }
            }
          } catch (e) {
            this.$message({
              message: e.msg || e.message,
              type: "warning",
            });
          }
        }
      } else {
        return (this.dialogShow = false);
      }
    },
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
    copyContractTamplateVersion(obj, vObj) {
      console.log(obj, vObj);

      this.copyTemplateNameWarn = "";
      this.copyTemplateVersionWarn = "";

      this.copyReqData.templateName = obj.templateName;
      this.originTemplateName = obj.templateName;

      this.copySelectValue = obj.data[this.$t("table.templateVisibilityShort")];

      this.copyReqData.templateVersion = vObj.templateVersion;
      this.copyReqData.description =
        obj.data[this.$t("table.templateDescriptionShort")] ==
        this.$t("text.noRemark")
          ? ""
          : obj.data[this.$t("table.templateDescriptionShort")];

      this.copyReqData.id = vObj.id;
      this.copyReqData.templateId = vObj.templateId;

      this.copyReqData.templateSource = vObj.templateSource;
      this.dialogShow = !this.dialogShow;
    },
    async drawerNavBtn(e, id, name, Obj, vObj) {
      switch (name) {
        case "downloadContractTemplate":
          this.downloadContractTemplate(id);
          break;
        case "copyContractTemplateVersion":
          this.copyContractTamplateVersion(Obj, vObj);
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

.dialog {
  width: 100vw;
  min-width: 1000px;
}

.dialog-body {
  width: 100%;
}

.dialog-body p {
  position: relative;
  display: flex;
  white-space: nowrap;
  line-height: 35px;
}

.dialog-body .dialog-line-title {
  margin-right: 15px;
  margin-bottom: 20px;
  font-size: 10px;
  margin-left: 4px;
  font-weight: 300;
}

.dialog-body .dialog-line-title-contractTemplateDescription {
  margin-left: 57px;
}

.dialog >>> .el-dialog__footer {
  text-align: right;
}

.warning {
  position: absolute;
  width: 100px;
  bottom: 10%;
  left: 100px;
  text-align: center;
  font-size: 13px;
  color: red;
  height: 20px;
}
</style>