import GMAPI from "../../utils/api";

var app = getApp()
Page({
  data: {
    order_id:'',
      order_D:'',
      wxURL:'',
    more:[{
      img:"../../img/sale1.png",
      name:"体重秤",
      price:"1889",
      taset:"待付款",
      height:"1.2米",
      weight:"5kg",
      describe:"免费测量体重机，可放在商城或者大型购物广场内。",
      actual:"￥1899",
    }]
    
  },
    onLoad:function (option) {
      this.setData({
          order_id:option.id
      })
    },
    onShow:function () {
        var that=this;
        GMAPI.doSendMsg('api/Order/order_detail',{uid:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id},'POST',that.onMsgCallBack_Order_D);
    },
    onMsgCallBack_Order_D: function (jsonBack) {
        console.log(jsonBack.data);
        var data=jsonBack.data;
        if(data.code==200){
            var list=data.goods;
            var goods=[];
            for(var i=0;i<list.length;i++){
                goods.push(list[i])
            }
            this.setData({
                order_D:data.data,
                goods:goods,
                wxURL:data.url
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }

    },
})