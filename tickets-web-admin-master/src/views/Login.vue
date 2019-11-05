<template>
  <Row type="flex" justify="center" align="top" class="login">
    <Col :xs="{span:22}" style="width: 368px;">
    <Row class="header">
      <!-- <img src="../assets/xboot.png" width="220px" /> -->
      <div class="description">葱鸭后台管理系统</div>
    </Row>

    <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>

    <Row>
      <Form ref="usernameLoginForm" :model="form" :rules="rules" class="form"  :label-width="0">
        <FormItem prop="username" >
          <Input v-model="form.username" prefix="ios-contact" size="large" clearable placeholder="请输入用户名" autocomplete="off" />
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="form.password" prefix="ios-lock" size="large" clearable placeholder="请输入密码" autocomplete="off" />
        </FormItem>
      </Form>
    </Row>

    <!-- <Row type="flex" justify="space-between">
      <Checkbox v-model="saveLogin" size="large">自动登录</Checkbox>
    </Row> -->

    <Row>
      <Button class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
        <span v-if="!loading">登录</span>
        <span v-else>登录中...</span>
      </Button>
    </Row>

    </Col>
  </Row>
</template>

<script>
  import Cookies from "js-cookie";
  import { login, getUserInfo } from "@/api/index";
  import util from "@/libs/util.js";
  export default {
    data() {
      return {
        error: false,
        errorMsg: "",
        saveLogin: true,
        loading: false,
        form: {
          username: "",
          password: "",
          loginType: "MANAGE",
          code: ""
        },
        rules: {
          username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }],
          password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }],
        }
      }
    },
    methods: {
      showErrorMsg(msg) {
        this.error = true;
        this.errorMsg = msg;
      },
      submitLogin() {
        this.$refs.usernameLoginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            login({
              username: this.form.username,
              password: this.form.password,
              loginType: this.form.loginType,
              saveLogin: this.saveLogin
            }).then(res => {
              if (res.resultCode == 'SUCCESS') {
                this.setStore("accessToken", res.data);
                getUserInfo().then(res => { // 获取用户信息
                  if (res.success = true) {
                    let roles = [];
                    res.result.roles.forEach(element => {
                      roles.push(element.name);
                    });
                    this.setStore("roles", roles);
                    // if (this.saveLogin) {
                    //   // 保存7天
                    //   console.log("a" + res.result);
                    //   console.log("b" +JSON.stringify(res.result));
                    //   Cookies.set("userInfo", JSON.stringify(res.result), {
                    //     expires: 7
                    //   });
                    // } else {
                    //   Cookies.set("userInfo", JSON.stringify(res.result));
                    // }
                    this.setStore("userInfo", res.result);
                    // 加载菜单
                    // util.initRouter(this);
                    this.$router.push({
                      name: "home"
                    });
                  }
                })
              } else {
                this.loading = false;
                this.$Message.error({
                  content: '操作失败：' + res.message,
                  duration: 5
                });
              }

            });
          } else {
            this.loading = false;
          }
        })
      }
    },
    mounted() {
      // util.initRouter(this);
    }
  }
</script>

<style lang="less">
  @import "./login.less";
</style>