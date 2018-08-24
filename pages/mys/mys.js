//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code_ids: "FYf1582610",

    my_lists:[
      { limg: "../../img/my5.png", text: "分销订单", rimg: "../../img/myr.png", url: "/pages/sale_order/sale_order" },
      { limg: "../../img/my8.png", text: "我的团队", rimg: "../../img/myr.png", url: "/pages/team_superior/team_superior" },
      { limg: "../../img/my10.png", text: "培训", rimg: "../../img/myr.png", url: "/pages/train/train" },
      { limg: "../../img/my11.png", text: "宣传册", rimg: "../../img/myr.png", url: "/pages/publicity/publicity" },
      { limg: "../../img/my6.png", text: "联系客服", rimg: "../../img/myr.png", url: "/pages/contact_service/contact_service" },
    ],
    nav: [
      { img: "../../img/nav.png", url: "/pages/mall/mall", text: "商城", on: false },
      { img: "../../img/nav1.png", url: "/pages/business/business", text: "商家", on: false },
      { img: "../../img/nav2.png", url: "/pages/released/released", text: "发布 ", on: false },
      { img: "../../img/nav3_1.png", url: "/pages/my/my", text: "我的", on: true },
    ],
    row_lists:[
      { price: "￥75.00", text: "累计佣金", },
      { price: "￥75.00", text: "可提现佣金",  },
      { price: "￥7.00", text: "未结算佣金",  },
    ]
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  open_spread: function () { //打开
    this.setData({
      spread_box: true,
    })
  },
  down_spread: function () { //关闭
    this.setData({
      spread_box: false,
    })
  },
  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.code_ids,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },

})
