const ajax = require('../../utils/ajax')
const utils = require('../../utils/util')

let sectionData = []
let ifLoadmore = null
let page = 1

Page({
  data: {
    navbars: null,
    currentTab: 0,
    banners: null,
    indicatorDots: true, // 是否显示面板指示点
    autoplay: true,      // 是否自动切换
    interval: 3000,      // 切换间隔
    duration: 1000,      // 滑动动画时长
    menus: null,         // 导航菜单
    brands: null,        // 新品特卖
    hidden: false,
  },
  // 监听页面加载
  onLoad: function (options) {
    const _this = this
    _this.navbarShow()
    _this.bannerShow()
    _this.menuShow()
    _this.brandShow()
    _this.newGoodsShow()
  },
  // 导航切换监听
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  navbarShow: function () {
    const _this = this
    ajax.request({
      url: 'home/navBar?key=' + utils.key,
      method: 'get',
      success: data => {
        if (data.code === 100) {
          _this.setData({
            navbars: data.result
          })
        } else {
          console.log(data.message)
        }
      }
    })
  },
  bannerShow: function () {
    const _this = this
    ajax.request({
      url: 'home/banners?key=' + utils.key,
      method: 'get',
      success: data => {
        if (data.code === 100) {
          _this.setData({
            banners: data.result
          })
        } else {
          console.log(data.message)
        }
      }
    })
  },
  menuShow: function () {
    const _this = this
    ajax.request({
      url: 'home/menus?key=' + utils.key,
      method: 'get',
      success: data => {
        if (data.code === 100) {
          this.setData({
            menus: data.result
          })
        } else {
          console.log(data.message)
        }
      }
    })
  },
  brandShow: function () {
    const _this = this
    ajax.request({
      url: 'activity/brands?key=' + utils.key + '&type=temai&page=1&size=5',
      method: 'get',
      success: data => {
        if (data.code === 100) {
          _this.setData({
            brands: data.result.list
          })
        } else {
          console.log(data.message)
        }
      }
    })
  },
  newGoodsShow: function () {
    const _this = this
    ajax.request({
      url: 'goods/getHotGoodsList?key=' + utils.key + '&page=' + page + '&size=10',
      method: 'get',
      success: data => {
        let newGoodsData = data.result.list
        page++
        if (ifLoadmore) {
          // 加载更多
          if (newGoodsData.length > 0) {
            // title 长度处理
            for (let i in newGoodsData) {
              let name = newGoodsData[i].name
              if (name.length > 26) {
                newGoodsData[i].name = name.substring(0, 23) + '...'
              }
            }
            sectionData['newGoods'] = sectionData['newGoods'].concat(newGoodsData)
          } else {
            ifLoadmore = false
            _this.setData({
              hidden: true
            })
            wx.showToast({
              title: '暂无更多内容',
              icon: 'loading',
              duration: 2000
            })
          }
        } else {
          if (ifLoadmore == null) {
            ifLoadmore = true
            for (let i in newGoodsData) {
              let name = newGoodsData[i].name
              if (name.length > 26) {
                newGoodsData[i].name = name.substring(0, 23) + '...'
              }
            }
            sectionData['newGoods'] = newGoodsData
          }
          _this.setData({
            newGoods: sectionData['newGoods'],
          })
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log('上拉')
    const _this = this
    console.log('加载更多')
    if (ifLoadmore != null) {
      _this.newGoodsShow()
    }
  },
  // 点击商品跳转至详情页
  catchTapCategory: function (e) {
    let goodsId = e.currentTarget.dataset.goodsid
    console.log(goodsId)
    this.goodsClickShow(goodsId)
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
  goodsClickShow: function (goodsId) {
    console.log('增加用户点击数量')
    ajax.request({
      url: 'goods/addGoodsClickRate?key=' + utils.key + '&goodsId=' + goodsId,
      method: 'get',
      success: data => {
        console.log('用户点击统计返回结果：' + data.message)
      }
    })
  }
})