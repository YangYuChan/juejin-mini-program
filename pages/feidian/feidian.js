const config = getApp().globalData.config
const utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 60,
    auth: {},
    recommendList: [],
    list: [],
    COUNT:30,
    scrollTop:0
  },
  init() {
    this.setData({
      auth: {}
    })
    let auth = utils.ifLogined();
    this.setData({
      auth,
    })    
    this.getHotRecommendList();
    this.pinListRecommend(true);
  },
  //热门推荐列表
  getHotRecommendList() {
    const auth = this.data.auth
    const url = `${config.shortMsgMsRequestUrl}/getHotRecommendList`
    wx.request({
      url,
      data: {
        uid: auth.userId,
        device_id: auth.clientId,
        client_id: auth.clientId,
        token: auth.token,
        src: 'web'
      },
      success: (res) => {
        let data = res.data;
        if(data.s === 1){
          this.setData({
            recommendList: (data.d && data.d.list) || [],
          })
        } else {
          wx.showToast({
            title: data.m.toString(),
            icon: 'none'
          })
        }
      },
      fali: () => {
        wx.showToast({
          title: '网络出错，请稍后再试',
          icon: 'none'
        })
      }
    })
  },
  // 翻页：将最后一条的 verifyCreatedAt 赋值给 before 字段即可
  //列表
  pinListRecommend(reload) {
    const auth = this.data.auth;
    let list = this.data.list;
    const url = `${config.shortMsgMsRequestUrl}/pinList/recommend`;
    if (utils.isEmptyObject(list) || reload){
      list = [{ createdAt:''}]
    }
    let createdAt = (list.slice(-1)[0].createdAt) || ''; //当前页最后一条数据的创建时间
    wx.request({
      url,
      data: {
        uid: auth.userId,
        device_id: auth.clientId,
        token: auth.token,
        src: 'web',
        limit: this.data.COUNT,
        before: createdAt
      },
      success: (res) => {
        let data = res.data;
        if(data.s === 1) {
          wx.hideLoading()
          let list = (data.d && data.d.list) || []
          this.setData({
            list: reload ? list : this.data.list.concat(list)
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
            title: '网络出错，请稍微重试',
            icon: 'none'
          })
      },
      complete: () => {
        wx.stopPullDownRefresh()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.init()
  },

 
  onPullDownRefresh () {
    this.init();
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {
    this.pinListRecommend()
  }
})