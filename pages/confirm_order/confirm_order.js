// pages/confirm_order/confirm_order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carts: [
      { id: 1, title: '体重秤',  image: '../../img/gouwu.png', num: 1, price: 100, },
    ],
    totalPrice:100,
    condition: false,
    provinces: ["要什么100", "100", "100", "100"],
    numb:1
  },

  /**
 * 绑定加数量事件
 */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
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
            numb:option.numb
        });
    },
    confirmOrder:function(){
        var that = this;
        GMAPI.doSendMsg('api/Order/order_confirm',{ uid:wx.getStorageSync('strWXID').strUserID,goods_id:that.data.details.id,num:that.data.numb}, 'POST', that.onMsgCallBack_ConfirmOrder);
    },
    onMsgCallBack_ConfirmOrder: function (jsonBack){
        var that = this;
        console.log(jsonBack.data);
        var data=jsonBack.data;
        if(data.code==200){
            wx.navigateTo({
                url:'/pages/confirm_order/confirm_order?numb='+that.data.numb
            })
        }else{
            wx.showToast({
                title: jsonBack.data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
});