const config = getApp().globalData.config
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auth: {},
    userInfo:{},
    userNotificationNum:0
  },
  init() {
    let auth = utils.ifLogined();
    this.setData({
      auth,
    })
    if(auth){
      this.getUserInfo();
      this.userNotificationNum();
    } else {
      this.setData({
        auth: {},
        userNotificationNum: 0
      })
    }
  },
  getUserInfo() {
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
          if(data.s === 1){
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
  userNotificationNum(){
    const url = `${config.notifyRequestUrl}/getUserNotificationNum`
    const auth = this.data.auth
    wx.request({
      url,
      data: {
        src: 'web',
        uid: auth.userId,
        token: auth.token,
      },
      success: (res) => {
        let data = res.data
        if (data.s === 1) {
          this.setData({
            userNotificationNum: data.d && data.d.notification_num
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})