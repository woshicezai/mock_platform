<template>
  <div class="full-screen">
    <el-row>
      <el-col :span="24"> <el-button @click="insertDB">添加</el-button></el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-row>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="title" label="mock名称" width="200">
              <template #default="scope">
                <span v-if="!scope.row.editable">{{ scope.row.title }}</span>
                <el-input v-else v-model="scope.row.title" />
              </template>
            </el-table-column>
            <el-table-column prop="url" label="url" width="200">
              <template #default="scope">
                <span v-if="!scope.row.editable">{{ scope.row.url }}</span>
                <el-input v-else v-model="scope.row.url" />
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
            <el-table-column fixed="right" label="Operations" width="200">
              <template #default="scope">
                <el-button type="primary" size="small" @click.prevent="edit(scope.row)">
                  编辑
                </el-button>
                <el-button type="primary" size="small" @click.prevent="save(scope.row)">
                  保存
                </el-button>
                <el-button type="primary" size="small" @click.prevent="del(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
      <el-col :span="8">
        <div id="jsoneditor" style="width: 100%; height: 400px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElNotification } from 'element-plus'
import type { TProxyInfo } from 'types/proxyInfo'
import { getProxyInfoList, saveProxyInfo, delProxyInfo } from '@/api/index'
import JSONEditor from 'utils/jsonEditor'
// import beautify from 'js-beautify'

const tableData = ref<TProxyInfo[]>([])
let jsonEditor: JSONEditor | null = null

onMounted(async () => {
  //获取所有代理配置
  const list = await getProxyInfoList()
  tableData.value = list

  jsonEditor = new JSONEditor('jsoneditor')
})

const changeProxyStatus = async (row: TProxyInfo) => {
  console.log('changeProxyStatus', row.isProxy)
}

const insertDB = async () => {
  tableData.value.push({
    title: '',
    data: {},
    url: '',
    isProxy: true,
    editable: true
  })
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
  // fomatEditorValue(jsonEditorRef.value)
}

/**
 * 获取json编辑器的内容
 */
const getJSONEditorValue = () => {
  return jsonEditor?.getValue<TProxyInfo['data']>()
}
/**
 * 格式化json编辑器的内容
 * @param editor
const fomatEditorValue = (editor: AceAjax.Editor | null) => {
  if (!editor) return
  const session = editor.getSession()
  const content = session.getValue()
  // 对 JSON 进行格式化，确保内容是 JSON，否则会抛出错误
  try {
    const formattedContent = beautify.js(content, {
      indent_size: 2,
      space_in_empty_paren: true
      // 其他的 js-beautify 选项
    })
    session.setValue(formattedContent)
  } catch (error) {
    ElNotification({
      title: 'Error formatting content',
      message: (error as Error).message,
      type: 'error'
    })
  }
}
 */
</script>

<style lang="scss" scoped>
.full-screen {
  width: 100%;
  height: 100%;
  padding: 10px;
}
</style>
