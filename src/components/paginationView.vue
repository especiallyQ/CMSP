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
      this.pageSize = val
      this.$emit("changeHandleSize", val)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit("changeHandleCurrent", val)
    },
  },
  props:{
    propTotalNum: {
      type:Number,
      default: 0
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSizes: [10,20,30,50],
    };
  },
  computed:{
    totalNum:{
      get(){
        return this.propTotalNum
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