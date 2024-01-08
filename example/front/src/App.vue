<template>
  <el-switch
    v-model="isProxy"
    class="ml-2"
    inline-prompt
    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    active-text="开启代理"
    inactive-text="关闭代理"
    @change="changeProxyStatus"
  />
  <div>
    <button @click="fetchServer">请求server</button>
    <div>
      <h1>{{ hello }}</h1>
    </div>
  </div>
</template>

<script setup>
import { get } from 'utils/http'
import proxyConfig from 'utils/http/proxy'
import { ref } from 'vue'

const hello = ref({})

const isProxy = ref(proxyConfig.getProxy())

const fetchServer = () => {
  hello.value = 'loading...'
  get('/api/hello')
    .then(function (data) {
      hello.value = data
    })
    .catch((e) => {
      hello.value = 'error'
    })
}

const changeProxyStatus = (isProxy) => {
  proxyConfig.setProxy(isProxy)
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
