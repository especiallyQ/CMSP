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
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="selectForm"
      >
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

        <el-form-item label="存证模板名称" prop="depositoryTemplateName">
          <el-input
            v-model="form.depositoryTemplateName"
            placeholder="请输入存证模板名称"
            maxlength="30"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-form
        :model="parameterParamsForm"
        label-width="100px"
        class="selectForm"
      >
        <el-form-item
          label="存证参数"
          prop="parameter"
          :show-message="false"
          v-for="(key, index) in parameterParamsForm.parameterParams1"
          :key="index"
        >
          <el-input
            v-model="key.parameterName"
            placeholder="参数名"
            class="el-input-width"
            maxlength="16"
          ></el-input>
          <el-select
            v-model="key.parameterType"
            placeholder="参数类型"
            class="el-input-width"
          >
            <el-option
              v-for="(item, index) in parameterOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            circle
            icon="el-icon-plus"
            @click="addParameter"
            size="mini"
            style="marginleft: 8px"
          ></el-button>
        </el-form-item>

        <el-form-item
          prop="parameter"
          :show-message="false"
          v-for="(key, index) in parameterParamsForm.parameterParams2"
          :key="index + 1"
          :validate-on-rule-change="false"
        >
          <el-input
            v-model="key.parameterName"
            placeholder="参数名"
            class="el-input-width"
          ></el-input>
          <el-select
            v-model="key.parameterType"
            placeholder="参数类型"
            class="el-input-width"
          >
            <el-option
              v-for="(item, index) in parameterOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button
            type="danger"
            circle
            icon="el-icon-minus"
            @click="removeParameter(index)"
            size="mini"
            style="marginleft: 8px"
          ></el-button>
        </el-form-item>
      </el-form>

      <div class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :loading="loading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getContractsByChain, saveDepoTemplate } from "@/util/api";
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
      dialogFormVisible: this.visible, //控制dialog是否显示
      loading: false,
      form: {
        appChainId: null, //所选应用链Id
        contractId: null, // 所选合约列表Id
        depositoryTemplateName: null, //存证模板名称
      },

      //存证参数
      parameterParamsForm: {
        parameterParams1: [
          {
            parameterName: "", //参数名称
            parameterType: "", //参数类型
          },
        ],
        parameterParams2: [],
      },
      // 模板参数下拉框
      parameterOption: [
        {
          label: "字符串",
          value: "string",
        },
        {
          label: "整数",
          value: "int",
        },
        {
          label: "浮点数",
          value: "float",
        },
        {
          label: "文件",
          value: "file",
        },
      ],
      contractNameList: [], // 合约名称列表

      // 新建模板存证表单验证规则
      rules: {
        appChainId: [
          { required: true, message: "请选择应用链", trigger: "change" },
        ],
        contractId: [
          { required: true, message: "请选择合约", trigger: "change" },
        ],
        depositoryTemplateName: [
          { required: true, message: "请输入存证模板名称", trigger: "blur" },
        ],
      },
      parameterRules: {
        parameter: [{ required: true }],
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

    // 点击+添加参数项
    addParameter() {
      this.parameterParamsForm.parameterParams2.push({
        parameterName: "", //参数名称
        parameterType: "", //参数类型
      });
    },
    // 点击-移除参数项
    removeParameter(index) {
      this.parameterParamsForm.parameterParams2.splice(index, 1);
    },

    //提交新建存证模板表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = [
            ...this.parameterParamsForm.parameterParams1,
            ...this.parameterParamsForm.parameterParams2,
          ];
          for (let i = 0; i < params.length; i++) {
            if (!params[i].parameterName) {
              this.$message({
                type: "error",
                message: "存在空值的参数名",
              });
              return;
            } else if (!params[i].parameterType) {
              this.$message({
                type: "error",
                message: `${params[i].parameterName}参数未设置类型`,
              });
              return;
            }
          }

          this.addDepositoryTemplate({
            chainId: this.form.appChainId,
            contractId: this.form.contractId,
            depositoryTemplateName: this.form.depositoryTemplateName,
            id: 0,
            params,
          });
        } else {
          return false;
        }
      });
    },

    // 存证模板新建方法
    async addDepositoryTemplate(data) {
      this.loading = true;
      const res = await saveDepoTemplate(data);
      if (res.data.code === 0) {
        this.$emit("getSelectTemplateName");
        this.close();
      } else {
        this.loading = false;
        this.$message({
          message: this.$chooseLang(res.data.code),
          type: "error",
          duration: 2000,
        });
      }
    },
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

.selectForm >>> .el-form-item__label {
  font-size: 12px;
  font-family: "Courier New", Courier, monospace;
}
</style>