<!--
 * @Author: chengjiang_09
 * @Date: 2022-10-13 14:36:34
 * @LastEditTime: 2022-10-20 11:28:11
-->
<template>
  <div class="paginationView">
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "paginationView",
  methods: {
    handleSizeChange(val) {
      this.$emit("changeHandleSize", val)
    },
    handleCurrentChange(val) {
      this.$emit("changeHandleCurrent", val)
    },
  },
  props:{
    propTotalNum: {
      type:Number,
      default: 0
    },
    //使用.sync进行跨组件数据双向绑定
    propCurrentPage: {
      type:Number,
      default:1
    }
  },
  data() {
    return {
      pageSizes: [10,20,30,50],
    };
  },
  computed:{
    totalNum:{
      get(){
        return this.propTotalNum
      }
    },
    currentPage: {
      get(){
        return this.propCurrentPage ? this.propCurrentPage : 1
      }
    }
  }
};
</script>

<style scoped>
.paginationView {
  margin-top: 30px;
  width: 100%;
  text-align: center;
}
</style>