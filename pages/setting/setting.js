const config = getApp().globalData.config
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auth:{},
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let auth = utils.ifLogined();
    this.setData({
      auth,
    })
    if(auth){
      this.getUserInfo();
    } else {
      this.setData({
        auth:{},
      })
    }
  },
 getUserInfo(){
   const url = `${config.apiRequestUrl}/getUserInfo`
   const auth = this.data.auth
   wx.request({
     url,
     data: {
       src: 'web',
       device_id: auth.clientId,
       uid: auth.userId,
       token: auth.token,
       current_uid: auth.userId
     },
     success: (res) => {
       let data = res.data
       if (data.s === 1) {
         this.setData({
           userInfo: data.d
         })
       } else {
         wx.showToast({
           title: data.m.toString(),
           icon: 'none'
         })
       }
     },
     fail: () => {
       wx.showToast({
         title: '网络出错，请稍后再试',
         icon: 'none'
       })
     }
   })
 },
 signOut(){
   wx.showModal({
     title: '提示',
     content: '确定要退出？',
     confirmColor:'#3281ff',
     cancelColor: '#3281ff',
     success(res) {
       if (res.confirm) {
        wx.removeStorage({
          key: 'auth',
          success: function(res) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          },
        })
       }
     }
   })
 }
})
