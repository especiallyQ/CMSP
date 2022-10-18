<template>
  <div class="contract-template">
    <ContentHead :headTitle="$t('title.contractTemplate')" />
    <div class="card-template-container">
      <el-card class="box-card">
        <ContractHeader
          @toggleViewModeFn="toggleViewModeFn"
          :propCreateBtnShow="createBtnShow"
          @click="createContract"
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
                      obj.data[$t('table.templateDescriptionShort')]
                    )
                  "
                />
              </TemplateCard>
            </ul>
          </div>
          <div v-else key="smallView">
            <SmallView :propTableData="contractTemplateList.newDataList" />
          </div>
        </transition>
        <PaginationView
          @changeHandleCurrent="changeHandleCurrent"
          @changeHandleSize="changeHandleSize"
          :propTotalNum="contractTemplateList.totalCount"
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
      >
      <ContractDrawerBody
        :propCreator="drawer.creator"
        :propDescription="drawer.description"
      />
    </el-drawer>
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

import { rgb } from "@/util/util";

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
      set(pageSize) {
        this.pageSize = pageSize;
      },
    },
  },
  methods: {
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
    navBtnClick(e, key, id, templateName, versionCount, creator, description) {
      this.drawer.showFlag = !this.drawer.showFlag;
      this.drawer.title = templateName;
      this.drawer.versionCount = versionCount;
      this.drawer.creator = creator;
      this.drawer.description = description;

      this.$store.dispatch(dispatchKeys.TEMPLATE_VERSION_LIST, {
        templateId: id,
      });
    },
    createContract(e) {},
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

</style>