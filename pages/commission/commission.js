// pages/commission/commission.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filterdata: {},  //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null,
    time: [
      '全部', "一个月内", "两个月内", "三个月内","半年内"
    ],
    yj_list:[
      {name:"东圃店纸巾机",time:"2018-07-15",price:"78"},
      { name: "东圃店纸巾机", time: "2018-07-07", price: "18" },
      { name: "体育中心店纸巾机", time: "2018-06-16", price: "22" },
      { name: "车陂店纸巾机", time: "2018-05-18", price: "78" },
      { name: "黄村店纸巾机", time: "2018-04-02", price: "56" },
      { name: "越秀区店纸巾机", time: "2018-03-17", price: "88" }
    ]
    // daijin: true,
    // dj_list:[
    //   { img: "../../img/myback.png", price: "￥100", time: "有效期：2018.07.28-07.31", name:"只是一张100元的优惠券只是一张100元的优惠券"},
    //   { img: "../../img/myback.png", price: "￥100", time: "有效期：2018.07.28-07.31",name:"只是一张100元的优惠券" },
    //   { img: "../../img/myback.png", price: "￥100", time: "有效期：2018.07.28-07.31" ,name:"只是一张100元的优惠券"},
    //   { img: "../../img/myback.png", price: "￥100", time: "有效期：2018.07.28-07.31",name:"只是一张100元的优惠券" },
    //   { img: "../../img/myback.png", price: "￥100", time: "有效期：2018.07.28-07.31" ,name:"只是一张100元的优惠券"},
    // ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  setFilterPanel: function (e) { //展开筛选面板
    this.setData({
      showfilter: true
    })
  },
  setCateIndex: function (e) { //选中
    const dataset = e.currentTarget.dataset;
    this.setData({
      cateindex: dataset.cateindex,
      showfilter: false,
    })
  },
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false
    })
  },
  // close: function () { //打开
  //   this.setData({
  //     daijin: false,
  //   })
  // },
})