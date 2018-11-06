//index.js
//获取应用实例
const app = getApp()
const config = app.globalData.config
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
    timeline:[],
    rotate:'',  //刷新显示动画

  },
  //初始化
  init(){
    wx.showLoading({
      title: '数据加载中',
    })
    let auth = utils.ifLogined();  //返回true/false
    this.setData({
      auth,  //login里面保存的登录用户信息token、userId、clientId
      logined: auth 
    });
    this.getEntryByTimeline(true);
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
  getBannerImgList() {
    const auth = this.data.auth;
    let url = `${config.bannerRequestUrl}/get_banner`;
    wx.request({
      url,
      data: {
        position: 'explore',
        page: 0,
        pageSize: 20,
        platform: 'android',
        device_id: auth.clientId,
        client_id: auth.clientId,
        token: auth.token,
        src: 'android'
      },
      success: (res) => {
        let data = res.data;
        if (data.s === 1) {
          let bannerImgList = (data.d && data.d.banner) || [];
          wx.setStorage({
            key: 'bannerImgList',
            data: bannerImgList,
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
          title: '网络出错，请稍微再试',
          icon: 'none'
        })
      }
    })
  },
  // 翻页：将最后一条的 verifyCreatedAt 赋值给 before 字段即可
  //首页列表
  getEntryByTimeline(reload) {
    const auth = this.data.auth; //获取 auth的用户信息
    let timeline = this.data.timeline
    let url = `${config.timelineRequestUrl}/get_entry_by_timeline`;
    if(utils.isEmptyObject(timeline) || reload){
      timeline = [{ verifyCreatedAt:''}]
    }
    let rankIndex = (timeline.slice(-1)[0].verifyCreatedAt) || ''
    wx.request({
      url: url,
      data: {
        src: 'web',
        uid: auth.userId || '',
        device_id: auth.clientId || '',
        category: 'all',
        recomment: 1,
        before: rankIndex,
        token: auth.token,
        limit: this.data.COUNT
      },
      success: (res) => {
        let data = res.data;
        if (data.s === 1) {
          wx.hideLoading();
          let list = (data.d && data.d.entrylist) || [];
          this.setData({
            timeline: reload ? list : this.data.timeline.concat(list), //判断是否上拉加载更多
          })
        } else {
          wx.showToast({
            title: data.m.toString(),
            icon: 'none'
          })
        }
      },
      fail: (error) => {
        wx.showToast({
          title: '网络出错，请稍后再试',
          icon: 'none',
        })
      },
      complete: () => {
        wx.stopPullDownRefresh();//当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新
      }

    })
  },
  userFilterEntry(ids) {
    const auth = this.data.auth;
    let url = `${config.timelineRequestUrl}/user_filter_entry`;
    
    wx.request({
      url,
      data: {
        src:'web',
        uid:auth.userId,
        device_id:auth.clientId,
        client_id:auth.clientId,
        token:auth.token,
        entryId:ids.join('|'),
      },
      success: (res) => {
        let data = res.data;
        if(data.s === 1){
          this.getEntryByHotRecomment();
        } else {

        }
      },
      fail: (error) => {
        wx.showToast({
          title: '网络出错，请稍微再试',
          icon:'none'
        })
      }
    })
  },
  refreshHot() {
    this.setData({
      rotate: 'rotate'
    });
    let timer = setTimeout(()=>{
      this.setData({
        rotate: ''
      });
      clearTimeout(timer)
    },1000)
    let hotRecomment = this.data.hotRecomment;
    this.userFilterEntry(hotRecomment.map(item => {
      return item.objectId
    }))
  },
  closeHot() {
    this.setData({
      hotRecommendShow: false
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.init();
  },
  /**
   * 页面显示/切入前台时触发
   */
  onShow() {
    if (utils.pageReload(this.data.auth,[this.data.timeline])){
      wx.startPullDownRefresh({}) //触发下拉刷新
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.init();
  },
  /**
   * 监听用户上拉触底事件
   */
  onReachBottom() { 
    this.getEntryByTimeline();
  },

  //查看详情
  goPostDetails(e){
    utils.toPostDetail(e);
  },
})