import GMAPI from "../../utils/api";

var app = getApp();
Page({
  data: {

    menuTapCurrent: 0,

    all_Order: [],
    wxURL: [],
    sell: [],
    sella: [{ img: "../../img/gouwu.png", name: "免费测体重机", time: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", state: "待付款", price: "1899", numbers:"1", typeId: 0 },
      { img: "../../img/gouwu.png", name: "免费测体重机", time: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", state: "待发货", price: "1899", numbers: "1", typeId: 1 },
      { img: "../../img/gouwu.png", name: "免费测体重机", time: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", state: "确认收货", price: "1899", numbers: "1", typeId: 2 }],
    sellb: [{ img: "../../img/gouwu.png", name: "免费测体重机", time: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", state: "待付款", price: "1899", numbers: "1", typeId: 0 }],

    sellc: [{ img: "../../img/gouwu.png", name: "免费测体重机", time: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", state: "待发货", price: "1899", numbers: "1", typeId: 0 },
      { img: "../../img/gouwu.png", name: "免费测体重机", time: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", state: "待发货", price: "1899", numbers: "1", typeId: 1 }],

    selld: [{ img: "../../img/gouwu.png", name: "免费测体重机", time: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", state: "确认收货", price: "1899", numbers: "1", typeId: 0 },
      { img: "../../img/gouwu.png", name: "免费测体重机", price: "95", time: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", state: "确认收货", price: "1899", numbers: "1", typeId: 1 }],
  },

  swichNav: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current
    });
      GMAPI.doSendMsg('api/Order/order_list',{uid:wx.getStorageSync('strWXID').strUserID,status:current},'POST',that.onMsgCallBack_Order);
  },
    onLoad:function(){

    },
    onShow:function(){
        var that=this;
        GMAPI.doSendMsg('api/Order/order_list',{uid:wx.getStorageSync('strWXID').strUserID,status:that.data.menuTapCurrent},'POST',that.onMsgCallBack_Order);
    },
    onMsgCallBack_Order:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            var list=data.data;
            var goods=[];
            for(var i=0;i<list.length;i++){
                goods.push(list[i]);
            }
          this.setData({
              all_Order:goods,
              wxURL:data.url
          });

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
})