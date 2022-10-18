<template>
  <div>
    <el-dialog
      :title="this.$t('depository.createTemplate')"
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
        <el-form-item :label="$t('blockchain4App.appChain')" prop="appChainId">
          <el-select
            class="el-select-width"
            v-model="form.appChainId"
            :placeholder="$t('depository.selectAppChain')"
            @change="changeChainOption"
            filterable
          >
            <el-option
              :label="key.name"
              :value="key.id"
              v-for="key in appChainList"
              :key="key.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('contracts.contractName')" prop="contractId">
          <el-select
            class="el-select-width"
            v-model="form.contractId"
            :placeholder="$t('depository.selectContract')"
            filterable
          >
            <el-option
              v-for="key in contractNameList"
              :key="key.id"
              :label="key.name"
              :value="key.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('depository.templateName')"
          prop="depositoryTemplateName"
        >
          <el-input
            v-model.trim="form.depositoryTemplateName"
            :placeholder="$t('depository.inputTemplateName')"
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
          :label="$t('depository.params')"
          prop="parameter"
          :show-message="false"
          v-for="(key, index) in parameterParamsForm.parameterParams1"
          :key="index"
        >
          <el-input
            v-model.trim="key.parameterName"
            :placeholder="$t('depository.paramName')"
            class="el-input-width"
            maxlength="16"
          ></el-input>
          <el-select
            v-model="key.parameterType"
            :placeholder="$t('depository.paramType')"
            class="el-input-width"
            @change="changeFileDisabled"
          >
            <el-option
              v-for="(item, index) in parameterOption"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
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
            :placeholder="$t('depository.paramName')"
            class="el-input-width"
          ></el-input>
          <el-select
            v-model="key.parameterType"
            :placeholder="$t('depository.paramType')"
            class="el-input-width"
            @change="changeFileDisabled"
          >
            <el-option
              v-for="(item, index) in parameterOption"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
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
        <el-button @click="close">{{ $t("text.cancel") }}</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :loading="loading"
          >{{ $t("text.sure") }}</el-button
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
      contractNameList: [], // 合约名称列表
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
          label: this.$t("depository.paramTypeString"),
          value: "string",
          disabled: false,
        },
        {
          label: this.$t("depository.paramTypeInteger"),
          value: "int",
          disabled: false,
        },
        {
          label: this.$t("depository.paramTypeFloat"),
          value: "float",
          disabled: false,
        },
        {
          label: this.$t("depository.paramTypeFile"),
          value: "file",
          disabled: false,
        },
      ],

      // 新建模板存证表单验证规则
      rules: {
        appChainId: [
          {
            required: true,
            message: this.$t("depository.selectAppChain"),
            trigger: "change",
          },
        ],
        contractId: [
          {
            required: true,
            message: this.$t("depository.selectContract"),
            trigger: "change",
          },
        ],
        depositoryTemplateName: [
          {
            required: true,
            message: this.$t("depository.inputTemplateName"),
            trigger: "blur",
          },
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

  computed: {
    params() {
      return [
        ...this.parameterParamsForm.parameterParams1,
        ...this.parameterParamsForm.parameterParams2,
      ];
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

    // 判断参数名是否有重复
    checkParamName(arr, key) {
      const parameterNames = arr.map((item) => item[key]);
      const newParameterNames = Array.from(new Set(parameterNames));
      return parameterNames.length === newParameterNames.length ? true : false;
    },

    //提交新建存证模板表单
    submitForm(formName) {
      // 新建存证模板校验规则
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.params.length; i++) {
            if (!this.params[i].parameterName) {
              this.$message({
                type: "error",
                message: this.$t("depository.emptyParameterName"),
              });
              return;
            } else if (!this.params[i].parameterType) {
              this.$message({
                type: "error",
                message: `
                ${this.params[i].parameterName}
                ${this.$t("depository.emptyParameterType")}`,
              });
              return;
            } else if (!this.checkParamName(this.params, "parameterName")) {
              this.$message({
                type: "error",
                message: this.$t("depository.repeatParameters"),
              });
              return;
            }
          }
          this.addDepositoryTemplate({
            chainId: this.form.appChainId,
            contractId: this.form.contractId,
            depositoryTemplateName: this.form.depositoryTemplateName,
            params: this.params,
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
      console.log(res);
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

    // 判断文件类型是否被选中
    changeFileDisabled() {
      for (let i = 0; i < this.params.length; i++) {
        if (this.params[i].parameterType === "file") {
          this.parameterOption[3].disabled = true;
          break;
        } else {
          this.parameterOption[3].disabled = false;
        }
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