<template>
  <div class="depository_wrapper">
    <ContentHead :headTitle="$t('title.depositoryTitle')"></ContentHead>
    <div class="module-wrapper">
      <div class="search-tabs">
        <div class="left-search-tabs">
          <div class="el-select-label">
            <span>应用链</span>
            <el-select v-model="value" size="small" style="width: 140px">
              <el-option
                v-for="item in cities"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.value
                }}</span>
              </el-option>
            </el-select>
          </div>

          <div class="el-select-label">
            <span>合约名称</span>
            <el-select v-model="value" size="small" style="width: 140px">
              <el-option
                v-for="item in cities"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.value
                }}</span>
              </el-option>
            </el-select>
          </div>

          <div class="el-select-label">
            <span>存证模板</span>
            <el-select v-model="value" size="small" style="width: 140px">
              <el-option
                v-for="item in cities"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.value
                }}</span>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="right-search-tabs">
          <el-button type="primary" size="small" style="width: 104px"
            >新建存证模板</el-button
          >
          <el-button type="primary" size="small" style="width: 104px"
            >录入存证信息</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead";
export default {
  name: "depository",
  data() {
    return {
      cities: [
        {
          label: "北京",
        },
      ],
      value: "",
    };
  },
  components: {
    ContentHead,
  },
};
</script>

<style scoped>
.module-wrapper {
  position: relative;
  display: flex;
  height: 500px;
  background-color: #fff;
}
.search-tabs {
  width: 100%;
  height: 80px;
  padding: 30px 20px 18px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.left-search-tabs {
  width: 638px;
  display: flex;
  justify-content: space-between;
  margin-left: 15px;
}
.el-select-label {
  height: 32px;
}
.el-select-label > span {
  padding-right: 12px;
}

.right-search-tabs {
  width: 228px;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
}
</style>