import GMAPI from "../../utils/api";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carts: [
      { id: 1, title: '体重秤',  image: '../../img/gouwu.png', num: 1, price: 100, },
    ],
    totalPrice:0,
    condition: false,
    provinces: ["要什么100", "100", "100", "100"],
    numb:1,
      goodsID:'',
      data:'',
      wxURL:''
  },

  /**
 * 绑定加数量事件
 */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.numb;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

    count:function(e){
        let num =parseInt(this.data.numb);
        num = num + 1;
        this.setData({
            numb: num,
            totalPrice: num*this.data.data.goods.price
        });
    },
    jian_Count:function(e){
        let num =parseInt(this.data.numb);
        if(num==1){
            num=1;
        }else{
            num = num-1;
        }

        this.setData({
            numb: num,
            totalPrice: num*this.data.data.goods.price
        });
    },
  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i]) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  // 打开优惠券
  open_dj: function (){
    this.setData({
      condition: !this.data.condition
    })
  },
    onLoad:function (option) {
        this.setData({
            numb:option.numb,
            goodsID:option.id
        });
    },
    onShow:function () {
        var that = this;
        GMAPI.doSendMsg('api/Order/order_confirm',{ uid:wx.getStorageSync('strWXID').strUserID,goods_id:that.data.goodsID}, 'POST', that.onMsgCallBack_ConfirmOrder);
    },
    onMsgCallBack_ConfirmOrder: function (jsonBack){
        var that = this;
        var data=jsonBack.data;
        if(data.code==200){
            this.setData({
                data:data.data,
                wxURL:data.url,
                totalPrice:parseInt(that.data.numb)*data.data.goods.price,
            });
        }else{
            wx.showToast({
                title: jsonBack.data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
    //  下单
    placeAnOrder:function(e){
        var that = this;
        console.log(that.data.data.addr=='')
        if(that.data.data.addr==''){
            wx.showToast({
                title: '收货地址不能为空',
                icon: 'none',
                duration:2000
            });
        }else{
            GMAPI.doSendMsg('api/Order/order_add',{ uid:wx.getStorageSync('strWXID').strUserID,goods_id:that.data.goodsID,num:that.data.numb,address_id:that.data.data.addr.id}, 'POST', that.onMsgCallBack_PlaceAnOrder);
        }

    },
    onMsgCallBack_PlaceAnOrder: function (jsonBack){
        var that = this;
        var data=jsonBack.data;
        if(data.code==200){
            GMAPI.doSendMsg('api/Order/order_pay',{uid:wx.getStorageSync('strWXID').strUserID,order_id:data.data.order_id},'POST',that.onMsgCallBack_OrderPay);
        }else{
            wx.showToast({
                title: jsonBack.data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
    //支付
    onMsgCallBack_OrderPay:function (jsonBack){
        var data=jsonBack.data;
        console.log(jsonBack);
        if(jsonBack!=''){
            wx.requestPayment({
                'timeStamp': data.timeStamp,
                'nonceStr': data.nonceStr,
                'package':data.package,
                'signType': 'MD5',
                'paySign': data.paySign,
                'success':function(res){
                    if(res.errMsg='requestPayment:ok'){
                        wx.showToast({
                            title:'支付成功',
                            icon:'none',
                            duration: 2000
                        });
                        setTimeout(function () {
                            wx.reLaunch({
                                url:'/pages/my/my'
                            })
                        },2000)
                    }else{
                        wx.showToast({
                            title:'支付失败',
                            icon:'none',
                            duration: 2000
                        });
                        setTimeout(function () {
                            wx.reLaunch({
                                url:'/pages/my/my'
                            })
                        },2000)
                    }
                },
                'fail':function(res){
                    wx.showToast({
                        title:'支付失败',
                        icon:'none',
                        duration: 2000
                    });
                    setTimeout(function () {
                        wx.reLaunch({
                            url:'/pages/my/my'
                        })
                    },2000)
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