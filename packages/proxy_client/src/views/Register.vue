<template>
  <el-form
    @submit.prevent="register"
    label-width="80px"
    style="max-width: 400px; margin: 50px auto"
  >
    <el-form-item label="手机号">
      <el-input v-model="phone" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item label="用户名">
      <el-input v-model="username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input type="password" v-model="password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="register">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const phone = ref('')
const username = ref('')
const password = ref('')

const register = () => {
  console.log('手机号:', phone.value)
  console.log('用户名:', username.value)
  console.log('密码:', password.value)
  // 在这里处理注册逻辑
}
</script>

<style scoped>
/* 这里可以添加你的样式 */
</style>
