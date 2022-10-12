<template>
  <div class="contract-template">
    <ContentHead :headTitle="$t('title.contractTemplate')" />
    <div class="card-template-container">
      <el-card class="box-card">
        <div class="clearfix">
          <div class="clearfix-container-left">
            <input
              type="text"
              class="search searchCreater"
              placeholder="创建者搜索"
            />
            <input
              type="text"
              placeholder="合约模板搜索"
              class="search searchContractTemplate"
            />
            <el-button class="searchButton" icon="el-icon-search"></el-button>
          </div>
          <div class="clearfix-container-right">
            <el-button-group>
              <el-button
                type="primary"
                class="iconBtn"
                :class="{ action: changeAction }"
                @click="changeAction = false"
              >
                <i class="cmsp-icon-caidan"></i>
              </el-button>
              <el-button
                type="primary"
                class="iconBtn"
                :class="{ action: !changeAction }"
                @click="changeAction = true"
              >
                <i class="el-icon-menu"></i>
              </el-button>
            </el-button-group>
          </div>
        </div>
        <ul class="contract-cartList">
          <TemplateCard v-for="(num, index) in 1" :key="index"/>
        </ul>
      </el-card>
    </div>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead.vue";
import dispatchKeys from "@/util/storeKeys/contractTemplate/dispatchKeys";
import storageKeys from "@/util/storageKeys/contractTemplateStorageKey";
import TemplateCard from "@/components/templateCard.vue";

export default {
  name: "contractTemplate",
  components: {
    ContentHead,
    TemplateCard,
  },
  data: () => {
    return {
      isCollapse: true,
      changeAction: true,
    };
  },
  methods: {
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
  justify-content: space-between;
  flex-wrap: wrap;
}

.card-template-container .clearfix {
  position: relative;
  height: 81px;
}

.card-template-container .clearfix .clearfix-container-left {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -60%);
  height: 36px;
  width: 340px;
  display: flex;
}

.card-template-container .clearfix .clearfix-container-left .search {
  display: inline-block;
  border: 1px solid #eaedf3;
  padding: 0 15px 0 15px;
  box-sizing: border-box;
  width: 100%;
  color: #000;
}

.card-template-container .clearfix .clearfix-container-left .search:focus {
  outline: none;
}

.card-template-container .clearfix .clearfix-container-left input::placeholder {
  color: #c3c5c9;
}

.card-template-container
  .clearfix
  .clearfix-container-left
  input::-moz-placeholder {
  color: #c3c5c9;
}

.card-template-container
  .clearfix
  .clearfix-container-left
  input::-webkit-input-placeholder {
  color: #c3c5c9;
}

.card-template-container
  .clearfix
  .clearfix-container-left
  .search:nth-child(2) {
  border-left: 0px;
}

.card-template-container .clearfix .clearfix-container-left .searchCreater {
  flex: 6;
  border-top-right-radius: 0%;
  border-bottom-right-radius: 0%;
}

.card-template-container
  .clearfix
  .clearfix-container-left
  .searchContractTemplate {
  flex: 14;
  border-radius: 0%;
}

.card-template-container .clearfix .clearfix-container-left .searchButton {
  flex: 1;
  color: #ffffff;
  background-color: #4093ff;
  border-top-left-radius: 0%;
  border-bottom-left-radius: 0%;
}

.card-template-container .clearfix .clearfix-container-right {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -60%);
  height: 36px;
}

.card-template-container .clearfix .clearfix-container-right .iconBtn {
  position: relative;
  font-size: 15px !important;
  width: 50px;
  height: 36px;
  background-color: #409eff !important;
  border-color: #409eff !important;
}

.card-template-container .clearfix .clearfix-container-right .action {
  background-color: #909399 !important;
  border-color: #909399 !important;
}

.card-template-container .clearfix .clearfix-container-right .iconBtn:hover {
  background-color: #bec1c7 !important;
  border-color: #cacdd4 !important;
  transition: ;
}

.card-template-container .clearfix .clearfix-container-right .cmsp-icon-caidan {
  font-size: 16px !important;
}

.card-template-container .clearfix .clearfix-container-right .iconBtn i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>