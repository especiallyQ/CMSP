<template>
  <div>
    <el-dialog
      :title="allDialogTitle"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @open="openAllDialog"
      @close="closeAllDialog"
      center
      width="498px"
    >
      <el-form
        :model="form.depositoryContentForm"
        ref="ruleForm"
        label-width="100px"
        class="selectForm"
        :rules="rules"
      >
        <el-form-item :label="$t('depository.templateName')">
          <el-input :placeholder="templateName" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item
          v-for="item in parameter"
          :key="item.parameterName"
          :label="item.parameterName"
          :prop="item.parameterName"
        >
          <el-input
            v-model="form.depositoryContentForm[item.parameterName]"
            v-if="item.parameterType !== 'file'"
          ></el-input>
          <!-- <el-button type="file" v-else>{{ $t("text.upLoadFile") }}</el-button> -->
          <el-upload
            v-else
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :auto-upload="false"
            :limit="1"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="closeAllDialog">{{ $t("text.cancel") }}</el-button>
        <el-button @click="submitAllDialog('ruleForm')" type="primary">{{
          $t("text.sure")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDepoTemplateById, saveDepositoryContent } from "@/util/api";
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
    template: {
      type: Array,
    },
  },
  data() {
    return {
      dialogFormVisible: this.visible, //控制dialog是否显示
      templateName: null, //存证模板名称
      parameter: {},
      rules: {}, //验证规则
      form: {
        //表单数据
        depositoryContentForm: {},
      },
    };
  },

  watch: {
    visible() {
      this.dialogFormVisible = this.visible;
    },
    template() {
      this.templateName = this.template[0].name;
    },
  },

  methods: {
    // 开启Dialog时
    openAllDialog() {
      getDepoTemplateById(this.template[0].id).then((res) => {
        this.parameter = res.data.data || [];
        this.createRules();
      });
    },
    // 关闭Dialog时
    closeAllDialog() {
      this.$emit("updateAllDialog", false);
    },

    // 提交Dialog
    submitAllDialog(formName) {
      console.log(this.form.depositoryContentForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveDepositoryContent(this.form).then((res) => {
            if (res.data.code === 0) {
            } else {
              this.$message({
                message: this.$chooseLang(res.data.code),
                type: "error",
                duration: 2000,
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    // 创建验证规则
    createRules() {
      for (let key of this.parameter) {
        switch (key.parameterType) {
          case "string":
            this.rules[key.parameterName] = [
              {
                required: true,
                message: `${this.$t("depository.inputFormElement")}${
                  key.parameterName
                }`,
                trigger: "blur",
              },
            ];
            break;
          case "int":
            this.rules[key.parameterName] = [
              {
                required: true,
                message: `${this.$t("depository.inputFormElement")}${
                  key.parameterName
                }`,
                trigger: "blur",
              },
              {
                pattern: /^[0-9]*$/,
                message: `${key.parameterName}${this.$t("depository.ruleInt")}`,
                trigger: "blur",
              },
            ];
            break;
          case "float":
            this.rules[key.parameterName] = [
              {
                required: true,
                message: `${this.$t("depository.inputFormElement")}${
                  key.parameterName
                }`,
                trigger: "blur",
              },
              {
                pattern: /^[0-9]+([.][0-9]{1,})?$/,
                message: `${key.parameterName}${this.$t(
                  "depository.ruleFloat"
                )}`,
                trigger: "blur",
              },
            ];
            break;
          case "file":
            this.rules[key.parameterName] = [
              {
                required: true,
                message: `${key.parameterName}${this.$t(
                  "depository.fileRequired"
                )}`,
                trigger: "blur",
              },
            ];
            break;
        }
      }
>>>>>>> lq
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

    // 表头数据
    parameterList() {
      let parameterListArr = [];
      for (let key of this.parameter) {
        parameterListArr.push(key.parameterName);
      }
      return parameterListArr;
    },

    // 表头类型
    parameterType() {
      let parameterTypeArr = [];
      for (let key of this.parameter) {
        parameterTypeArr.push(key.parameterType);
      }
      return parameterTypeArr;
    },

    // 验证规则
    parameterRules() {
      let rules = {
        parameter: [
          {
            required: true,
            message: this.$t("depository.selectContract"),
            trigger: "blur",
          },
        ],
      };
      return rules;
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
.selectForm >>> .el-form-item__label {
  font-size: 12px;
  font-family: "Courier New", Courier, monospace;
}
</style>