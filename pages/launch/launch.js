const utils = require('../../utils/util.js')
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let timer = setTimeout(()=> {
        clearTimeout(timer);
        this.direct();
    },2000);
  },
  direct() {
    let auth = utils.ifLogined();
    let url = '/pages/index/index';
    if(auth) {
      let url = '/pages/index/index';
    }
    wx.switchTab({
      url,
    })
  }
})