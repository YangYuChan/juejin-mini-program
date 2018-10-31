const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 判断是否登录
let ifLogined = () => {
  let auth = wx.getStorageSync('auth') || {}
  if (auth.token && auth.userId) {
    return auth;
  }
  return false;
}

let isEmptyObject = (obj) => {
  for(let i in obj){
    return false;
  }
  return true;
}
module.exports = {
  formatTime: formatTime,
  ifLogined: ifLogined,
  isEmptyObject: isEmptyObject
}
