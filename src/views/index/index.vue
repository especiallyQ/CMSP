<template>
  <div style="height: 100%">
    <mains></mains>
  </div>
</template>

<script>
import mains from "./main";
import storageKeys from "@/util/storageKeys/contractTemplateStorageKey";
import mutationsKeys from "@/util/storeKeys/contractTemplate/mutationsKeys";
export default {
  name: "index",
  components: {
    mains,
  },
  data: function () {
    return {};
  },
  methods: {
    //用户退出或页面关闭后清除模板列表数据
    clearContractStorageData() {
      sessionStorage.removeItem(storageKeys.CONTRACT_TEMPLATE_DATA);
      this.$store.commit(
        mutationsKeys.SET_CONTRACT_TEMPLATE_LIST_IN_OUT_MODULE,
        {
          belongTO: localStorage.getItem("user") || "",
          data: [],
          totalCount: 0,
        }
      );
    },
  },
  beforeDestroy() {
      this.clearContractStorageData()
  },
};
</script>

<style>
</style>
