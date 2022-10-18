<template>
  <div class="contractDrawerCard-container">
    <el-card :body-style="{ padding: '0px' }" class="contractDrawerCard-cart">
      <div class="body-container">
        <div class="top-body" @click="onClick" @mouseenter="onMouseenter">
          <div class="left-titleIcon">
            <div class="title">
              <slot name="checkBox"></slot>
            </div>
          </div>
          <div class="right-content">
            <div class="right-content-container">
              <div class="detil">
                <el-tooltip placement="top">
                  <div slot="content">
                    <div v-for="(str, index) in remark.all" :key="index">
                      {{ str }}<br />
                    </div>
                  </div>
                  <span class="remark">
                    {{ remark.name }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-menu">
          <div class="bottom-menu-container">
            <slot name="checkBox2" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "contractDrawerCard",
  props: {
    propRemark: {
      type: String || Array,
      default: "备注",
      required: false,
    },
  },
  data() {
    return {
      remarkMaxNumberOfWords: 30,
    };
  },
  computed: {
    remark: {
      get() {
        if (
          !Array.isArray(this.propRemark) &&
          Object.prototype.toString.call(this.propRemark) !== "[object String]"
        ) {
          throw new Error("请传入字符串或数组类型的备注数据！");
        } else {
          //将字符串类型的备注数据转换为数组，方便渲染，默认每段30个字符，可修改上方remarkMaxNumberOfWords字段改变长度
          let newlist = [];

          if (this.isString(this.propRemark)) {
            let value = this.propRemark;
            let len = this.propRemark.length;

            if (len >= this.remarkMaxNumberOfWords) {
              let forNum = Math.ceil(len / this.remarkMaxNumberOfWords);
              for (let i = 0; i < forNum; i++) {
                let str = "";
                for (
                  let j = i * this.remarkMaxNumberOfWords;
                  j <
                  i * this.remarkMaxNumberOfWords + this.remarkMaxNumberOfWords;
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
          } else {
            newlist = this.propRemark;
          }

          return {
            name: newlist[0],
            all: newlist,
          };
        }
      },
    },
  },
  methods: {
    isString(val) {
      return Object.prototype.toString.call(val) === "[object String]";
    },
    onClick(e) {
      this.$emit("click", e);
    },
    onMouseenter(e) {
      this.$emit("mouseenter", e);
    },
  },
};
</script>

<style scoped>
.contractDrawerCard-container {
  display: flex;
  width: 100%;
  padding: 0 8px 16px;
}

.contractDrawerCard-container .contractDrawerCard-cart {
  flex: 1;
  width: 100%;
  border: 1px solid transparent;
  box-sizing: border-box;
}

.contractDrawerCard-container .contractDrawerCard-cart:hover {
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

.top-body .left-titleIcon .title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-20%, -50%);
  line-height: 20px;
}

.top-body .left-titleIcon .title >>> span:nth-child(1) {
  font-size: 15px !important;
  color: #409eff;
  font-weight: 700;
}

.top-body .left-titleIcon .title >>> span:nth-child(2) {
  margin-top: 10px;
  margin-left: 5px;
  font-size: 30px !important;
  color: #409eff;
  font-weight: 700;
}

.top-body .right-content {
  margin-left: 65px;
  padding: 10px 0 0 0;
  flex: 1;
  box-sizing: border-box;
}

.top-body .right-content .right-content-container {
  display: flex;
  flex-direction: column;
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

.right-content-container .detil span {
  font-size: 12px;
  font-weight: 510;
  color: #737a86;
}

.right-content-container .detil .remark {
  display: block;
  width: 10vw;
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