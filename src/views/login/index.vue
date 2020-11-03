<template>
  <div class="login-container">
    <el-tabs v-model="activeName" class="login-form" :stretch="true" :tab-position="tabPosition">
      <div class="title-container">
        <h3 class="title">康智后台</h3>
      </div>
      <el-tab-pane label="账户密码登录" name="first">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input ref="username" v-model="loginForm.username" placeholder="用户名" name="username" type="text" tabindex="1" auto-complete="on" />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
          <div class="tips">
            <span style="margin-right:20px;">username: 18888888888</span>
            <span> password: 123456</span>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="手机验证码登录" name="second">
        <el-form ref="noteFrom" :model="noteFrom">
          <el-form-item>
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input v-model="noteFrom.phone" placeholder="手机号"></el-input>
          </el-form-item>
          <el-row :gutter="24">
            <el-col :span="15">
              <el-form-item>
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input v-model="noteFrom.note" placeholder="验证码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-button type="success" round style="margin-top: 7px;" @click.native.prevent="sendNote" :disabled="!show">
                <span v-show="show">发送验证码</span>
                <span v-show="!show" class="count">{{count}} s</span>
              </el-button>
              <!-- <button @click="getCode()" type="success" :disabled="!show">
                <span v-show="show">发送验证码</span>
                <span v-show="!show" class="count">{{count}} s</span>
              </button> -->
            </el-col>
          </el-row>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="noteLogin">登录</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="扫码登录" name="third">
        二维码
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
const TIME_COUNT = 60 // 倒计时的时间

export default {
  name: 'Login',
  data() {
    // eslint-disable-next-line no-unused-vars
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    // eslint-disable-next-line no-unused-vars
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'first',
      tabPosition: 'bottom',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入账户', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      noteFrom: {
        phone: '',
        note: ''
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      show: true,
      count: '',
      timer: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    /** 账号密码登录 */
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.$message({
              message: '登陆成功',
              type: 'success'
            })
            this.loading = false
          }).catch(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    /** 发送手机验证码 */
    sendNote() {
      if (this.noteFrom.phone === '') {
        this.$message({
          message: '请输入手机号',
          type: 'warning',
          center: true
        })
      } else if (!(/^1[3456789]\d{9}$/.test(this.noteFrom.phone))) {
        this.$message({
          message: '请输入正确的手机号',
          type: 'warning',
          center: true
        })
      } else {
        this.$message({
          message: '短信验证码已发送',
          type: 'success',
          center: true
        })
        this.getCode()
      }
    },
    /** 手机验证码登录 */
    noteLogin() {
      console.log(this.noteFrom)
    },
    getCode() {
      // 验证码倒计时
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

.el-tabs__item {
  color: #fff;
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  -webkit-app-region: drag; // 可拖动

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    -webkit-app-region: no-drag; // 不可拖动
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
