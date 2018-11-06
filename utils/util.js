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
let navigatItem = (e) => {
  const url = e.currentTarget.dataset.url || '/pages/index/index'
  const open = e.currentTarget.dataset.open
  const toUrl = () => {
    wx.navigateTo({
      url,
    })
  }
  if(open){
    toUrl()
  } else {
    if(ifLogined){
      toUrl()
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  }
}

let isEmptyObject = (obj) => {
  for(let i in obj){
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

var GetUrlRelativePath = function (url) {
  var arrUrl = url.split('//');
  var start = arrUrl[1].indexOf('/') + 1;
  var relUrl = arrUrl[1].substring(start);
  if(relUrl.indexOf('?') != -1){
    relUrl = relUrl.split('?')[0]
  }
  console.log('relUrl' + relUrl)
  return relUrl;
}

var getPostIdByOriginalUrl = function (url) {
  return GetUrlRelativePath(url).split('/').slice(-1)[0]
}

let toPostDetail = (e) => {
  let item = e.currentTarget.dataset.item
  let postId = getPostIdByOriginalUrl(item.originalUrl)
  let entryId = item.objectId
  let t = item.type
  let id = t === 'post' ? postId : entryId
  let url = `/pages/postDetails/postDetails?id=${id}&type=${t}`
  wx.navigateTo({
    url,
  })
}

module.exports = {
  formatTime: formatTime,
  ifLogined: ifLogined,
  isEmptyObject: isEmptyObject,
  pageReload: pageReload,
  getPostIdByOriginalUrl: getPostIdByOriginalUrl,
  toPostDetail: toPostDetail,
  navigatItem: navigatItem,
}
