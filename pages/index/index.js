//index.js
//获取应用实例
const app = getApp()
const config = getApp().globalData.config
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBar: ["关注", "推荐", "热榜"],
    recommendList:[],
    limit:7,
    scrollTop:0
  },
  getRecommendList(){
    wx.request({
      url: `${config.apiRecommendUrl}/feed/topstory/recommend`,
      data: {
        session_token: '6084305591904000c9c9ff318ca8d245',
        desktop:true,
        limit: 7,
        action: 'down',
        after_id: 5
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        let data = res.data
        this.setData({
          recommendList: (data.data) || [],
        })
      },
      fail:() => {
        wx.showToast({
          title: '网络开小差，请稍后再试',
          icon:'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(111)
    this.getRecommendList();
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