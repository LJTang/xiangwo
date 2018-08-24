import GMAPI from "../../utils/api";
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()

Page({
  data: {
    imgUrls: [
      '../../img/banner.png',
      '../../img/banner.png',
      '../../img/banner.png'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgURL: app.data.imgURL,
    wxURL:'',
    details:''
  },
  open_share: function () { //打开
    this.setData({
      share_box: true,
    })
  },
  down_share: function () { //关闭
    this.setData({
      share_box: false,
    })
  },
  

  // 接口 
  onLoad: function (option) {
    var that = this;
    GMAPI.doSendMsg('api/Goods/goods_detail', { id: option.id }, 'POST', that.onMsgCallBack_Details);
  },
  onMsgCallBack_Details: function (jsonBack) {
    console.log(jsonBack)
    var that = this;
    var article = jsonBack.data.data.content;
    WxParse.wxParse('article', 'html', article, that, 5);
    that.setData({
        details: jsonBack.data.data,
        wxURL: jsonBack.data.url
    })
  },
  
});