const config = getApp().globalData.config
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auth:{},
    postInfo:{},
    t:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    console.log(query) //{postId:"5bdec8dce51d454a1b58bcb1",type:"post"}
    const auth = utils.ifLogined();
      this.setData({
        auth,
      })
    let t = query.type;
    let id = query.id;
    this.setData({
      t,
    })
    if(t === 'post') {
      this.getDetails(id, 2);
    }
  },
  getDetails(postId,t) {
    const auth = this.data.auth;
    const url = `${config.postStorageApiMsRequestUrl}/getDetailData`
    wx.request({
      url,
      data:{
        uid: auth.userId,
        device_id: auth.clientId,
        token: auth.token,
        src: 'web',
        type: t === 1 ? 'entryView' : 'entry',
        postId,
      },
      success: (res) => {
        let data = res.data;
        if(data.s === 1) {
          if( t === 1){
            let article = (data.d && data.d.content) || ''
            
          } else {
            this.setData({
              postInfo: data.d || {}
            })
            wx.setNavigationBarTitle({
              title: (data.d && data.d.user && data.d.user.username) || '掘金'
            })
          }
        } else {
          wx.showToast({
            title: data.m.toString(),
            icon: 'none'
          })
        }
      },
      fail: () =>{
        wx.showToast({
          title: '网络出错，请稍后再试',
          icon: 'none'
        })
      }
    })
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
