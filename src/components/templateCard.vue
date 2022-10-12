<template>
  <div class="templateCard-container">
    <el-card :body-style="{ padding: '0px' }" class="contract-cart">
      <div class="body-container">
        <div class="top-body">
          <div class="left-titleIcon">
            <h4 :style="{ backgroundColor: titleIconColor }">
              {{ propTitle[0] }}
            </h4>
          </div>
          <div class="right-content">
            <div class="right-content-container">
              <div class="right-content-title">
                <h4 class="text">{{ title }}</h4>
              </div>
              <div class="detil">
                <ul>
                  <li v-for="(obj, index) in detilDate" :key="index">
                    <p class="one-line">
                      <span>{{ obj.key }}</span> :
                      <span
                        >{{
                          obj.name
                        }}</span
                      >
                    </p>
                  </li>
                  <li>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <div v-for="(str, index) in remark.all" :key="index">
                          {{ str }}<br />
                        </div>
                      </div>
                      <div>
                        <span>{{ remark.key }}</span> :
                        <span>
                          {{ remark.name }}
                        </span>
                      </div>
                      <!-- <div><span>12512</span> : <span>123124</span></div> -->
                    </el-tooltip>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-menu"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { objectIsEmpty } from "@/util/util";
export default {
  name: "templateCard",
  props: {
    propTitleIconColor: {
      type: String,
      default: "",
    },
    propTitle: {
      type: String,
      default: "模板标题",
    },
    propDetilDate: {
      type: Object,
      default: () => {
        return {
          templateCreatorShort: "创建者1",
          templateVisibilityShort: "所有人可见",
          templateOperation: "操作",
          templateVersionCount: "版本数",
          templateVersionStroke: "个",
          contractName: "合约名称",
          contractId: "合约ID",
          contractVersion: "版本号",
          templateDescription: ["laksjdlaksjdlkasdaz", "aslkdjk"],
        };
      },
      //验证传入数据，必须为对象数组
      validator: (value) => {
        if (objectIsEmpty(value)) {
          return false;
        }
        return true;
      },
    },
  },
  data() {
    return {
      title: this.propTitle,
      detilDate: this.propDetilDate,
      titleIconColor: this.propTitleIconColor
        ? this.propTitleIconColor
        : "rgb(0, 102, 153)",
      //一些需要特殊处理的选项，不能和其他普通数据一起渲染的
      specialHandlingList: ["备注", "Template Description", "Description"],
      remark: {
        key: "",
        name: "",
        all: [],
      },
    };
  },
  methods: {
    getDrawDate() {
      const newDetilDate = [];
      Object.keys(this.detilDate).forEach((key, index) => {
        let obj = {};
        let i18nName = this.$t(`table.${key}`);
        if (this.specialHandlingList.includes(i18nName)) {
          try {
            if (!Array.isArray(this.detilDate[key])) {
              throw new Error(
                "备注字段需要以数组形式存储每个段落，如坚持使用字符串可忽略当前提示"
              );
            }
          } catch (e) {
            this.detilDate[key] = [this.detilDate[key]];
          }

          this.remark.key = i18nName;
          this.remark.name = this.detilDate[key][0];
          this.remark.all = this.detilDate[key];
        } else {
          obj.key = i18nName;
          obj.name = this.detilDate[key];
          newDetilDate.push(obj);
        }
      });
      this.detilDate = newDetilDate;
    },
  },
  created() {
    this.getDrawDate();
  },
};
</script>

<style scoped>
.templateCard-container {
  display: flex;
  width: 23%;
  padding: 0 8px 16px;
}

.templateCard-container .contract-cart {
  flex: 1;
  width: 100%;
}

.body-container {
  display: flex;
  flex-direction: column;
}

.body-container .top-body {
  flex: 1;
  padding: 14px 7px;
  cursor: pointer;
  width: 100%;
  display: flex;
  box-sizing: border-box;
}

.top-body .left-titleIcon {
  width: 60px;
  position: relative;
  min-height: 40px;
}

.left-titleIcon h4 {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 22px;
  color: #ffffff;
  border-radius: 4px;
}

.top-body .right-content {
  flex: 1;
  box-sizing: border-box;
}

.top-body .right-content .right-content-container {
  display: flex;
  flex-direction: column;
}

.right-content-container .right-content-title {
  width: 13vw;
}

.right-content-container .text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-content-container h4 {
  height: 21px;
  font-size: 15px;
  margin-bottom: 7px;
}

.right-content-container .detil li {
  height: 18px;
  margin-bottom: 5px;
}

.right-content-container .detil span {
  font-size: 12px;
  color: #737a86;
}
.right-content-container .detil .one-line {
  width: 13.5vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.body-container .bottom-menu {
  height: 37px;
  width: 100%;
}
</style>