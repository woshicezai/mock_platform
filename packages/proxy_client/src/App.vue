<template>
  <div class="full-screen">
    <el-row>
      <el-col :span="24"> <button @click="insertDB">插入数据库</button></el-col>
    </el-row>
    <el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="title" label="mock名称" width="200">
          <template #default="scope">
            <span v-if="!scope.row.editable">{{ scope.row.title }}</span>
            <el-input v-else v-model="scope.row.title" />
          </template>
        </el-table-column>
        <el-table-column prop="url" label="url" width="300">
          <template #default="scope">
            <span v-if="!scope.row.editable">{{ scope.row.url }}</span>
            <el-input v-else v-model="scope.row.url" />
          </template>
        </el-table-column>
        <el-table-column prop="data" label="数据" width="300">
          <template #default="scope">
            <vue-json-pretty v-model:data="scope.row.data" :editable="scope.row.editable" />
          </template>
        </el-table-column>
        <el-table-column prop="isProxy" label="是否代理" width="120">
          <template #default="scope">
            <el-switch
              :disabled="!scope.row.editable"
              v-model="scope.row.isProxy"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-text="开启代理"
              inactive-text="关闭代理"
              @change="changeProxyStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="edit(scope.row)">
              编辑
            </el-button>
            <el-button link type="primary" size="small" @click.prevent="save(scope.row)">
              保存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import type { TProxyInfo } from 'types/proxyInfo'
import { getProxyInfoList, saveProxyInfo } from '@/api/index'

const tableData = ref<TProxyInfo[]>([])

onMounted(async () => {
  const list = await getProxyInfoList()
  tableData.value = list
})

const changeProxyStatus = async (row: TProxyInfo) => {
  console.log('changeProxyStatus', row.isProxy)
}
const insertDB = async () => {}

const edit = async (info: TProxyInfo) => {
  info.editable = true
}
const save = async (info: TProxyInfo) => {
  const res = await saveProxyInfo(info)
  console.log('save', res)
  info.editable = false
}
</script>

<style lang="scss" scoped>
.full-screen {
  width: 100%;
  height: 100%;
}
</style>
