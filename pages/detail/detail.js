const ajax = require('../../utils/ajax')
const utils = require('../../utils/util')

let imgUrls = []
let detailImg = []
let goodsId = null
let goods = null

Page({
  data: {
    isLike: true,
    showDialog: false,
    goods: null,
    indicatorDots: true, // 是否显示面板指示点
    autoplay: true,
    interval: 3000,
    duration: 1000,
  },
  previewImage: function (e) {
    let current = e.target.dataset.src
    console.log(e)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imgUrls
    })
  },
  onLoad: function (options) {
    goodsId = options.goodsId
    this.goodsInfoShow()
  },
  goodsInfoShow: function () {
    const _this = this
    ajax.request({
      url: 'goods/getGoodsInfo?key=' + utils.key + '&goodsId=' + goodsId,
      method: 'get',
      success: data => {
        let goodsItem = data.result

        for (let i = 0; i < goodsItem.shopGoodsImageList.length; i++) {
          imgUrls[i] = goodsItem.shopGoodsImageList[i].imgUrl
        }

        detailImg = goodsItem.details.split(';')

        goods = {
          imgUrls: imgUrls,
          title: goodsItem.name,
          price: goodsItem.price,
          privilegePrice: goodsItem.privilegePrice,
          detailImg: detailImg,
          imgUrl: goodsItem.imgUrl,
          buyRate: goodsItem.buyRate,
          goodsId: goodsId,
          count: 1,
          totalMoney: goodsItem.price
        }

        _this.setData({
          goods: goods
        })
      }
    })
  },
  addLike: function () {
    this.setData({
      isLike: !this.data.isLike
    })
    ajax.request({
      url: 'collection/addShopCollection?key=' + utils.key + '&goodsId=' + goodsId,
      method: 'get',
      success: data => {
        console.log('收藏返回结果' + data.message)
        wx.showToast({
          title: data.message,
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  // 立即购买
  immeBuy: function () {
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      duration: 2000
    })
  },
  // sku 弹出
  toggleDialog: function () {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  // sku 关闭
  closeDialog: function () {
    this.setData({
      showDialog: false
    })
  },
  // 加入购物车
  addCar: function () {
    let count = this.data.goods.count
    ajax.request({
      method: 'get',
      url: 'carts/addShopCarts?key=' + utils.key + '&goodsId=' + goodsId + '&num=' + count,
      success: data => {
        console.log('加入购物车返回结果：' + data.message)
        wx.showToast({
          title: data.message,
          icon: 'success',
          duration: 2000
        })
        this.closeDialog()
      }
    })
  },
  // 减数
  delCount: function (e) {
    console.log('购物车数量 - 1')
    let count = this.data.goods.count

    if (count > 1) {
      this.data.goods.count--
    }

    // 将数值与状态写回
    this.setData({
      goods: this.data.goods
    })

    this.priceCount()
  },
  // 加数
  addCount: function () {
    console.log('购物车数量 + 1')
    let count = this.data.goods.count

    if (count < 10) {
      this.data.goods.count++
    }

    this.setData({
      goods: this.data.goods
    })

    this.priceCount()
  },
  // 价格计算
  priceCount: function () {
    this.data.goods.totalMoney = this.data.goods.price * this.data.goods.count
    this.setData({
      goods: this.data.goods
    })
  }
})