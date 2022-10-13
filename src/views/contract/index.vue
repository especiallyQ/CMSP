<template>
  <div class="contract-template">
    <ContentHead :headTitle="$t('title.contractTemplate')" />
    <div class="card-template-container">
      <el-card class="box-card">
        <ContractHeader />
        <ul class="contract-cartList">
          <TemplateCard
            v-for="(obj, index) in contractTemplateList.newDataList"
            :key="index"
            :propTitleIconColor="getRgb()"
            :propTitle="obj.templateName"
            :propDetilDate="obj.data"
          >
            <BottomNav v-for="(num, index) in 1" :key="index" />
          </TemplateCard>
        </ul>
        <PaginationView
          @changeHandleCurrent="changeHandleCurrent"
          @changeHandleSize="changeHandleSize"
          :propTotalNum="contractTemplateList.totalCount"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead.vue";
import dispatchKeys from "@/util/storeKeys/contractTemplate/dispatchKeys";
import storageKeys from "@/util/storageKeys/contractTemplateStorageKey";
import TemplateCard from "@/components/templateCard/index.vue";
import BottomNav from "@/components/templateCard/components/bottomNav.vue";
import ContractHeader from "./components/contractHeader.vue";
import PaginationView from "@/components/paginationView.vue";
import { rgb } from "@/util/util";

export default {
  name: "contractTemplate",
  components: {
    ContentHead,
    TemplateCard,
    BottomNav,
    ContractHeader,
    PaginationView,
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
      visibilityList: {
        0:"所有人可见",
        1:"群组内可见",
        2:"仅自己可见"
      }
    };
  },
  computed: {
    contractTemplateList: {
      get() {
        let { data, totalCount } =
          this.$store.state.contractTemplate.contractTemplateData.data;

        let dataLen = data.length;
        let newDataList = [];

        for (let i = 0; i < dataLen; i++) {
          let obj = {
            templateName: "",
            data: {},
          };
          obj.templateName = this.$t("text.noData");
          for (let key in data[i]) {
            if (this.showDataList[key]) {
              let i18nName = this.$t(`table.${this.showDataList[key]}`);

              if (data[i][key] !== null) {
                if (this.showDataList[key] !== "templateName") {
                  if(this.showDataList[key] !== "templateVisibilityShort") {
                    obj.data[i18nName] = data[i][key];
                  }else {
                    obj.data[i18nName] = this.visibilityList[data[i][key]];
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
    getContractTemplateList(data) {
      this.$store.dispatch(dispatchKeys.CONTRACT_TEMPLATE_LIST);
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
      console.log(val);
    },
    changeHandleSize(val) {
      this.pageSize = val;
    },
  },
  created() {
    // 过期更新，有效期60秒
    if (this.storageDateIsTimeout(storageKeys.CONTRACT_TEMPLATE_DATA)) {
      this.getContractTemplateList();
    }
    if (this.storageDataIsEmpty(storageKeys.CONTRACT_TEMPLATE_DATA)) {
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
.card-template-container {
  margin: 13px 13px 0 13px;
}

.card-template-container .contract-cartList {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
</style>