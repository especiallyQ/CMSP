<template>
  <div class="clearfix">
    <div class="clearfix-container-left">
      <input
        type="text"
        class="search searchCreater"
        :placeholder="searchCreater()"
      />
      <input
        type="text"
        :placeholder="searchContractTemplate()"
        class="search searchContractTemplate"
      />
      <el-button class="searchButton" icon="el-icon-search"></el-button>
    </div>
    <div class="clearfix-container-right">
      <div>
        <el-button
          type="primary"
          class="createNewContract"
          :class="{ show: createBtnShow }"
          @click="onClick($event)"
          >{{ $t(`contracts.${contractTemplateAddText}`) }}</el-button
        >
      </div>
      <div>
        <el-button-group>
          <el-button
            type="primary"
            class="iconBtn"
            :class="{ action: changeAction }"
            @click="toggleViewMode"
          >
            <i class="cmsp-icon-caidan"></i>
          </el-button>
          <el-button
            type="primary"
            class="iconBtn"
            :class="{ action: !changeAction }"
            @click="toggleViewMode"
          >
            <i class="el-icon-menu"></i>
          </el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "contractHeader",
  props: {
    propCreateBtnShow: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      isCollapse: true,
      changeAction: true,
      contractTemplateAddText: "contractTemplateAddText",
    };
  },
  computed: {
    createBtnShow: {
      get() {
        return this.propCreateBtnShow;
      },
    },
  },
  methods: {
    searchCreater() {
      return this.$t("contracts.creatorSearch");
    },
    searchContractTemplate() {
      return this.$t("contracts.contractNameSearch");
    },
    toggleViewMode() {
      this.changeAction = !this.changeAction;
      this.$emit("toggleViewModeFn", this.changeAction);
    },
    onClick(e) {
      this.$emit("click", e);
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  height: 81px;
}

.clearfix .clearfix-container-left {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -60%);
  height: 36px;
  width: 455px;
  display: flex;
}

.clearfix .clearfix-container-left .search {
  display: inline-block;
  border: 1px solid #eaedf3;
  padding: 0 15px 0 15px;
  box-sizing: border-box;
  width: 100%;
  color: #000;
}

.clearfix .clearfix-container-left .search:focus {
  outline: none;
}

.clearfix .clearfix-container-left input::placeholder {
  color: #c3c5c9;
}

.clearfix .clearfix-container-left input::-moz-placeholder {
  color: #c3c5c9;
}

.clearfix .clearfix-container-left input::-webkit-input-placeholder {
  color: #c3c5c9;
}

.clearfix .clearfix-container-left .search:nth-child(2) {
  border-left: 0px;
}

.clearfix .clearfix-container-left .searchCreater {
  flex: 6;
  border-top-right-radius: 0%;
  border-bottom-right-radius: 0%;
}

.clearfix .clearfix-container-left .searchContractTemplate {
  flex: 14;
  border-radius: 0%;
}

.clearfix .clearfix-container-left .searchButton {
  flex: 1;
  color: #ffffff;
  background-color: #4093ff;
  border-top-left-radius: 0%;
  border-bottom-left-radius: 0%;
}

.clearfix .clearfix-container-right {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -60%);
  height: 36px;
  display: flex;
}

.clearfix-container-right .createNewContract {
  display: none;
  margin-right: 10px;
}

.clearfix .clearfix-container-right .iconBtn {
  position: relative;
  font-size: 15px !important;
  width: 50px;
  height: 36px;
  background-color: #409eff !important;
  border-color: #409eff !important;
}

.clearfix .clearfix-container-right .action {
  background-color: #909399 !important;
  border-color: #909399 !important;
}

.clearfix .clearfix-container-right .iconBtn:hover {
  transition: opacity 0.1s;
  opacity: 0.8;
}

.clearfix .clearfix-container-right .cmsp-icon-caidan {
  font-size: 16px !important;
}

.clearfix .clearfix-container-right .iconBtn i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.show {
  display: block !important;
}
</style>