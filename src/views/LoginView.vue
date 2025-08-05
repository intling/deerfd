<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { login } from '../api/user'
import { useRouter } from 'vue-router'
import { TokenStore } from '../stores/user'
import router from '../router'

const username = ref('')
const password = ref('')
const tokenStore = TokenStore()


//登录接口
const logIn = () => {
    axios.post('/api/login', {
    username: username.value,
    password: password.value
}).then(res => {
    console.log(res)
    tokenStore.setToken(res.token)
    router.push('/home')
}).catch(error => {
    console.error('登录失败:', error)
    // 提示用户登录失败
})

const response = login(username.value, password.value)
console.log(response)
}
</script>
<template>
<div class="container" >
    <div class="docker">
           <div class="left"></div>
        <div class="login-wrapper">
            <div class="header">欢迎登录</div>
            <div class="form-wrapper">
                <div class="form-group">
                  <label for="username">用户名</label>
                  <input type="text" name="username" v-model="username" placeholder="" >
                </div>
                <div class="form-group">
                   <label for="password">密码</label>
                    <input type="password" name="password" v-model="password" placeholder="" >
                </div>
                <a href="#"> 忘记密码?</a>
                <router-link to="/register" class="zhuce">注册</router-link>
            </div>
            <br>
            <div class="btn" @click="logIn" >登录</div>
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
.login-wrapper:hover{
    border-image: linear-gradient(to right,#00c6ff,#0072ff) 1;
}
.form-wrapper{
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
input{
    width: 97%;
    height: 40px;
    border: 2px solid #00c6ff;
    border-radius: 5px;
    transition: border-color 0.3s;
    background-color: rgba(255,255,255,0.3);
}
input:focus{
    border-color: #00f0ff;
    box-shadow: 0 0 8px rgba(0,198,255,0.6);
    outline: none;
}
.btn {
    padding: 8px;
    width: 85%;
    text-align: center;
    background: linear-gradient(to right,#00c6ff,#0072ff);
    color: #fff;
    cursor: pointer;
    margin: 25px auto;
    border-radius: 5px;
}
.btn:hover{
    background: linear-gradient(to right,#00aaff,#005fd9);
    transform: scale(1.03);
}
.zhuce{
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