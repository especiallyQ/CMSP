<template>
  <div>
    <el-dialog
      :title="allDialogTitle"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @close="closeAllDialog(false)"
      center
      width="498px"
    >
      <el-form
        :model="form"
        ref="ruleForm"
        label-width="100px"
        class="selectForm"
        :rules="rules"
      >
        <el-form-item :label="$t('depository.templateName')" v-if="flag !== 2">
          <el-input :placeholder="templateName" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item
          v-for="item in parameter"
          :key="item.parameterName"
          :label="item.parameterName"
          :prop="item.parameterName"
        >
          <el-input v-model="item.parameterValue"></el-input>
          <!-- <el-button type="file" v-else>{{ $t("text.upLoadFile") }}</el-button> -->
          <!-- <el-upload
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
          </el-upload> -->
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="closeAllDialog(false)">{{
          $t("text.cancel")
        }}</el-button>
        <el-button
          @click="submitAllDialog('ruleForm')"
          type="primary"
          :loading="loading"
          >{{ $t("text.sure") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepoTemplateById,
  saveDepositoryContent,
  modifyDepositoryContent,
} from "@/util/api";
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
    // 存证模板
    templateName: {
      type: String,
    },
    // 编辑时所选的列表数据
    editData: {
      type: Object,
    },
    // 存证模板Id
    id: {
      type: Object,
    },
  },
  data() {
    return {
      dialogFormVisible: this.visible, //控制dialog是否显示
      parameter: [],
      rules: {}, //验证规则
      form: {
        //表单数据
      },
      loading: false,
    };
  },

  watch: {
    visible() {
      this.dialogFormVisible = this.visible;
    },
  },

  methods: {
    editFormData() {
      // for (let key of this.parameter) {
      //   this.$set(
      //     this.form,
      //     key.parameterName,
      //     this.editData[key.parameterName]
      //   );
      // }
    },

    // 开启Dialog时
    openAllDialog() {
      this.getDepoTemplate();
      this.editFormData();
    },

    // 关闭Dialog时
    closeAllDialog(flag) {
      this.$emit("updateAllDialog", false, flag);
    },

    // 获取模板列表数据
    getDepoTemplate() {
      getDepoTemplateById(this.id.templateId).then((res) => {
        if (res.data.code === 0) {
          this.parameter = res.data.data;
          for (let key of this.parameter) {
            this.$set(key, "parameterValue", this.editData[key.parameterName]);
          }
          console.log(this.parameter);
          this.createRules();
        } else {
          this.$message({
            message: this.$chooseLang(res.data.code),
            type: "error",
            duration: 2000,
          });
        }
      });
    },

    // 录入存证信息
    setDepositoryContent() {
      // saveDepositoryContent(this.form).then((res) => {
      //   if (res.data.code === 0) {
      //   } else {
      //     this.$message({
      //       message: this.$chooseLang(res.data.code),
      //       type: "error",
      //       duration: 2000,
      //     });
      //   }
      // });
    },

    // 编辑存证列表信息
    editDepositoryContent(data) {
      modifyDepositoryContent(data).then((res) => {
        if (res.data.code === 0) {
          this.closeAllDialog(true);
          this.$message({
            type: "success",
            message: this.$t("text.updateSuccessMsg"),
            duration: 2000,
          });
        } else {
          this.$message({
            message: this.$chooseLang(res.data.code),
            type: "error",
            duration: 2000,
          });
        }
      });
    },

    // 提交Dialog
    submitAllDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          switch (this.flag) {
            case 0:
              // setDepositoryContent();
              break;
            case 1:
              const { appChainId, contractNameId, templateId } = this.id;
              const data = {
                chainId: appChainId,
                contractId: contractNameId,
                depositoryTemplateId: templateId,
                id: this.editData.id,
                params: this.parameter,
              };
              this.editDepositoryContent(data);
              break;
            case 2:
              break;
          }
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
  mounted() {
    this.openAllDialog();
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