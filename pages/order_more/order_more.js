import GMAPI from "../../utils/api";

var app = getApp();
Page({
  data: {
    order_id:'',
      order_D:'',
      wxURL:'',
    more:[],
      refund_Bool:false,
      goods_Bool:false,
      note:'',
      cause:'',
      date:''

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
                cause:data.order,
                date:GMAPI.formatTime(data.order.log_time*1000,'Y-M-D'),
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
    //收货
    confirmReceipt:function (e) {
        var that=this;
        GMAPI.doSendMsg('api/Order/order_shouhuo',{uid:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_D.order_id},'POST',that.onMsgCallBack_Receipt);
    },
    onMsgCallBack_Receipt:function (jsonBack){
      let that=this;
        var data=jsonBack.data;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            GMAPI.doSendMsg('api/Order/order_detail',{uid:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id},'POST',that.onMsgCallBack_Order_D);
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    //支付
    orderPay:function (e) {
        var that=this;
        GMAPI.doSendMsg('api/Order/order_pay',{uid:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_D.order_id},'POST',that.onMsgCallBack_OrderPay);
    },
    onMsgCallBack_OrderPay:function (jsonBack){
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

                    }else{
                    }
                },
                'fail':function(res){

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
    },
    //    申请退款
    bindTextAreaBlur:function(e){
        this.setData({
            note:e.detail.value
        })
    },
    onRefundBox:function(e){
        this.setData({
            refund_Bool:true,
            order_id:e.currentTarget.dataset.id
        })
    },
    sh_Refund:function (){
        var that=this;
        if(that.data.note==''){
            wx.showToast({
                title: '退款原因不能为空',
                icon: 'none',
                duration: 2000
            });
        }else{
            GMAPI.doSendMsg('api/Order/refund',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id,note:that.data.note},'POST',that.onMsgCallBack_OrderRefund);
        }

    },
    onMsgCallBack_OrderRefund:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        this.setData({
            refund_Bool:false
        });
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            this.setData({
                goods:[]
            });
            GMAPI.doSendMsg('api/Order/order_detail',{uid:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id},'POST',that.onMsgCallBack_Order_D);
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    //    申请退huo
    onGoodsBox:function(e){
        this.setData({
            goods_Bool:true,
            order_id:e.currentTarget.dataset.id
        })
    },
    submit_Goods:function (e){
        var order_id = e.currentTarget.dataset.id;
        var that=this;

        if(e.detail.value.wl_name==''){
            wx.showToast({
                title: '物流公司名称不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.order_numb==''){
            wx.showToast({
                title: '订单号不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.nont==''){
            wx.showToast({
                title: '退货原因不能为空',
                icon: 'none',
                duration: 2000
            });
        }else{
            GMAPI.doSendMsg('api/Order/refundAndGood',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id,wuliu_number:e.detail.value.order_numb,note:e.detail.value.nont,wuliu_name:e.detail.value.wl_name},'POST',that.onMsgCallBack_RunGoods);
        }
    },
    onMsgCallBack_RunGoods:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        this.setData({
            goods_Bool:false
        });
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            this.setData({
                goods:[]
            });
            GMAPI.doSendMsg('api/Order/order_detail',{uid:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id},'POST',that.onMsgCallBack_Order_D);
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    popClose:function (){
        this.setData({
            refund_Bool:false,
            goods_Bool:false
        })
    }
});