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
              v-for="key in appChainDialogList"
              :label="key.name"
              :value="key.id"
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
import {
  getContractsByChain,
  saveDepoTemplate,
  getAppChain4Depo,
} from "@/util/api";

export default {
  name: "createTemplateDialog",
  props: {
    createTemplateDialogVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      dialogFormVisible: this.createTemplateDialogVisible, //控制dialog是否显示
      loading: false,
      appChainDialogList: [], //应用链名称列表
      contractNameList: [], // 合约名称列表
      fileDisabled: false,
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
    createTemplateDialogVisible() {
      this.dialogFormVisible = this.createTemplateDialogVisible;
    },
    "parameterParamsForm.parameterParams2": {
      handler() {
        this.changeFileDisabled();
      },
      deep: true,
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

  mounted() {
    this.open();
  },

  methods: {
    // 开启新建存证模板时触发
    open() {
      getAppChain4Depo()
        .then((res) => {
          if (res.data.code === 0) {
            this.appChainDialogList = res.data.data;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },

    // 关闭新建存证模板时触发
    close() {
      this.$emit("updateTemplateDialog", false);
    },

    // 选择应用链获取合约信息
    changeChainOption() {
      getContractsByChain(this.form.appChainId)
        .then((res) => {
          if (res.data.code === 0) {
            this.contractNameList = res.data.data;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
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
                message: `${this.params[i].parameterName}${this.$t(
                  "depository.emptyParameterType"
                )}`,
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
          this.addDepositoryTemplate();
        } else {
          return false;
        }
      });
    },

    // 存证模板新建方法
    addDepositoryTemplate() {
      let data = {
        chainId: this.form.appChainId,
        contractId: this.form.contractId,
        depositoryTemplateName: this.form.depositoryTemplateName,
        params: this.params,
      };
      this.loading = true;
      saveDepoTemplate(data)
        .then((res) => {
          if (res.data.code === 0) {
            this.$emit("getSelectTemplateName", true);
            this.close();
            this.$message({
              type: "success",
              message: this.$t("text.addSuccess"),
              duration: 2000,
            });
          } else {
            this.loading = false;
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },

    // 判断文件类型是否被选中
    changeFileDisabled() {
      for (let i = 0; i < this.params.length; i++) {
        if (this.params[i].parameterType === "file") {
          this.parameterOption[this.parameterOption.length - 1].disabled = true;
          break;
        } else {
          this.parameterOption[
            this.parameterOption.length - 1
          ].disabled = false;
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