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
        :model="form"
        ref="ruleForm"
        label-width="100px"
        class="selectForm"
      >
        <el-form-item :label="$t('depository.templateName')">
          <el-input :placeholder="templateName" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            v-for="item in parameter"
            :key="item.parameterName"
            :label="item.parameterName"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="closeAllDialog">{{ $t("text.cancel") }}</el-button>
        <el-button type="primary">{{ $t("text.sure") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDepoTemplateById } from "@/util/api";
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
    template: {},
  },
  data() {
    return {
      dialogFormVisible: this.visible, //控制dialog是否显示
      templateName: this.template.name,
      parameter: [],
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
      formLabelWidth: "100px",
    };
  },

  watch: {
    visible() {
      this.dialogFormVisible = this.visible;
    },
    template() {
      this.templateName = this.template.name;
    },
  },

  methods: {
    // 开启Dialog时
    openAllDialog() {
      getDepoTemplateById(this.template.id).then((res) => {
        this.paramete = res.data.data;
      });
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