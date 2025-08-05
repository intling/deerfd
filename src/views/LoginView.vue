<script lang="ts" setup>
import { ref } from "vue";
import { login } from "../api/user";
import { TokenStore } from "../stores/user";
import router from "../router";

const username = ref("");
const password = ref("");
const tokenStore = TokenStore();

//登录接口
const logIn = async () => {
  if (!validatePassword(password.value)) {
    alert("密码必须包含字母和数字，且长度在8到16个字符之间");
    return;
  }
  try {
    const response = await login({ username: username.value, password: password.value });
    console.log(response);
    //登录逻辑
    if (response.code === "200") {
      tokenStore.setToken(response.token);
      router.push("/home");
    } else {
      alert("登录失败，请检查用户名和密码");
    }
  } catch (error) {
    console.error("登录失败:", error);
  }
};
const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
  return regex.test(password);
};
</script>
<template>
  <div class="container">
    <div class="docker">
      <div class="left"></div>
      <div class="login-wrapper">
        <div class="header">欢迎登录</div>
        <div class="form-wrapper">
          <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" name="username" v-model="username" placeholder="" required />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input type="password" name="password" v-model="password" placeholder="" required />
          </div>
          <a href="#"> 忘记密码?</a>
          <router-link to="/register" class="zhuce">注册</router-link>
        </div>
        <br />
        <div class="btn" @click="logIn">登录</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-image: url(../image/log1.jpg);
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-size: cover;
  /* position: fixed; */
  margin-top: 0;
  margin-left: 0;
}
.docker {
  width: 30%;
  height: 60%;
  border-radius: 15px;
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  margin-left: 50%;
}

.login-wrapper {
  flex: 1;
  height: 55%;
  padding: 0 50px;
  position: relative;
  margin: 0 auto;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.8);
  /* box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2); */
  border: 2px solid transparent;
  background-clip: padding-box;
  -webkit-mask-image: linear-gradient(0deg, #fff, #fff);
  mask-image: linear-gradient(0deg, #fff, #fff);
}
.login-wrapper:hover {
  border-image: linear-gradient(to right, #00c6ff, #0072ff) 1;
}
.form-wrapper {
  display: contents;
  justify-content: center;
  align-content: center;
  gap: 20px;
}
.header {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  line-height: 150px;
  color: black;
}
.form-group {
  margin-bottom: 20px;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}
input {
  width: 97%;
  height: 40px;
  border: 2px solid #00c6ff;
  border-radius: 5px;
  transition: border-color 0.3s;
  background-color: rgba(255, 255, 255, 0.3);
}
input:focus {
  border-color: #00f0ff;
  box-shadow: 0 0 8px rgba(0, 198, 255, 0.6);
  outline: none;
}
.btn {
  padding: 8px;
  width: 85%;
  text-align: center;
  background: linear-gradient(to right, #00c6ff, #0072ff);
  color: #fff;
  cursor: pointer;
  margin: 25px auto;
  border-radius: 5px;
}
.btn:hover {
  background: linear-gradient(to right, #00aaff, #005fd9);
  transform: scale(1.03);
}
.zhuce {
  float: right;
}
.msg {
  text-align: center;
}
a {
  text-decoration-line: none;
  color: #abc1ee;
}
</style>
