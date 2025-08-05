<script lang="ts" setup>
import { ref } from "vue";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import type { UploadFile } from "element-plus";
import { save } from "../api/user";

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);
const uploadRef = ref();
const isShow = ref(false);
const isWhite = ref(false);
const nickname = ref("");
const password = ref("");
const email = ref("");
const gender = ref("");
const age = ref(0);
const bio = ref("");
const isEditing = ref(false);

const handleRemove = (file: UploadFile) => {
  console.log(file);
  uploadRef.value?.handleRemove(file);
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

const handleDownload = (file: UploadFile) => {
  console.log(file);
};
const open = () => {
  isShow.value = true;
  isWhite.value = true;
};
async function saveMessage() {
  try {
    const response = await save({
      nickname: nickname.value,
      password: password.value,
      email: email.value,
      age: age.value,
      gender: gender.value,
      bio: bio.value,
    });
    console.log("保存成功", response);
    alert("保存成功");
    isEditing.value = false;
  } catch {
    alert("保存失败");
  }
}
const cancleButton = () => {
  isShow.value = false;
  isWhite.value = false;
};
const okButton = () => {
  isShow.value = false;
  isWhite.value = false;
};
</script>

<template>
  <div class="bigbox">
    <div class="line-content">
      <div class="touxiang">
        <label>头像：</label>
      </div>
      <div class="tabar">
        <el-upload ref="uploadRef" action="#" list-type="picture-card" :auto-upload="false">
          <el-icon><Plus /></el-icon>

          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-icon><zoom-in /></el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <el-icon><Download /></el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </div>
    </div>

    <div class="quart">
      <label>昵称：</label>
      <input type="string" v-model="nickname" :disabled="!isEditing" />
    </div>
    <div class="quart">
      <label>密码：</label>
      <input type="password" v-model="password" :disabled="!isEditing" />
    </div>
    <div class="quart">
      <label>邮箱：</label>
      <input type="string" v-model="email" :disabled="!isEditing" />
    </div>
    <div class="quart">
      <label>性别：</label>
      <input type="string" v-model="gender" :disabled="!isEditing" />
    </div>
    <div class="quart">
      <label>年龄：</label>
      <input type="number" v-model="age" :disabled="!isEditing" />
    </div>
    <div class="quart">
      <label class="own-bio">个人简介：</label>
      <textarea
        name=""
        id="biotext"
        cols="70"
        rows="7"
        v-model="bio"
        :disabled="!isEditing"
      ></textarea>
    </div>
    <button class="editMessage" @click="open">编辑</button>
    <button class="saveMessage" @click="saveMessage">保存</button>
  </div>

  <div class="modal-mask" v-show="isWhite">
    <div class="content" v-show="isShow">
      <h3>个人信息</h3>
      昵称：<input type="string" v-model="nickname" /><br />
      密码：<input type="password" v-model="password" /><br />
      邮箱：<input type="string" v-model="email" /><br />
      年龄：<input type="number" v-model="age" /><br />
      性别：<input type="string" v-model="gender" /><br />
      个人简介：<textarea name="" id="bio" cols="50" rows="5" v-model="bio"></textarea><br />
      <button class="cancelMessage" @click="cancleButton">cancel</button
      ><button class="okMessage" @click="okButton">OK</button>
    </div>
  </div>
</template>

<style scoped>
h3 {
  text-align: center;
}
.line-content {
  display: flex;
  margin-top: 20px;
}
.touxiang {
  width: 60px;
  font-size: 18px;
  height: 150px;
  margin-left: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tabar {
  width: 90%;
  height: 150px;
  margin-left: 15px;
}
.modal-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.content {
  width: 500px;
  height: 450px;
  padding: 15px;
  background-color: rgb(255, 255, 255);
  border: 1px solid grey;
  box-shadow: 0 0 5px grey;
  border-radius: 8px;
  margin: 6% 34%;
  position: sticky;
  z-index: 1000;
}
.quart {
  width: 40%;
  height: 18%;
  margin-top: 20px;
  margin-left: 20px;
  font-size: 18px;
}
.quatr:input {
  height: 32px;
}
.own-bio {
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.biotext {
  margin-left: 55px;
}
.editMessage,
.saveMessage,
.cancelMessage,
.okMessage {
  height: 30px;
  background-color: #007bff;
  color: white;
  border-radius: 3px;
  margin-top: 20px;
  border: 1px solid rgb(255, 255, 255);
}
.saveMessage {
  width: 90px;
  height: 45px;
  font-size: 14px;
  margin-left: 10%;
  font-size: 16px;
  border-radius: 5px;
}
.editMessage {
  width: 90px;
  height: 45px;
  margin-left: 10%;
  font-size: 16px;
  border-radius: 5px;
}
.cancelMessage,
.okMessage {
  width: 70px;
  height: 30px;
  margin-left: 23%;
}
input {
  width: 80%;
  height: 25px;
  margin-top: 10px;
  margin-bottom: 8px;
  border-radius: 5px;
}
#bio {
  margin-top: 10px;
}
.el-message-box {
  width: 400px;
  height: 400px;
  margin: 0 auto;
  border: 1px solid grey;
}
</style>
