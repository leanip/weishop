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
  }
})