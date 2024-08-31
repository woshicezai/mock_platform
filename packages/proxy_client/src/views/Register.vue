<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <el-card class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <template #header>
        <h2 class="text-2xl font-bold text-center text-gray-800">用户注册</h2>
      </template>
      <el-form :model="form" :rules="rules" ref="registerForm" class="space-y-6">
        <el-form-item prop="phone">
          <el-input v-model="form.phone" placeholder="手机号">
            <template #prefix>
              <el-icon><Phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
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
          <el-button type="primary" @click="submitForm" class="w-full">注册</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-4 text-center">
        <router-link to="/login" class="text-blue-500 hover:text-blue-700">
          已有账号？去登录
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm, ElFormItem, ElInput, ElButton, ElCard, ElMessage } from 'element-plus'
import { User, Lock, Phone } from '@element-plus/icons-vue'
import { register } from 'api/userAuth'

const router = useRouter()
const registerForm = ref(null)
const form = ref({
  phone: '',
  username: '',
  password: ''
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ]
}

const submitForm = () => {
  registerForm.value.validate((valid) => {
    if (valid) {
      register(form.value)
        .then(() => {
          ElMessage.success('注册成功，请登录')
          router.push('/login')
        })
        .catch((error) => {
          console.error('注册错误', error)
          ElMessage.error(error.message || '注册失败，请重试')
        })
    } else {
      console.log('表单验证失败')
      return false
    }
  })
}
</script>
