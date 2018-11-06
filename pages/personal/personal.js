const utils = require('../../utils/util.js')
const config = getApp().globalData.config
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auth: {},
    userInfo: {},
    thirduid: '',
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
  getMultiUser(ids) {
    const url = `${config.lccroApiMsRequestUrl}/get_multi_user`
    const auth = this.data.auth
    wx.request({
      url,
      data: {
        uid:auth.userId,
        src: 'web',
        uid: auth.userId,
        token: auth.token,
        ids,
        cols: 'objectId|username|avatar_large|avatarLarge|role|company|jobTitle|self_description|selfDescription|blogAddress|isUnitedAuthor|isAuthor|authData|totalHotIndex|postedEntriesCount|postedPostsCount|collectedEntriesCount|likedPinCount|collectionSetCount|subscribedTagsCount|followeesCount|followersCount|pinCount',
      },
      success: (res) => {
        let data = res.data
        if (data.s === 1) {
          this.setData({
            userInfo: data.d && data.d[ids]
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
  onLoad: function (query) {
    console.log(query)
    let auth = utils.ifLogined();
    this.setData({
      auth,
    })
    if (query && query.thirduid) {
      let thirduid = query.thirduid
      this.setData({
        thirduid
      })
      this.getMultiUser(thirduid)
    } else {
      this.getUserInfo()
    }
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