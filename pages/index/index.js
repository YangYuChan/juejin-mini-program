//index.js
//获取应用实例
const app = getApp()
const config = getApp().globalData.config
const utils = require('../../utils/util.js') //公共接口
Page({

  /**
   * 页面的初始数据
   */
  data: {
    COUNT:20,
    auth:{},
    logined:true, //是否显示去登录
    hotRecommendShow:true,  //是否显示热门推荐
    hotRecomment:[], //热门推荐显示三条数据

  },
  //初始化
  init(){
    let auth = utils.ifLogined();  //返回true/false
    this.setData({
      auth,  //login里面保存的登录用户信息token、userId、clientId
      logined: auth 
    });
    if (auth) { //如果已经登录
      this.getEntryByHotRecomment();  //显示热门推荐
    }
  },
  //热门推荐
  getEntryByHotRecomment() {
    const auth = this.data.auth; //获取 auth的用户信息
    let url = `${config.timelineRequestUrl}/get_entry_by_hot_recomment`;
    
    wx.request({
      url: url,
      data:{
          src: 'web',
          uid: auth.userId || '',
          device_id: auth.clientId || '',
          client_id: auth.clientId || '',
          token: auth.token || '',
          limit: this.data.COUNT
      },
      success: (res) => {
        let data = res.data;
        if(data.s === 1){
          let entrylist = (data.d && data.d.entry && data.d.entry.entrylist) || [];
          this.setData({
            hotRecomment: entrylist.slice(0,3)
          })
          if (!utils.isEmptyObject(entrylist)){
            if(!this.data.hotRecommendShow){
              this.setData({
                hotRecommendShow:true
              })
            }
          } else {
            if(this.data.hotRecommendShow){
              this.setData({
                hotRecommendShow: false
              })
            }
          }
        } else {
          wx.showToast({
            title: data.m.toString(),
            icon:'none'
          })
        }
      },
      fail: (error) => {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      }
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
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
    this.init();
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