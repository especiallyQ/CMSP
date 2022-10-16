<template>
  <div>
    <el-dialog
      title="新建存证模板"
      :visible.sync="dialogFormVisible"
      center
      :close-on-click-modal="false"
      @close="close"
      width="498px"
    >
      <el-form :model="form" :rules="rules" label-width="100px">
        <el-form-item label="应用链" prop="appChainId">
          <el-select
            class="el-select-width"
            v-model="form.appChainId"
            placeholder="请选择应用链"
            @change="changeChainOption"
          >
            <el-option
              :label="key.name"
              :value="key.id"
              v-for="key in appChainList"
              :key="key.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="合约名称" prop="contractId">
          <el-select
            class="el-select-width"
            v-model="form.contractId"
            placeholder="请选择合约"
          >
            <el-option
              v-for="key in contractNameList"
              :key="key.id"
              :label="key.name"
              :value="key.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="存证模板名称" prop="templateName">
          <el-input
            v-model="form.templateName"
            placeholder="请输入存证模板名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="存证参数" prop="parameter" :show-message="false">
          <el-input
            v-model="form.parameterName"
            placeholder="参数名"
            class="el-input-width"
          ></el-input>
          <el-select
            v-model="form.parameterType"
            placeholder="参数类型"
            class="el-input-width"
          >
            <el-option
              v-for="(item, index) in parameterOption"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-button type="primary" circle icon="el-icon-plus" @click="addParameter"></el-button>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getContractsByChain } from "@/util/api";
export default {
  name: "createTemplateDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    appChainList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      dialogFormVisible: this.visible,
      form: {
        appChainId: null, //所选应用链Id
        contractId: null, // 所选合约列表Id
        templateName: "", //存证模板名称

        parameter: {
          parameterName: "", //参数名称
          parameterType: "", //参数类型
        },
      },
      parameterOption: ["字符串", "整数", "浮点数", "文件"],
      contractNameList: [], // 合约名称列表

      rules: {
        appChainId: [
          { required: true, message: "请选择应用链", trigger: "change" },
        ],
        contractId: [
          { required: true, message: "请选择合约", trigger: "change" },
        ],
        templateName: [
          { required: true, message: "请输入存证模板名称", trigger: "blur" },
        ],
        parameter: [{ required: true, trigger: "blur" }],
      },
    };
  },
  watch: {
    visible() {
      this.dialogFormVisible = this.visible;
    },
  },
  methods: {
    // 关闭新建存证模板时触发
    close() {
      this.$emit("update", false);
      this.form.appChainId = null;
      this.form.contractId = null;
    },

    // 选择应用链获取合约信息
    async changeChainOption() {
      const res = await getContractsByChain(this.form.appChainId);
      if (res.data.code === 0) {
        this.contractNameList = res.data.data;
      } else {
        this.$message({
          message: this.$chooseLang(res.data.code),
          type: "error",
          duration: 2000,
        });
      }
    },

    addParameter(){
      console.log(1);
    }
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
.el-select-width {
  width: 346px;
}

.el-input-width {
  width: 140px;
  margin-right: 5px;
}
</style>