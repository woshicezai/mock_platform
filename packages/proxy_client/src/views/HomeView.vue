<template>
  <div class="full-screen">
    <el-row>
      <el-col :span="16">
        <div>
          <div>请求地址</div>
        </div>
        <el-row>
          <VirtualList
            ref="virtualList"
            :data-key="'url'"
            :data-sources="dataSourcesRef"
            :estimate-size="73"
            containerClass="list-dynamic"
          >
            <template #="{ source }">
              <el-row class="item-inner" :style="{ height: source.size + 'px' }">
                <el-col :span="16" @click="selectItem(source)">{{ source.url }}</el-col>
                <el-col :span="4">
                  <el-switch
                    :disabled="false"
                    v-model="source.isProxy"
                    class="ml-2"
                    inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    active-text="开启代理"
                    inactive-text="关闭代理"
                    @change="toggleProxyStatus(source)"
                  />
                </el-col>
                <div></div>
              </el-row>
            </template>
          </VirtualList>
        </el-row>
      </el-col>
      <el-col :span="8">
        <div>
          <div>请求数据</div>
        </div>
        <div id="jsoneditor" style="width: 100%; height: 400px"></div>
      </el-col>
    </el-row>
    <el-row> </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { ElNotification } from 'element-plus'
// import VirtualList from 'vue-virtual-list-v3'
import type { TProxyInfo } from 'commonTypes/socket'
import { saveProxyInfo, delProxyInfo } from '@/api/index'
import SocketClient from 'utils/request/socketClient'
import JSONEditor from 'utils/jsonEditor'

let jsonEditor: JSONEditor | null = null

//代理服务器返回来的数据
const dataSourcesRef = ref<TProxyInfo[]>([])

onMounted(async () => {
  jsonEditor = new JSONEditor('jsoneditor')
  //与代理服务器建立监听socket，实时获取客户端发到代理服务器的数据
  const socketClient = new SocketClient()
  socketClient.listen('data', receiptDataFromProxyServer)
})

/**
 * 切换代理请求 是否开启代理的状态
 */
const toggleProxyStatus = async (row: TProxyInfo) => {
  row.data = getJSONEditorValue()
  saveProxyInfo(row)
  /*  if (row.isProxy) {
    await saveProxyInfo(row)
  } else {
    await delProxyInfo(row)
  } */
}

const edit = async (info: TProxyInfo) => {
  info.editable = true
  jsonEditor?.editModal(true)
  setJSONEditorValue(info)
}

const save = async (info: TProxyInfo) => {
  info.data = getJSONEditorValue()
  const res = await saveProxyInfo(info)
  jsonEditor?.editModal(false)
  info.editable = false
}

const del = async (info: TProxyInfo) => {
  const res = await delProxyInfo(info)
  console.log('delete', res)
}

/**
 * 将请求返回的数据设置在json编辑器上
 * @param info
 */
const setJSONEditorValue = (info: TProxyInfo) => {
  jsonEditor?.editModal(true)
  jsonEditor?.setValue(info.data)
}

/**
 * 获取json编辑器的内容
 */
const getJSONEditorValue = () => {
  return jsonEditor?.getValue<TProxyInfo['data']>()
}

/**
 * 接收代理服务器返回的数据
 * @param data
 */
const receiptDataFromProxyServer = (data: TProxyInfo[]) => {
  console.log('receiptDataFromProxyServer', data)
  const result = data[0]
  const rowData = {
    ...result,
    title: '返回来的数据'
  }
  dataSourcesRef.value = dataSourcesRef.value.concat(rowData)
}

/**
 * 单击一条请求记录
 */
const selectItem = (row: TProxyInfo) => {
  console.log('selectItem', row)
  setJSONEditorValue(row)
}
</script>

<style lang="scss" scoped>
.full-screen {
  width: 100%;
  height: 100%;
  padding: 10px;
}

.list-dynamic {
  width: 100%;
  height: 500px;
  overflow-y: auto;
  .list-item-dynamic {
    display: flex;
    align-items: center;
    padding: 1em;
    border-bottom: 1px solid;
    border-color: lightgray;
    background: rgba(83, 132, 255, 0.06) none repeat scroll 0% 0%;
    border-bottom: 2px solid rgb(255, 255, 255);
  }
}
.item-inner {
  height: 40px;
  align-items: center;
  display: flex;
  align-items: center;
  border-bottom: 1px solid lightgray;
  cursor: pointer;
}
</style>
