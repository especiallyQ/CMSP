<template>
  <div>
    <el-dialog
      :title="allDialogTitle"
      :visible.sync="dialogFormVisible"
      @open="openAllDialog"
      @close="closeAllDialog"
      center
    >
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 控制Dialog是否显示
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    // 区分Dialog用途
    flag: {
      type: Number,
      required: true,
    },
    // 存证模板Id
    templateId: {
      type: String,
    },
  },
  data() {
    return {
      dialogFormVisible: this.visible, //控制dialog是否显示
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
    };
  },

  methods: {
    // 开启Dialog时
    openAllDialog() {
      console.log(123);
    },
    // 关闭Dialog时
    closeAllDialog() {
      this.$emit("updateAllDialog", false);
    },
  },

  computed: {
    // 根据标识符判断标题
    allDialogTitle() {
      switch (this.flag) {
        case 0:
          return "录入存证信息";
        case 1:
          return "编辑存证信息";
        case 2:
          return "数据校验";
      }
    },
  },
};
</script>

<style>
</style>