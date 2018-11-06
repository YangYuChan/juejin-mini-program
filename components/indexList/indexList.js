const utils = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {  //自定义属性名
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toPostDetail(e) {
      utils.toPostDetail(e)
    },
    toPerson(e) {
      let item = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: `/pages/personal/personal?thirduid=${item.user.objectId}`,
      })
    },
  }
})
