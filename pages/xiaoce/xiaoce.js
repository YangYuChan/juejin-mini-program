const config = getApp().globalData.config
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xiaoceList: [],
    noResult:false,
    auth:{},
    pageNum:1
  },
  init() {
    wx.showLoading({
      title: '数据加载中',
    })
    let auth = utils.ifLogined();
    this.setData({
      auth,
    })
    this.getXiaoCe(true)
  },
  getXiaoCe(reload) {
    let auth = this.data.auth
    let url = `${config.xiaoceRequestUrl}/getListByLastTime`
    wx.request({
      url,
      data: {
        src: 'web',
        uid: auth.userId || '',
        device_id: auth.clientId,
        token: auth.token,
        pageNum: this.data.pageNum
      },
      success: (res) => {
        let data = res.data
        if(data.s === 1) { //说明对象不为空
          wx.hideLoading()
          let list = data.d //有数据
          // if(!utils.isEmptyObject(list) || reload){ //因为接口已经做了是否为空的判断，所以其实这个地方做判断也没什么意义
            let pageNum = this.data.pageNum + 1
            this.setData({
              pageNum,
              xiaoceList: reload ? list : this.data.xiaoceList.concat(list)
            })
          // }
        } else {
          if(data.s === 2) { //返回对象为空
            this.setData({
              noResult:true
            })
          } else {
            wx.showToast({
              title: data.m.toString(),
              icon: 'none'
            })
          }
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
    this.init();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   this.setData({
  //     noResult: false,
  //     auth: {},
  //     pageNum: 1
  //   })
  //   this.init()
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.xiaoceList.length || !this.data.noResult) {
      this.getXiaoCe();
    }
  },
})