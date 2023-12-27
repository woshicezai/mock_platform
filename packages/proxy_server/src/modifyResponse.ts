/**
 * 修改返回的响应体
 * TODO: 转换的方式目前过于粗糙
 * @param {*} response
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const modifyResponseToString = (response: any) => {
  const data = JSON.parse(response)
  // 修改响应数据
  return JSON.stringify({
    ...data,
    message: 'dddddd'
  })
}
