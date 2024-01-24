export default (prefix: string) => (pathname: string) => {
  return !(pathname === '/' || pathname.startsWith(`/${prefix}`))
}
