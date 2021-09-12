// components/spu-group/index.js
Component({
  externalClasses: ['l-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    theme: Object,
    spuList: Array
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(event) {
      const pid = event.currentTarget.dataset['pid']
      wx.navigateTo({
        url: `/pages/detail/detail?pid=${pid}`
      })
    }
  }
})
