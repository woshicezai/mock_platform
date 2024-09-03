<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <el-card class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <template #header>
        <h2 class="text-2xl font-bold text-center text-gray-800">用户登录</h2>
      </template>
      <el-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        class="space-y-6"
        @submit.prevent="submitForm"
      >
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-full" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-4 text-center">
        <router-link to="/register" class="text-blue-500 hover:text-blue-700">
          还没有账号？去注册
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElCard, ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { login } from 'api/userAuth'
import { useRouter } from 'vue-router'

const loginForm = ref(null)
const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const router = useRouter()

const submitForm = () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      login(form.value)
        .then((response) => {
          if (response.code === 0) {
            router.replace('/home')
          } else {
            ElMessage.error(response.message)
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    } else {
      return false
    }
  })
}
</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
</style>
