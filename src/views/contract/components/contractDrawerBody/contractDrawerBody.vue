<template>
  <div class="contractDrawer">
    <el-checkbox
      class="contractDrawer-title"
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >全选</el-checkbox
    >
    <div style="margin: 15px 0"></div>
    <el-checkbox-group
      v-model="checkedCities"
      @change="handleCheckedCitiesChange"
    >
      <ContractDrawerCard v-for="(obj, index) in templateVersionList.data" :key="index">
        <template v-slot:checkBox>
          <el-checkbox :label="index"><span class="versionIcon">v</span>{{ `${obj.templateVersion}` }}</el-checkbox>
        </template>
      </ContractDrawerCard>
    </el-checkbox-group>
  </div>
</template>

<script>
const cityOptions = ["上海", "北京", "广州", "深圳"];
import ContractDrawerCard from "./contractDrawerCard.vue";
export default {
  name: "contractDrawer",
  components: {
    ContractDrawerCard,
  },
  data() {
    return {
      checkAll: false,
      checkedCities: ["上海", "北京"],
      cities: cityOptions,
      isIndeterminate: true,
    };
  },
  computed:{
    templateVersionList:{
      get(){
        return this.$store.state.contractTemplate.templateVersionList
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
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
}

.contractDrawer-body-container {
  display: flex;
  flex-direction: column;
}
</style>