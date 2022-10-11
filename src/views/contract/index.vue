<template>
  <div class="contract-template">
    <ContentHead :headTitle="$t('title.contractTemplate')" />
    <div class="card-template-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>卡片名称</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >操作按钮</el-button
          >
        </div>
        <ul class="contract-cartList">
          <div class="contract-cart-container" v-for="(num, index) in 4" :key="index">
            <el-card :body-style="{ padding: '0px' }" class="contract-cart">
              123
            </el-card>
          </div>
        </ul>
      </el-card>
    </div>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead";
import dispatchKeys from '@/util/storeKeys/contractTemplate/dispatchKeys'
import storageKeys from '@/util/storageKeys/contractTemplateStorageKey'
export default {
  name: "contractTemplate",
  components: {
    ContentHead,
  },
  data: () => {
    return {
      isCollapse: true,
    };
  },
  methods: {
    getContractTemplateList(data){
      this.$store.dispatch(dispatchKeys.CONTRACT_TEMPLATE_LIST)
    },
    storageDataIsEmpty(keys){
      return sessionStorage.getItem(keys) ? false : true
    }
  },
  created(){
    if(this.storageDataIsEmpty(storageKeys.CONTRACT_TEMPLATE_DATA)){
      this.getContractTemplateList()
    }
  },
  beforeMount(){
    window.addEventListener('beforeunload',this.getContractTemplateList)
  },
  beforeDestroy(){
    window.removeEventListener('beforeunload',this.getContractTemplateList)
  }
};
</script>

<style scoped>
.card-template-container {
  margin: 13px 13px 0 13px;
}

.card-template-container .contract-cartList {
  display: flex;
  justify-content: space-between;
}

.card-template-container .contract-cartList .contract-cart-container {
    display: flex;
    width: 25%;
    padding: 0 8px 16px;
    height: 200px;
}

.card-template-container .contract-cartList .contract-cart {
  flex: 1;
}
</style>