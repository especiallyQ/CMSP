<template>
  <div class="cmsp-login-container">
    <canvas id="canvas"></canvas>
    <div class="login-lang">
      <lang-select></lang-select>
    </div>
    <div class="login">
      <div class="header">
        <div class="main">CMSP</div>
        <div class="sub">&copy;Audaque</div>
      </div>
      <div class="msg-wrapper">
        <div class="msg-error" v-show="msgError || timeout">
          <i class="el-icon-remove"></i>
          <span v-if="msgError">
            {{ msgErrorContent || this.$t("text.loginFail") }}
          </span>
          <span v-else-if="timeout">
            {{ this.$t("text.reqOvertime") }}
          </span>
        </div>
      </div>
      <div class="form-wrapper">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="rules"
          class="login-form"
        >
          <el-form-item prop="user">
            <el-input
              v-model="loginForm.user"
              :placeholder="$t('inputText.user')"
              prefix-icon="cmsp-icon-yonghu"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              :placeholder="$t('inputText.password')"
              type="password"
              prefix-icon="ext-icon-lock"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="vercode">
            <div class="vercode-wrapper">
              <el-input
                style="width: 220px"
                v-model="loginForm.vercode"
                :placeholder="$t('inputText.verificationCode')"
                @keyup.enter.native="submit('loginForm')"
                prefix-icon="ext-icon-xitongguanli"
              >
              </el-input>
              <span class="vercode">
                <img
                  style="width: 100%; height: 100%"
                  :src="codeUrl"
                  alt=""
                  @click="changeCode()"
                />
              </span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button
          @click="submit('loginForm')"
          type="primary"
          class="login-submit"
          :loading="logining"
        >
          {{ this.$t("login.login") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { login, getPictureCheckCode } from "@/util/api";
import url from "@/util/url";
import { delCookie, random } from "@/util/util";
import { sm3 } from "sm-crypto";
import langSelect from "@/components/LangSelect";
const gm = require("@/util/SM2Sign");

export default {
  name: "Login",
  components: {
    langSelect,
  },
  data() {
    return {
      // canvas动画
      canvas1: null,
      canvas2: null,
      ctx1: null,
      ctx2: null,
      w: 0,
      h: 0,
      hue: 217,
      stars: [], // 星星数据集
      maxStars: 2000, // 星星数量
      // 登录
      logining: false,
      msgError: false,
      msgErrorContent: "",
      timeout: false,
      codeUrl: url.codeUrl,
      loginForm: {
        user: "",
        password: "",
        vercode: "",
      },
      rules: {
        user: [
          {
            required: true,
            message: this.$t("inputText.user"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("inputText.password"),
            trigger: "blur",
          },
        ],
        vercode: [
          {
            required: true,
            message: this.$t("inputText.verificationCode"),
            trigger: "blur",
          },
        ],
      },
      authToken: null,
    };
  },
  mounted() {
    this.changeCode();
    this.initCanvas();
    this.initStars();
    this.animation();
  },
  methods: {
    // 验证码
    changeCode() {
      this.codeUrl = "";
      this.authToken = "";
      getPictureCheckCode()
        .then((res) => {
          if (res.data.code === 0) {
            this.codeUrl = `data:image/png;base64,${res.data.data.base64Image}`;
            this.authToken = res.data.data.token;
          } else {
            this.codeUrl = "";
            this.authToken = "";
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.codeUrl = "";
          this.authToken = "";
          this.$message({
            message: this.$t("text.systemError"),
            type: "error",
            duration: 2000,
          });
        });
    },
    // 提交登录事件
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.logining = true;
          this.userLogin();
        } else {
          return false;
        }
      });
    },
    // 登录
    userLogin(callback) {
      delCookie("JSESSIONID");
      delCookie("NODE_MGR_ACCOUNT_C");
      let reqData = {
        account: this.loginForm.user,
        accountPwd: sm3(this.loginForm.password),
      };
      let checkCode = this.loginForm.vercode;
      login(reqData, checkCode, this.authToken)
        .then((res) => {
          if (res.data.code === 0) {
            let resData = res.data.data;
            // 所属账号群组
            localStorage.setItem("groupName", resData.accountGroupName);
            // 所属账号群组唯一标识
            localStorage.setItem("groupId", resData.accountGroupId);
            // 所属根账号群组唯一标识
            localStorage.setItem("rootGroupId", resData.rootAccountGroupId);
            // 账号名
            localStorage.setItem("user", resData.account);
            // 账号唯一标识
            localStorage.setItem("userId", resData.accountId);
            // 账号类型(权限角色)
            localStorage.setItem("root", resData.roleName);
            // 登录CMSP系统的token
            localStorage.setItem("token", resData.token);

            let chainUserList = resData.chainUserList || [];
            let chainIdentity = [],
              chainOrg = [];
            chainUserList.forEach((userItem) => {
              chainIdentity.push(String(userItem.chainId));
              chainOrg.push(String(userItem.orgId));
            });
            // 具有参与哪些链上事务的身份(即成为组织内的链上用户且此用户注册到某链上)
            localStorage.setItem("chainIdentity", chainIdentity);
            // 做为链上用户加入了哪些组织(且用户是被注册到链上)
            localStorage.setItem("chainOrg", chainOrg);
            // 默认选中的菜单
            localStorage.setItem("sidebarActive", "");
            // 菜单默认不隐藏
            localStorage.setItem("sidebarHide", "false");

            // 账号状态,判断是否需要修改密码
            sessionStorage.setItem("accountStatus", resData.accountStatus);
            router.push("/main");
          } else {
            this.changeCode();
            this.msgErrorContent = this.$chooseLang(res.data.code);
            this.msgError = true;
            this.loginForm.password = "";
            this.logining = false;
          }
        })
        .catch((err) => {
          this.changeCode();
          this.timeout = true;
          this.loginForm.password = "";
          this.logining = false;
        });
    },
    // 画布初始化
    initCanvas() {
      this.canvas1 = document.getElementById("canvas");
      (this.ctx1 = this.canvas1.getContext("2d")),
        (this.w = this.canvas1.width = window.innerWidth);
      this.h = this.canvas1.height = window.innerHeight;

      this.canvas2 = document.createElement("canvas");
      this.ctx2 = this.canvas2.getContext("2d");
      this.canvas2.width = 100;
      this.canvas2.height = 100;
      let half = this.canvas2.width / 2;
      let gradient = this.ctx2.createRadialGradient(
        half,
        half,
        0,
        half,
        half,
        half
      );
      gradient.addColorStop(0.025, "#CCC");
      gradient.addColorStop(0.1, "hsl(" + this.hue + ", 61%, 33%)");
      gradient.addColorStop(0.25, "hsl(" + this.hue + ", 64%, 6%)");
      gradient.addColorStop(1, "transparent");
      this.ctx2.fillStyle = gradient;
      this.ctx2.beginPath();
      this.ctx2.arc(half, half, half, 0, Math.PI * 2);
      this.ctx2.fill();
    },
    // 初始化画布星星
    initStars() {
      for (let i = 0, count = 0; i < this.maxStars; i++) {
        let orbitRadius = random(this.maxOrbit(this.w, this.h));
        let star = {
          orbitRadius: orbitRadius,
          radius: random(60, orbitRadius) / 18,
          orbitX: this.w / 2,
          orbitY: this.h / 2,
          timePassed: random(0, this.maxStars),
          speed: random(orbitRadius) / 500000,
          alpha: random(2, 10) / 10,
        };
        count++;
        this.stars[count] = star;
      }
    },
    // 绘制星星
    drawStar(star) {
      let x = Math.sin(star.timePassed) * star.orbitRadius + star.orbitX,
        y = Math.cos(star.timePassed) * star.orbitRadius + star.orbitY,
        twinkle = random(10);
      if (twinkle === 1 && star.alpha > 0) {
        star.alpha -= 0.05;
      } else if (twinkle === 2 && star.alpha < 1) {
        star.alpha += 0.05;
      }

      this.ctx1.globalAlpha = star.alpha;
      this.ctx1.drawImage(
        this.canvas2,
        x - star.radius / 2,
        y - star.radius / 2,
        star.radius,
        star.radius
      );
      star.timePassed += star.speed;
    },
    // 画布星星移动范围,值越大范围越小
    maxOrbit(x, y) {
      let max = Math.max(x, y),
        diameter = Math.round(Math.sqrt(max * max + max * max));
      return diameter / 2;
    },
    // 画布动画
    animation() {
      this.ctx1.globalCompositeOperation = "source-over";
      this.ctx1.globalAlpha = 0.5;
      this.ctx1.fillStyle = "hsla(" + this.hue + ", 64%, 6%, 2)";
      this.ctx1.fillRect(0, 0, this.w, this.h);
      this.ctx1.globalCompositeOperation = "lighter";

      for (let i = 1; i < this.stars.length; i++) {
        this.drawStar(this.stars[i]);
      }
      window.requestAnimationFrame(this.animation);
    },
  },
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}
.cmsp-login-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #070c14;
  overflow: hidden;
}
.login-lang {
  position: absolute;
  right: 10px;
  top: 20px;
  min-width: 160px;
}
.login {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 360px;
  padding: 0 24px 20px 24px;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 45px rgba(255, 255, 255, 0.1);
}
.login .header {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  color: #3498db;
  font-weight: bold;
  text-shadow: 0 0 5px #000;
  user-select: none;
}
.login .header .main {
  font-size: 54px;
  letter-spacing: 4px;
}
.login .header .sub {
  font-size: 18px;
  padding-bottom: 12px;
}
.login .msg-wrapper {
  position: relative;
  min-height: 20px;
  height: auto;
}
.login .msg-wrapper .msg-error {
  color: #e4393c;
}
.login .form-wrapper {
  position: relative;
}
.login .form-wrapper .login-form .vercode-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}
.login .form-wrapper .login-form .vercode-wrapper .vercode {
  display: inline-block;
  width: 80px;
  height: 34px;
  line-height: 34px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}
.login .login-submit {
  width: 100%;
  height: 38px;
  margin-top: 10px;
  font-size: 14px;
}
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
}
.login .form-wrapper .login-form >>> .el-input__inner {
  color: #fff;
  border: transparent;
  background-color: rgba(255, 255, 255, 0.1);
}
.login .form-wrapper .login-form >>> .el-input__prefix {
  color: #fff;
}
.login .form-wrapper .login-form >>> .el-input__inner::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
</style>
