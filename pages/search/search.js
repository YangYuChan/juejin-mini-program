Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight:"auto"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.initSwiper();
  },
  initSwiper(){
    wx.getSystemInfo({
      success:(res) => {
        this.setData({
          swiperHeight: `${(res.windowWidth || res.screenWidth) / 108 * 36}px`
        })
      }
    })
  }
})