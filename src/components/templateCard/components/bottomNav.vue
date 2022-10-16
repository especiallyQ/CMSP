<template>
  <el-button :disabled="!action" class="bootomNav-container" @click="onClick"
    ><el-tooltip placement="top" :open-delay="800" :disabled="!action">
      <div slot="content">
        {{ remark }}
      </div>
      <i :style="{color:color}" :class="['icon',propIconName, { action: action }]"></i> </el-tooltip
  ></el-button>
</template>

<script>
export default {
  name: "bttomNav",
  props: {
    propRemark: {
      default: "",
      type: String,
      required: true,
    },
    propIconName: {
      default: "cmsp-icon-chakan",
      type: String,
      required: true,
    },
    propAction: {
      default: true,
      type: Boolean,
      required: true,
    },
    propColor: {
      type:String,
      default: "#62a2eb",
      required: false
    }
  },
  data() {
    return {
      remark: this.propRemark,
      iconName: this.propIconName,
      action: this.propAction,
      color: this.propColor
    };
  },
  methods: {
    onClick(e) {
      this.$emit("click", e);
    },
  },
};
</script>

<style scoped>
.bootomNav-container {
  width: 30px;
  height: 30px;
  margin-left: -5px!important;
  background-color: transparent!important;
  position: relative;
  cursor: pointer;
  border: none;
}

.bootomNav-container .icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  height: 30px;
  width: 30px;
  text-align: center;
  color: #969494;
}

.action {
  color: #62a2eb;
}
</style>