<template>
  <div class="contract-template">
    <ContentHead :headTitle="$t('title.contractTemplate')" />
    <div class="card-template-container">
      <el-card class="box-card">
        <ContractHeader
          @toggleViewModeFn="toggleViewModeFn"
          :propCreateBtnShow="createBtnShow"
          @click="createContract"
          @search="search"
          v-bind:creator.sync="requiredData.creator"
          v-bind:templateName.sync="requiredData.templateName"
        />
        <transition name="fade-alert" mode="out-in" appear>
          <div v-if="toggleViewMode" key="largeView">
            <ul class="contract-cartList">
              <TemplateCard
                v-for="obj in contractTemplateList.newDataList"
                :key="obj.id"
                :propTitleIconColor="getRgb()"
                :propTitle="obj.templateName"
                :propDetilDate="obj.data"
              >
                <BottomNav
                  v-for="(navObj, index) in obj.navList"
                  :key="index"
                  :propRemark="navObj.propRemark"
                  :propIconName="navObj.propIconName"
                  :propAction="navObj.propAction"
                  :propColor="navObj.propColor"
                  @click="
                    navBtnClick(
                      $event,
                      navObj.name,
                      obj.id,
                      obj.templateName,
                      obj.data[$t('table.templateVersionCount')],
                      obj.creator,
                      obj.data[$t('table.templateDescriptionShort')],
                      obj
                    )
                  "
                />
              </TemplateCard>
            </ul>
          </div>
          <div v-else key="smallView">
            <SmallView
              :propTableData="contractTemplateList.newDataList"
              @deleteTemplate="deleteTemplate"
              @updateTemplate="updateTemplate"
              @addContractTemplateVersion="addContractTemplateVersion"
              @viewContractTemplateVersion="viewContractTemplateVersion"
            />
          </div>
        </transition>
        <PaginationView
          @changeHandleCurrent="changeHandleCurrent"
          @changeHandleSize="changeHandleSize"
          :propTotalNum="contractTemplateList.totalCount"
          :propCurrentPage.sync="requestData.pageNumber"
        />
      </el-card>
    </div>
    <el-drawer
      class="drawer"
      :title="`${drawer.title} 共 ${drawer.versionCount} 个版本`"
      :visible.sync="drawer.showFlag"
      :with-header="true"
      size="25%"
      :before-close="handleClose"
    >
      <ContractDrawerBody
        :propCreator="drawer.creator"
        :propDescription="drawer.description"
        :propCurrentObj="drawer.currentObj"
      />
    </el-drawer>
    <el-dialog
      :title="dialog.title"
      class="dialog"
      :visible="dialog.dialogShow"
      width="30%"
      center
      :before-close="beforeCloseDialog"
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
            v-model="updateOriginData.templateName"
            :placeholder="this.$t('contracts.inputContractTemplateName')"
          ></el-input>
          <span class="warning">
            <div>
              {{ updateTemplateNameWarn }}
            </div>
          </span>
        </p>
        <p>
          <span style="color: red">*</span
          ><span class="dialog-line-title">{{
            this.$t("contracts.contractTemplateVisibility")
          }}</span>
          <el-select
            v-model="updateOriginData.permisseSelectValue"
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
          <span
            class="
              dialog-line-title dialog-line-title-contractTemplateDescription
            "
            >{{ this.$t("contracts.contractTemplateDescription") }}</span
          ><el-input
            type="textarea"
            :rows="5"
            resize="none"
            v-model="updateOriginData.description"
            :placeholder="this.$t('contracts.inputContractTemplateDescription')"
          ></el-input>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateTemplateSelectBtn($event, false)">{{
          this.$t("text.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="updateTemplateSelectBtn($event, true)"
          >{{ this.$t("text.sure") }}</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :title="this.$t('contracts.contractTemplateVersionAddText')"
      class="dialog"
      :visible="addDialog.flag"
      width="30%"
      :modal="true"
      center
      :before-close="beforeCloseDialog2"
      :close-on-click-modal="false"
    >
      <div class="dialog-body">
        <p>
          <span style="color: red">*</span
          ><span class="dialog-line-title">{{
            this.$t("contracts.contractTemplateVersion")
          }}</span
          ><el-input
            @blur="valiAddData($event, 'inputContractTemplateVersion')"
            v-model="addFileData.templateVersion"
            :placeholder="this.$t('contracts.inputContractTemplateVersion')"
          ></el-input>
          <span class="warning">
            <div>
              {{ addDialog.templateVersionWarn }}
            </div>
          </span>
        </p>
        <p>
          <span class="dialog-line-title">{{
            this.$t("contracts.contractFileUpload")
          }}</span>

          <el-upload
            class="uploadFile"
            :file-list="uploadFileConfig.fileList"
            action=""
            ref="upload"
            :auto-upload="false"
            :on-exceed="uploadExceed"
            :before-upload="beforeUpload"
            :limit="uploadFileConfig.fileLimit"
          >
            <el-button size="small" type="primary">{{
              this.$t("text.upLoadFile")
            }}</el-button>
            <div slot="tip" class="el-upload__tip tip2">
              {{ this.$t("contracts.contractFileUploadDesc") }}
            </div>
          </el-upload>
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
            v-model="addFileData.description"
            :placeholder="this.$t('contracts.inputContractTemplateDescription')"
          ></el-input>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogSelectBtn($event, false)">{{
          this.$t("text.cancel")
        }}</el-button>
        <el-button type="primary" @click="addDialogSelectBtn($event, true)">{{
          this.$t("text.sure")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead.vue";
import dispatchKeys from "@/util/storeKeys/contractTemplate/dispatchKeys";
import mutationKeys from "@/util/storeKeys/contractTemplate/mutationsKeys";
import storageKeys from "@/util/storageKeys/contractTemplateStorageKey";
import TemplateCard from "@/components/templateCard/index.vue";
import BottomNav from "@/components/templateCard/components/bottomNav.vue";
import ContractHeader from "./components/contractHeader.vue";
import PaginationView from "@/components/paginationView.vue";
import SmallView from "./components/smallView.vue";
import ContractDrawerBody from "./components/contractDrawerBody/contractDrawerBody.vue";
import { permissionKeys, root as Root } from "@/util/permissionConstant";
import {
  deleteContractTemplate,
  addContractTemplate,
  modifyContractTemplate,
  addContractTemplateVersion,
} from "@/util/api";
import { chooseLang } from "@/util/errcode";
import { getDate, JSONSwitchFormData, rgb } from "@/util/util";

export default {
  name: "contractTemplate",
  components: {
    ContentHead,
    TemplateCard,
    BottomNav,
    ContractHeader,
    PaginationView,
    SmallView,
    ContractDrawerBody,
  },
  data: () => {
    return {
      pageSize: 1,
      showDataList: {
        creator: "templateCreatorShort",
        description: "templateDescriptionShort",
        descriptionEn: "templateDescriptionShort",
        versionCount: "templateVersionCount",
        templateName: "templateName",
        templateNameEn: "templateName",
        visibility: "templateVisibilityShort",
      },
      toggleViewMode: true,
      requestData: {
        pageNumber: 1,
        pageSize: 10,
      },
      requiredData: {
        creator: "",
        templateName: "",
      },
      createBtnShow: false,
      drawer: {
        showFlag: false,
        title: "",
        versionCount: 0,
        canDo: false,
        creator: "",
        description: "",
        currentObj: {},
      },
      dialog: {
        title: "",
        dialogShow: false,
      },
      updateOriginData: {
        id: "",
        templateName: "",
        description: "",
        permisseSelectValue: "",
        creatorId: "",
        creator: "",
        accountGroupName: "",
        accountGroupId: "",
        visibility: 0,
        createTime: "",
        modifyTime: "",
        operatorId: "",
        versionCount: "",
      },
      versionList: [{ 0: "all" }, { 1: "group" }, { 2: "owner" }],
      updateTemplateNameWarn: "",
      updateTemplateVersionWarn: "",
      addFileData: {
        templateId: "",
        templateVersion: "",
        templateName: "",
        description: "",
        visibility: "",
        uploadFile: null,
        lastVersion: "",
        templateSource: "",
      },
      addDialog: {
        flag: false,
        templateVersionWarn: "",
      },
      uploadFileConfig: {
        fileType: ["zip"],
        fileLimit: 1,
        fileList: [],
      },
    };
  },
  computed: {
    contractTemplateList: {
      get() {
        try {
          let { data, totalCount } =
            this.$store.state.contractTemplate.contractTemplateData.data;
          let dataLen = this.getArrayLenth(data);
          let newDataList = [];
          for (let i = 0; i < dataLen; i++) {
            let obj = {
              templateName: "",
              data: {},
            };

            // 处理底侧导航栏的权限问题

            //传入的默认模板，下方将会通过判断权限修改propAcion的Booleen
            let navData = [
              {
                name: "viewContractTemplateVersion",
                propRemark: this.$t("contracts.viewContractTemplateVersion"),
                propIconName: "cmsp-icon-chakan",
                propAction: false,
                propColor: "#62a2eb",
              },
              {
                name: "addContractTemplateVersion",
                propRemark: this.$t("contracts.addContractTemplateVersion"),
                propIconName: "cmsp-icon-tianjia",
                propAction: false,
                propColor: "#62a2eb",
              },
              {
                name: "updateTemplate",
                propRemark: this.$t("contracts.updateTemplate"),
                propIconName: "cmsp-icon-shezhi",
                propAction: false,
                propColor: "#62a2eb",
              },
              {
                name: "deleteTemplate",
                propRemark: this.$t("contracts.deleteTemplate"),
                propIconName: "cmsp-icon-guanbi1",
                propAction: false,
                propColor: "red",
              },
            ];
            let visibilityList = {
              0: this.$t("permission.all"),
              1: this.$t("permission.group"),
              2: this.$t("permission.owner"),
            };

            let root = localStorage.getItem("root");
            let user = localStorage.getItem("user");
            if (root) {
              let permission = permissionKeys.contract[root]
                ? permissionKeys.contract[root]
                : 0;
              //PU_AD_admin 对于是否是自己创建的模板，权限有两种情况
              if (root == Root.PU_Admin || root == Root.AD_Admin) {
                if (data[i].creator !== user) {
                  permission = permissionKeys.contract[`${root}2`];
                } else {
                  permission = permissionKeys.contract[root];
                }
              }
              if (
                (permission &
                  permissionKeys.modulePermission["contractTemplateAddText"]
                    .have) ===
                permissionKeys.modulePermission["contractTemplateAddText"].have
              ) {
                this.createBtnShow = true;
              }

              obj.navList = navData.map((navObj, indexObj) => {
                if (
                  (permission &
                    permissionKeys.modulePermission[navObj.name].have) ===
                  permissionKeys.modulePermission[navObj.name].have
                ) {
                  navObj.propAction = true;
                } else if (
                  (permission &
                    permissionKeys.modulePermission[navObj.name].pending) ===
                  permissionKeys.modulePermission[navObj.name].pending
                ) {
                  if (user === data[i].creator) {
                    navObj.propAction = true;
                  } else {
                    navObj.propAction = false;
                    navObj.propColor = "#969494";
                  }
                } else {
                  navObj.propAction = false;
                  navObj.propColor = "#969494";
                }

                return navObj;
              });
            }
            // 用于渲染模板Card标题
            obj.templateName = this.$t("text.noData");

            // 为每个模板添加ID字段用于查询以及标识
            obj.id = data[i].id || "";

            // 添加创建者字段
            obj.creator = data[i].creator || "";

            //添加用于按钮字段的数据
            obj.creatorId = data[i].creatorId || "";
            obj.accountGroupName = data[i].accountGroupName || "";
            obj.accountGroupId = data[i].accountGroupId || "";
            obj.createTime = data[i].createTime || "";
            obj.visibility = data[i].visibility || 0;

            //i18n转换
            for (let key in data[i]) {
              if (this.showDataList[key]) {
                let i18nName = this.$t(`table.${this.showDataList[key]}`);

                if (data[i][key] !== null) {
                  if (this.showDataList[key] !== "templateName") {
                    if (this.showDataList[key] !== "templateVisibilityShort") {
                      obj.data[i18nName] = data[i][key];
                    } else {
                      obj.data[i18nName] = visibilityList[data[i][key]];
                    }
                  } else {
                    obj.templateName = data[i][key];
                  }
                } else {
                  if (this.showDataList[key] !== "templateName") {
                    if (
                      !obj.data[i18nName] &&
                      i18nName === this.$t(`table.templateDescriptionShort`)
                    ) {
                      obj.data[i18nName] = this.$t("text.noRemark");
                    } else if (!obj.data[i18nName]) {
                      obj.data[i18nName] = this.$t("text.noData");
                    }
                  }
                }
              }
            }
            newDataList.push(obj);
          }
          return {
            newDataList,
            totalCount,
          };
        } catch (e) {}
      },
      set() {
        return {};
      },
    },
    originVisibilityId: {
      get() {
        let versionObj = this.versionList.filter((obj, index) => {
          return (
            this.$t(`permission.${obj[index]}`) ==
            this.updateOriginData.permisseSelectValue
          );
        })[0];
        if (versionObj) {
          return Object.keys(versionObj)[0];
        }
      },
    },
    templateVersionList: {
      get() {
        return this.$store.state.contractTemplate.templateVersionList.data;
      },
    },
  },
  methods: {
    search(e) {
      this.$store.dispatch(dispatchKeys.CONTRACT_TEMPLATE_LIST, {
        requestData: this.requestData,
        requiredData: this.requiredData,
      });
    },
    valiAddData(e, key) {
      switch (key) {
        case "inputContractTemplateVersion":
          if (!this.addFileData.templateVersion) {
            this.addDialog.templateVersionWarn = this.$t(
              "contracts.selectContractTemplateVersion"
            );
          } else {
            if (!this.valiVersion(this.addFileData.templateVersion)) {
              this.addDialog.templateVersionWarn = this.$t(
                "contracts.inputRuleVersion"
              );
            } else {
              this.addDialog.templateVersionWarn = "";
            }
          }
          break;
        default:
          break;
      }
    },
    async addDialogSelectBtn(e, flag) {
      if (flag) {
        this.valiAddData(e, "inputContractTemplateVersion");
        try {
          if (!this.addDialog.templateVersionWarn) {
            this.$refs.upload.submit();

            this.addFileData.lastVersion = this.templateVersionList[0]
              ? this.templateVersionList[0].templateVersion
              : 0;

            let formDate = JSONSwitchFormData(this.addFileData);
            const { data } = await addContractTemplateVersion(formDate);
            console.log(data);
            if (data.code == 0) {
              this.$message({
                message: this.$t("text.updateSuccessMsg"),
                type: "success",
              });

              this.$store.dispatch(dispatchKeys.CONTRACT_TEMPLATE_LIST, {
                requestData: this.requestData,
                requiredData: {
                  creator: "",
                  templateName: "",
                },
              });
              this.addDialog.flag = false;
              this.addFileData = {
                templateId: "",
                templateVersion: "",
                templateName: "",
                description: "",
                visibility: "",
                uploadFile: null,
                lastVersion: "",
                templateSource: "",
              };
              this.addDialog.templateVersionWarn = "";
            } else {
              this.$message.error({
                message: chooseLang(data.code),
              });
            }
          }
        } catch (e) {}
      } else {
        this.addFileData = {
          templateId: "",
          templateVersion: "",
          templateName: "",
          description: "",
          visibility: "",
          uploadFile: null,
          lastVersion: "",
          templateSource: "",
        };
        this.addDialog.flag = false;
        this.addDialog.templateVersionWarn = "";
      }
    },
    beforeUpload(file) {
      this.addFileData.uploadFile = file;
      if (file.type) {
        let ext = file.name.replace(/.+\./g, "").toLowerCase();
        if (this.uploadFileConfig.fileType.includes(ext)) {
          return true;
        } else {
          this.$message.error({
            message: this.$t("contracts.uploadFileInvalid"),
          });
          return false;
        }
      } else {
        this.$message.error({
          message: this.$t("contracts.uploadFileInvalid"),
        });
        return false;
      }
    },
    uploadExceed(files, fileList) {
      this.$message({
        message: this.$t("text.oneUploadFileTip"),
        type: "warning",
      });
    },
    valiVersion(version) {
      let re = /([1-9][0-9]{0,1})(\.([0-9]{1,3}))*/g;
      return version.match(re)[0] == version;
    },
    valiData(e, key) {
      switch (key) {
        case "inputContractTemplateName":
          if (
            !this.updateOriginData.templateName ||
            this.updateOriginData.templateName.length > 30
          ) {
            this.updateTemplateNameWarn = this.$t(
              "contracts.inputContractTemplateName"
            );
          } else {
            this.updateTemplateNameWarn = "";
          }
          break;
        default:
          break;
      }
    },
    getRgb() {
      return rgb();
    },
    toggleViewModeFn(flag) {
      this.toggleViewMode = flag;
    },
    getContractTemplateList(key = "update") {
      this.$store.dispatch(dispatchKeys.CONTRACT_TEMPLATE_LIST, {
        key: key,
        requestData: this.requestData,
        requiredData: this.requiredData,
      });
    },
    storageDataIsEmpty(keys) {
      return sessionStorage.getItem(keys) ? false : true;
    },
    storageDateIsTimeout(keys) {
      if (!this.storageDataIsEmpty(keys)) {
        let { timeout } = JSON.parse(sessionStorage.getItem(keys));

        if (timeout) {
          let nowTime = Date.now();
          return nowTime >= Number(timeout);
        }
      }
      //默认返回true，表示当前数据有误，将重新请求新数据
      return true;
    },
    changeHandleCurrent(val) {
      this.requestData.pageNumber = val;
      this.getContractTemplateList("changePage");
    },
    changeHandleSize(val) {
      this.requestData.pageSize = val;
      this.requestData.pageNumber = 1;
      this.getContractTemplateList();
      this.pageSize = val;
    },
    getArrayLenth(arr) {
      if (!arr) {
        return 0;
      }
      return arr.length;
    },
    viewContractTemplateVersion(
      {
        id,
      templateName,
      versionCount,
      creator,
      description,
      currentObj
      }
    ) {
      this.drawer.showFlag = !this.drawer.showFlag;
      this.drawer.title = templateName;
      this.drawer.versionCount = versionCount;
      this.drawer.creator = creator;
      this.drawer.description = description;
      this.drawer.currentObj = currentObj;

      this.$store.dispatch(dispatchKeys.TEMPLATE_VERSION_LIST, {
        templateId: id,
      });
    },
    async deleteTemplate({ id, templateName }) {
      this.$confirm(
        `${this.$t("text.confirmDelete")}${this.$t(
          "title.contractTemplate"
        )}${templateName}?`,
        {
          confirmButtonText: this.$t("text.sure"),
          cancelButtonText: this.$t("text.cancel"),
          center: true,
        }
      )
        .then(async () => {
          try {
            const { data } = await deleteContractTemplate(id);
            if (data.code == "202181") {
              this.$message.error({
                message: chooseLang("202181"),
              });
            } else {
              this.$message({
                message: this.$t("text.resetSuccess"),
                type: "success",
              });
              this.requestData.pageNumber = 1;
              this.getContractTemplateList();
            }
          } catch (e) {}
        })
        .catch(() => {});
    },
    updateTemplate({
      id,
      templateName,
      versionCount,
      creator,
      description,
      currentObj,
    }) {
      this.dialog.title = this.$t("contracts.contractTemplateModifyText");
      this.dialog.dialogShow = true;

      this.updateOriginData.permisseSelectValue =
        currentObj.data[this.$t("table.templateVisibilityShort")];
      this.updateOriginData.templateName = templateName;
      this.updateOriginData.description =
        description == this.$t("text.noRemark") ? "" : description;

      this.updateOriginData.id = id;
      this.updateOriginData.modifyTime = getDate(Date.now());
      this.updateOriginData.operatorId = localStorage.getItem("userId");
      this.updateOriginData.versionCount = versionCount;
      this.updateOriginData.creatorId = currentObj.creatorId;
      this.updateOriginData.creator = creator;
      this.updateOriginData.accountGroupName = currentObj.accountGroupName;
      this.updateOriginData.accountGroupId = currentObj.accountGroupId;
      this.updateOriginData.createTime = currentObj.createTime;
    },
    createContract(e) {
      this.dialog.title = this.$t("contracts.contractTemplateAddText");
      this.dialog.dialogShow = true;

      this.updateOriginData.permisseSelectValue = this.$t("permission.all");
      this.updateOriginData.templateName = "";
      this.updateOriginData.description = "";
    },
    updateTemplateSelectBtn(e, flag) {
      const contractTemplateAddText = async () => {
        let requestData = {
          templateName: this.updateOriginData.templateName,
          visibility: this.originVisibilityId,
          description: this.updateOriginData.description,
        };

        try {
          const { data } = await addContractTemplate(requestData);

          if (data.code == 0) {
            this.$message({
              message: this.$t("text.addSuccess"),
              type: "success",
            });

            this.dialog.title = "";
            this.dialog.dialogShow = false;
            this.updateTemplateNameWarn = "";
            this.updateTemplateVersionWarn = "";

            this.getContractTemplateList();
          } else {
            this.$message.error({
              message: chooseLang(data.code),
            });
          }
        } catch (e) {
          this.$message.error({
            message: this.$t("text.systemError"),
          });
        }
      };

      const contractTemplateModifyText = async () => {
        let requestData = {
          id: this.updateOriginData.id,
          templateName: this.updateOriginData.templateName,
          visibility: this.originVisibilityId,
          creatorId: this.updateOriginData.creatorId,
          creator: this.updateOriginData.creator,
          accountGroupName: this.updateOriginData.accountGroupName,
          accountGroupId: this.updateOriginData.accountGroupId,
          createTime: this.updateOriginData.createTime,
          modifyTime: this.updateOriginData.modifyTime,
          operatorId: this.updateOriginData.operatorId,
          versionCount: this.updateOriginData.versionCount,
        };
        if (this.updateOriginData.description) {
          requestData.description = this.updateOriginData.description;
        }

        try {
          const { data } = await modifyContractTemplate(requestData);

          if (data.code == 0) {
            this.$message({
              message: this.$t("text.addSuccess"),
              type: "success",
            });

            this.dialog.title = "";
            this.dialog.dialogShow = false;
            this.updateTemplateNameWarn = "";
            this.updateTemplateVersionWarn = "";

            this.getContractTemplateList();
          } else {
            this.$message.error({
              message: chooseLang(data.code),
            });
          }
        } catch (e) {
          this.$message.error({
            message: this.$t("text.systemError"),
          });
        }
      };

      if (flag) {
        if (!this.updateOriginData.templateName) {
          this.updateTemplateNameWarn = this.$t(
            "contracts.inputContractTemplateName"
          );
        }
        if (
          !this.updateTemplateNameWarn &&
          this.updateOriginData.templateName.length <= 30
        ) {
          switch (this.dialog.title) {
            case this.$t("contracts.contractTemplateAddText"):
              contractTemplateAddText();
              break;
            case this.$t("contracts.contractTemplateModifyText"):
              contractTemplateModifyText();
            default:
              break;
          }
        }
      } else {
        this.dialog.title = "";
        this.dialog.dialogShow = false;
        this.updateTemplateNameWarn = "";
        this.updateTemplateVersionWarn = "";
      }
    },
    addContractTemplateVersion({
      id,
      templateName,
      versionCount,
      creator,
      description,
      currentObj,
    }) {
      this.addDialog.flag = true;
      this.addFileData.templateId = id;
      this.addFileData.visibility = currentObj.visibility;

      this.$store.dispatch(dispatchKeys.TEMPLATE_VERSION_LIST, {
        templateId: id,
      });
    },
    beforeCloseDialog() {
      this.dialog.title = "";
      this.dialog.dialogShow = false;
      this.updateTemplateNameWarn = "";
      this.updateTemplateVersionWarn = "";

      this.updateOriginData.permisseSelectValue = "";
      this.updateOriginData.templateName = "";
      this.updateOriginData.description = "";
    },
    beforeCloseDialog2() {
      this.addFileData = {
        templateId: "",
        templateVersion: "",
        templateName: "",
        description: "",
        visibility: "",
        uploadFile: null,
        lastVersion: "",
        templateSource: "",
      };
      this.addDialog.flag = false;
      this.addDialog.templateVersionWarn = "";
    },
    navBtnClick(
      e,
      key,
      id,
      templateName,
      versionCount,
      creator,
      description,
      currentObj
    ) {
      console.log(key);
      switch (key) {
        case "viewContractTemplateVersion":
          this.viewContractTemplateVersion(
            {
              id,
            templateName,
            versionCount,
            creator,
            description,
            currentObj
            }
          );
          break;
        case "deleteTemplate":
          this.deleteTemplate({ id, templateName });
          break;
        case "updateTemplate":
          this.updateTemplate({
            id,
            templateName,
            versionCount,
            creator,
            description,
            currentObj,
          });
          break;
        case "addContractTemplateVersion":
          this.addContractTemplateVersion({
            id,
            templateName,
            versionCount,
            creator,
            description,
            currentObj,
          });
          break;
        default:
          break;
      }
    },
    handleClose() {
      this.drawer.showFlag = !this.drawer.showFlag;
      this.$store.commit(
        mutationKeys.SET_TEMPLATE_VERSION_LIST_IN_OUT_MODELE,
        {}
      );
    },
  },
  async created() {
    // 过期更新，有效期60秒
    if (this.storageDateIsTimeout(storageKeys.CONTRACT_TEMPLATE_DATA)) {
      this.getContractTemplateList();
    }
    //storage为空更新
    if (this.storageDataIsEmpty(storageKeys.CONTRACT_TEMPLATE_DATA)) {
      this.getContractTemplateList();
    }
    //当前用户名与保存信息不一致更新
    if (
      JSON.parse(sessionStorage.getItem(storageKeys.CONTRACT_TEMPLATE_DATA)) &&
      localStorage.getItem("user") !==
        JSON.parse(sessionStorage.getItem(storageKeys.CONTRACT_TEMPLATE_DATA))
          .belongTo
    ) {
      this.getContractTemplateList();
    }
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.getContractTemplateList);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.getContractTemplateList);
  },
  provide() {
    return {
      requestDataProvide: this.requestData,
    };
  },
};
</script>

<style scoped>
.fade-alert-enter-from,
.fade-alert-leave-to {
  opacity: 0 !important;
}

.fade-alert-enter-active,
.fade-alert-leave-active {
  transition: opacity 0.3s;
}

.fade-alert-enter-to,
.fade-alert-leave-from {
  opacity: 1 !important;
}

.card-template-container {
  margin: 13px 13px 0 13px;
}

.card-template-container .contract-cartList {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.dialog {
  width: 100vw;
  min-width: 1000px;
}

.dialog >>> .el-dialog--center {
  width: 500px !important;
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

.uploadFile {
  position: relative;
}

.uploadFile .tip2 {
  position: absolute;
  width: 10vw;
  top: -7px;
  left: 95px;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>