const utils = require('../../utils/util.js')
const config = getApp().globalData.config
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight:"auto",
    bannerImgList: [],
    rankList: [],
    COUNT: 20,
    auth: {}
  },
  init (){
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({
      auth: {},
    })
    let auth = utils.ifLogined();
    this.setData({
      auth,
    })
    this.initSwiper();
    this.getBannerImgList();
    this.getRankList(true);

  },
  getBannerImgList() {
    wx.getStorage({
      key: 'bannerImgList',
      success: (res) => {
          this.setData({
            bannerImgList: res.data || []
          })
      },
      fail:() => {
        this.setData({
          bannerImgList:[]
        })
      }
    })
  },
  getRankList(reload) {
    const auth = this.data.auth;
    let rankList = this.data.rankList;
    let url = `${config.timelineRequestUrl}/get_entry_by_rank`;
    if (utils.isEmptyObject(rankList) || reload) {
      rankList = [{rankIndex:''}]
    }
    let rankIndex = (rankList.slice(-1)[0].rankIndex) || '';
    wx.request({
      url,
      data:{ 
        src: 'web',
        uid: auth.userId || 'unlogin',
        device_id: auth.clientId,
        token: auth.token ||'',
        limit: this.data.COUNT,
        before: rankIndex,
      },
      success: (res) => {
        let data = res.data;
        if(data.s === 1){
          wx.hideLoading()
          let entrylist = (data.d && data.d.entrylist) || []
          this.setData({
            rankList: reload ? entrylist : this.data.rankList.concat(entrylist)
          })
          console.log(rankList)
        } else {
          wx.showToast({
            title: data.m.toString(),
            icon:'none'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络出错，请稍后再试',
          icon:'none'
        })
      }
    })
  },
  onShow (){
    if(utils.pageReload(this.data.auth,[this.data.rankList])){
      this.init();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.init();
  },
  initSwiper(){
    wx.getSystemInfo({
      success:(res) => {
        this.setData({
          swiperHeight: `${(res.windowWidth || res.screenWidth) / 108 * 36}px`
        })
      }
    })
  },
  onReachBottom() {
    this.getRankList();
  },
})