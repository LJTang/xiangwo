import GMAPI from "../../utils/api";

var app = getApp();
Page({
  data: {
    menuTapCurrent:'',
    all_Order: [],
    wxURL: [],
    orderID:'',
    len_Bool:true
  },

  swichNav: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent:current,
        all_Order:[],
        len_Bool:true
    });
      var that=this;
      // that.data.all_Order=[];
      GMAPI.doSendMsg('api/Order/order_list',{uid:wx.getStorageSync('strWXID').strUserID,status:(current==100?'':current),type:0},'POST',that.onMsgCallBack_Order);
  },
    onLoad:function(option){
        this.setData({
            menuTapCurrent:option.status
        })
    },
    onShow:function(){
        var that=this;
        GMAPI.doSendMsg('api/Order/order_list',{uid:wx.getStorageSync('strWXID').strUserID,status:(that.data.menuTapCurrent==100?'':that.data.menuTapCurrent),type:0},'POST',that.onMsgCallBack_Order);
    },
    onMsgCallBack_Order:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            var list=data.data;
            var goods=[];
            if(list.length>0){
                this.setData({
                    len_Bool:true
                });
            }else{
                this.setData({
                    len_Bool:false
                });
            }
            for(var i=0;i<list.length;i++){
                goods.push(list[i]);
            }

          this.setData({
              all_Order:goods,
              wxURL:data.url
          });

        }else{
            this.setData({
                len_Bool:false
            });
            // wx.showToast({
            //     title:data.msg,
            //     icon:'none',
            //     duration: 2000
            // });
        }
    },
    //收货
    confirmReceipt:function (e) {
        var order_id = e.currentTarget.dataset.id;
        var that=this;
        GMAPI.doSendMsg('api/Order/order_shouhuo',{uid:wx.getStorageSync('strWXID').strUserID,order_id:order_id},'POST',that.onMsgCallBack_Receipt);
    },
    onMsgCallBack_Receipt:function (jsonBack){
        var data=jsonBack.data;
        let that=this;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            this.data.all_Order=[];
            GMAPI.doSendMsg('api/Order/order_list',{uid:wx.getStorageSync('strWXID').strUserID,status:(that.data.menuTapCurrent==100?'':that.data.menuTapCurrent),type:1},'POST',that.onMsgCallBack_Order);
        }else{
            // wx.showToast({
            //     title:data.msg,
            //     icon:'none',
            //     duration: 2000
            // });
        }
    },
    //支付
    orderPay:function (e) {
        var order_id = e.currentTarget.dataset.id;
        var that=this;
        console.log(111)
        GMAPI.doSendMsg('api/Order/order_pay',{uid:wx.getStorageSync('strWXID').strUserID,order_id:order_id},'POST',that.onMsgCallBack_OrderPay);
    },
    onMsgCallBack_OrderPay:function (jsonBack){
      var that=this;
        var data=jsonBack.data;
        if(jsonBack!=''){
            wx.requestPayment({
                'timeStamp': data.timeStamp,
                'nonceStr': data.nonceStr,
                'package':data.package,
                'signType': 'MD5',
                'paySign': data.paySign,
                'success':function(res){
                    if(res.errMsg='requestPayment:ok'){
                        GMAPI.doSendMsg('api/Order/order_list',{uid:wx.getStorageSync('strWXID').strUserID,status:(that.data.menuTapCurrent==100?'':that.data.menuTapCurrent),type:0},'POST',that.onMsgCallBack_Order);
                    }else{
                    }
                },
                'fail':function(res){
                    GMAPI.doSendMsg('api/Order/order_list',{uid:wx.getStorageSync('strWXID').strUserID,status:(that.data.menuTapCurrent==100?'':that.data.menuTapCurrent),type:0},'POST',that.onMsgCallBack_Order);
                },
                'complete':function(res){
                }
            });
        }else{
            wx.showToast({
                title:'请联系客服人员',
                icon:'none',
                duration: 2000
            });
        }
    }
});