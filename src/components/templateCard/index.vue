<template>
  <div class="templateCard-container">
    <el-card :body-style="{ padding: '0px' }" class="contract-cart">
      <div class="body-container">
        <div class="top-body" @click="onClick" @mouseenter="onMouseenter">
          <div class="left-titleIcon">
            <h4 :style="{ backgroundColor: titleIconColor }">
              {{ propTitle[0] }}
            </h4>
          </div>
          <div class="right-content">
            <div class="right-content-container">
              <div class="right-content-title">
                <h4 class="text">
                  {{ title }}
                </h4>
              </div>
              <div class="detil">
                <ul>
                  <li v-for="(obj, index) in detilDate" :key="index">
                    <p class="one-line">
                      <span>{{ obj.key }}</span> :
                      <span>{{ obj.name }}</span>
                    </p>
                  </li>
                  <li v-if="remark.key">
                    <div>
                      <p class="one-line">
                        <span>{{ remark.key }}</span> :
                        <el-tooltip placement="top">
                          <div slot="content">
                            <div
                              v-for="(str, index) in remark.all"
                              :key="index"
                            >
                              {{ str }}<br />
                            </div>
                          </div>
                          <span>
                            {{ remark.name }}
                          </span>
                        </el-tooltip>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-menu">
          <div class="bottom-menu-container">
            <slot />
          </div>
        </div>
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
        };
      },
      //验证传入数据，必须为对象
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
      specialHandlingList: ["备注", "Template Description", "Description","id"],
      remark: {
        key: "",
        name: "",
        all: [],
      },
      remarkMaxNumberOfWords: 30,
    };
  },
  methods: {
    isString(val) {
      return Object.prototype.toString.call(val) === "[object String]";
    },
    //以及对某些字段做特殊处理，如备注字段的hover弹框功能
    getDrawDate() {
      const newDetilDate = [];
      Object.keys(this.detilDate).forEach((key, index) => {
        let obj = {};
          //判断是否是需要特殊处理的数据字段
          if (this.specialHandlingList.includes(key)) {
            if (
              !Array.isArray(this.detilDate[key]) &&
              Object.prototype.toString.call(this.detilDate[key]) !==
                "[object String]"
            ) {
              throw new Error("请传入字符串或数组类型的备注数据！");
            } else {
              //将字符串类型的备注数据转换为数组，方便渲染，默认每段30个字符，可修改上方remarkMaxNumberOfWords字段改变长度
              if (this.isString(this.detilDate[key])) {
                let value = this.detilDate[key];
                let len = this.detilDate[key].length;
                let newlist = [];

                if (len >= this.remarkMaxNumberOfWords) {
                  let forNum = Math.ceil(len / this.remarkMaxNumberOfWords);
                  for (let i = 0; i < forNum; i++) {
                    let str = "";
                    for (
                      let j = i * this.remarkMaxNumberOfWords;
                      j <
                      i * this.remarkMaxNumberOfWords +
                        this.remarkMaxNumberOfWords;
                      j++
                    ) {
                      if (value[j]) {
                        str += value[j];
                      }
                    }
                    newlist.push(str);
                  }
                } else {
                  newlist.push(value);
                }
                this.detilDate[key] = newlist;
              }

              this.remark.key = key;
              this.remark.name = this.detilDate[key][0];
              this.remark.all = this.detilDate[key];
            }
          } else {
            obj.key = key;
            obj.name = this.detilDate[key];
            newDetilDate.push(obj);
          }
      });
      this.detilDate = newDetilDate;
    },
    onClick(e) {
      this.$emit("click", e);
    },
    onMouseenter(e) {
      this.$emit("mouseenter", e);
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
  border: 1px solid transparent;
  box-sizing: border-box;
}

.templateCard-container .contract-cart:hover {
  border: 1px solid #62a2eb;
  background-color: #e8f0f8;
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
  margin-left: 10px;
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
  font-weight: 510;
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
  position: relative;
}

.body-container .bottom-menu .bottom-menu-container {
  position: absolute;
  right: 0;
  top: 9.5px;
  height: 37px;
  padding: 0 20px 0 0;
  display: flex;
  flex-direction: row-reverse;
}

.body-container .bottom-menu::before {
  content: "";
  position: absolute;
  opacity: 0.2;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
  width: 90%;
  height: 0.5px;
  background-color: #737a86;
}
</style>