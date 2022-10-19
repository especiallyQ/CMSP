<template>
  <div class="depository_wrapper">
    <ContentHead
      :headTitle="$t('title.depositoryTitle')"
      :headSubTitle="$t('depository.history')"
    ></ContentHead>
    <div class="module-wrapper">
      <div class="goBack-tabs">
        <el-button type="small"> 返回 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead";
export default {
  name: "depositoryHis",
  components: {
    ContentHead,
  },
};
</script>

<style>


.goBack-tabs {
  width: 100%;
  height: 80px;
  padding: 30px 20px 18px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;

}
</style>