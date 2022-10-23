<!--
 * @Author: chengjiang_09
 * @Date: 2022-10-20 09:14:10
 * @LastEditTime: 2022-10-20 09:47:12
-->
<template>
  <div class="editorView">
    <ContentHead :headTitle="'合约模板'" :headSubTitle="'合约编辑器'" />
    <div class="editorView-container">代码编辑器</div>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead.vue";
export default {
  name: "editorView",
  components: {
    ContentHead,
  },
};
</script>

<style scoped>
.editorView .editorView-container {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 400px;
  font-size: 2vw;
  background-color: #ffffff;
}
</style>