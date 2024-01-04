function proxyConfigWrapper(proxyStorageKey) {
  let isProxy = ''
  return {
    setProxy(value) {
      window.localStorage.setItem(proxyStorageKey, value)
      isProxy = value
    },
    getProxy() {
      return isProxy !== ''
        ? isProxy
        : (isProxy = window.localStorage.getItem(proxyStorageKey) === 'true' ? true : false)
    }
  }
}

export default proxyConfigWrapper('isProxy')
