<script lang="ts" setup>
import { register } from "@/api/user";
import { ref } from "vue";
import router from "@/router";

const username = ref("");
const password1 = ref("");
const password2 = ref("");
async function handleRegister() {
  try {
    if (password1.value === "" || password2.value === "" || username.value === "") {
      alert("用户名或密码不能为空");
      return;
    }
    // 检查密码是否一致以及格式是否正确
    if (password1.value !== password2.value) {
      alert("密码不一致");
      // return;
    } else if (!validatePassword(password1.value)) {
      alert("密码必须包含字母和数字，且长度在8到16个字符之间");
      // return;
    } else {
      const response = await register({ username: username.value, password: password1.value });
      console.log("注册成功", response);
      alert("注册成功，请登录");
      router.push("/login");
    }
  } catch (error) {
    console.log("注册失败", error);
    alert(`注册失败${error}`);
  }
}

const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
  return regex.test(password);
};
</script>

<template>
  <div class="big_content">
    <div class="registration-container">
      <h1>创建账户</h1>
      <form id="registrationForm" onsubmit="return handleRegister()">
        <div class="input-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="username" placeholder="输入用户名" required />
        </div>
        <div class="input-group">
          <label for="email">邮箱</label>
          <input type="email" id="email" placeholder="输入邮箱" required />
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="password1"
            placeholder="8-16位不含特殊字符的数字、字母组合"
            required
          />
        </div>
        <div class="input-group">
          <label for="confirm-password">确认密码</label>
          <input
            type="password"
            id="confirm-password"
            v-model="password2"
            placeholder="确认密码"
            required
          />
        </div>
        <button type="submit" @click="handleRegister">注册</button>
      </form>
      <div id="message"></div>
      <div class="footer">
        <p>已经有账户？<router-link to="/login">登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.big_content {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  font-family: "SimSun", serif;
  color: #333;
  background-repeat: no-repeat;
  background-image: url("../image/log6.jpg");
}

.registration-container {
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  max-width: 450px;
  width: 100%;
  text-align: center;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.5);
}

h1 {
  margin-bottom: 10px;
  color: #8b4513;
  font-size: 28px;
}

.subtitle {
  margin-bottom: 20px;
  color: #5b3a29;
  font-size: 14px;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
  border-color: #00f0ff;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(to right, #00c6ff, #0072ff);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

button:hover {
  background-color: #6f3c2a;
}

#message {
  text-align: center;
  margin-top: 15px;
  color: red;
}

.footer {
  text-align: center;
  margin-top: 20px;
}

.footer a {
  color: #00f0ff;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
