
var app = getApp()
Page({
  data: {

    menuTapCurrent: 0,

    sella: [
      { img: "../../img/gouwu.png", name: "免费测体重机", time: "享沃",  price: "1899", numbers:"查看详情>>", typeId: 0 },
      { img: "../../img/gouwu.png", name: "免费测体重机", time: "享沃",  price: "1899", numbers: "查看详情>>", typeId: 1 },
      { img: "../../img/gouwu.png", name: "免费测体重机", time: "享沃",  price: "1899", numbers: "查看详情>>", typeId: 2 }],

    sellb: [{ img: "../../img/gouwu.png", name: "免费测体重机", time: "享沃", price: "1899", numbers: "查看详情>>", typeId: 0 }],

    sellc: [
      { img: "../../img/gouwu.png", name: "免费测体重机", time: "享沃",  price: "1899", numbers: "查看详情>>", typeId: 0 },
      { img: "../../img/gouwu.png", name: "免费测体重机", time: "享沃",  price: "1899", numbers: "查看详情>>", typeId: 1 }],

    selld: [
      { img: "../../img/gouwu.png", name: "免费测体重机", time: "享沃",  price: "1899", numbers: "查看详情>>", typeId: 0 },
      { img: "../../img/gouwu.png", name: "免费测体重机",  time: "享沃",  price: "1899", numbers: "查看详情>>", typeId: 1 }],
  },

  swichNav: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current
    });
  },
})