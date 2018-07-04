const api = 'https://100boot.cn/wxShop/'
// const api = 'https://www.easy-mock.com/mock/5b3afb7bf8fe91076b33ef02/api/'

const request = opt => {
  wx.request({
    url: api + opt.url,
    method: opt.method || 'GET',
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: opt.data,
    success: function (res) {
      if (res.data.code === 100) {
        if (opt.success) {
          opt.success(res.data)
        }
      } else {
        console.error(res)
        wx.showToast({
          title: res.data.message
        })
      }
    }
  })
}

module.exports.request = request