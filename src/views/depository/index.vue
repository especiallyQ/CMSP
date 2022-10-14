<template>
  <div class="depository_wrapper">
    <ContentHead :headTitle="$t('title.depositoryTitle')"></ContentHead>
    <DepositoryList />
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead";
import DepositoryList from "@/views/depository/depositoryList";
export default {
  name: "depository",
  components: {
    ContentHead,
    DepositoryList,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>