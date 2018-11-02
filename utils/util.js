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
  console.log(auth);
  if (auth.token && auth.userId) {
    return auth;
  }
  return false;
}

let isEmptyObject = (obj) => {
  for(let i in obj){
    console.log(obj[i])
    return false;  //如果对象不为空，返回false
  }
  return true;  // 默认返回 true
}
let pageReload = (scopeAuth,dataList) => {
  let auth = ifLogined();
  let dataEmpty = (list) => {
    let empty = false;
    let item = null;
    for(let i=0;i<list.length;i++){
      item = list[i];
      if(isEmptyObject(item)){
        empty = true;
        break;
      }
    }
    return empty
  }
  if((auth.token !== scopeAuth.token || auth.userId !== scopeAuth.userId) || dataEmpty(dataList)){
    return true
  }
}

module.exports = {
  formatTime: formatTime,
  ifLogined: ifLogined,
  isEmptyObject: isEmptyObject,
  pageReload: pageReload
}
