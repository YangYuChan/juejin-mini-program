const config = getApp().globalData.config
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  //登录提交验证
  commit(e){
    var values = e.detail.value;
    var phoneNumber = values.phoneNumber || '';
    var password = values.password || '';
    if (!phoneNumber.replace(/\s+/g, '')) { // phone.replace(/\s+/g,'') 用''替换所有空格
      wx.showToast({
        title: '请输入账号',
        icon:'none'
      })
      return false;
    }
    if(!password.replace(/\s+/g,'')){
      wx.showToast({
        title: '请输入密码',
        icon:'none'
      })
      return false;
    }
    if (phoneNumber.indexOf('@') !== -1){ //包含@符号
      let params = {
        email: values.phoneNumber,
        password: values.password
      }
      this.login(params, 2);
    } else {
      this.login(values,1);
    }
  },
  /**
   * 登录
   */
  login(params,types){
    wx.showLoading({
      title: '加载中...',
    })
    let url = (types === 1 ? config.loginRequestUrlByMobile : config.loginRequestUrlByEMail);
    wx.request({
      url: url,
      method:'POST',
      data:params,
      success:function(res){
        console.log(res.statusCode);
        if (res.statusCode === 401){
          wx.showToast({
            title: '密码错误',
            icon: 'none'
          })
          return false;
        } else if(res.statusCode === 404) {
            wx.showToast({
              title: '用户不存在',
              icon: 'none'
            })
          return false;
        } else if (res.statusCode !== 200) {
          wx.showToast({
            title: '未知错误',
            icon: 'none'
          })
        }

        let data = res.data;
        if (!utils.isEmptyObject(data)){
          wx.showToast({
            title: '已登录',
            icon: 'none',
          });
          wx.setStorage({   //将数据存储在本地缓存中指定的 key 中
            key: 'auth',
            data: {
              'token':data.token,
              'userId': data.userId,
              'clientId': data.clientId
            },
          });
          wx.navigateBack({
            delta:1
          }) //关闭当前页，返回上一页
        } else {
          wx.showToast({
            title: '发生错误，请稍微再试',
            icon: 'none'
          })
        }
      },
      fail:function(error){
        wx.showToast({
          title: '网络错误，请稍微再试',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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