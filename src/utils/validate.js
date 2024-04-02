/* VIN-номер */
export function validateVinNumber(str) {
  const reg = /^[A-Z0-9]+$/i
  return reg.test(str)
}

export function validateGosNum(str) {
  const reg = /^[авекмнорстху]{1}[0-9]{3}[авекмнорстху]{2}\s[0-9]{2,3}/gi
  return reg.test(str)
}

export function validateEmail(str) {
  const reg =
    /^(([^<>()[\]\\.,;:\s@\\""]+(\.[^<>()[\]\\.,;:\s@\\""]+)*)|("".+""))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(str)
}
