import GMAPI from "../../utils/api";
var app = getApp();
Page({
  data: {
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:false , // 全选状态
    carts:[],
    imgURL:app.data.imgURL,
    xwURL:'',
      selectedAllStatus:true,
      cart_arr:'',
      len_Bool :false
  },

  /**
   * 当前商品选中事件
   */
  bindCheckbox(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.carts[index].selected;
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].selected = !selected;
    var selectArr = [];
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected == true) {
        selectArr.push(carts[i].selected)
      }
    }
    if (e.currentTarget.dataset.type == 'success_circle') {
      this.setData({
        selectedAllStatus: false
      });
    }
    if (selectArr.length == carts.length) {
      this.setData({
        selectedAllStatus: true
      });
    }
    var carts = this.data.carts;
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
    });
    this.getTotalPrice();
  },


  /**
   * 购物车全选事件
   */
  bindSelectAll() {
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    var carts = this.data.carts;
    if (carts.length > 0) {
      for (var i = 0; i < carts.length; i++) {
        carts[i].selected = selectedAllStatus;
      }
    } else {
      selectedAllStatus = false
    }
    // 遍历
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 请求删除  回调
   */
  onMsgCallBack_Home2: function (jsonBack){
    if (jsonBack.code==1){
      let carts = this.data.carts;
      carts.splice(index, 1);
      this.setData({
        carts: carts
      });
      if (!carts.length) {
        this.setData({
          hasList: false,
            len_Bool:true
        });
      } else {
        this.getTotalPrice();
      }
    }else{
      wx.showToast({
        title: '请求失败',
        icon:'none'
      })
    }
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    let that=this;
    let carts = this.data.carts;
    let num = carts[index].goods_num;
    num = num + 1;
    carts[index].goods_num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();

      GMAPI.doSendMsg('api/Order/cart_num' ,{uid:wx.getStorageSync('strWXID').strUserID,goods_id:id,num:num}, 'POST', that.onMsgCallBack_Cart);
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
      const id = e.currentTarget.dataset.id;
      let that=this;
    let carts = this.data.carts;
    let num = carts[index].goods_num;
    if(num <= 1){
      return false;
    }
    num = num - 1;
    carts[index].goods_num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
      GMAPI.doSendMsg('api/Order/cart_num' ,{uid:wx.getStorageSync('strWXID').strUserID,goods_id:id,num:num}, 'POST', that.onMsgCallBack_Cart);
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].goods_num * carts[i].goods_price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: Math.floor(total * 100) / 100
    });
  },
  onLoad: function (option) {
    var that = this;
    // GMAPI.doSendMsg('api/Order/cart_list' ,{uid:wx.getStorageSync('strWXID').strUserID}, 'POST', that.onMsgCallBack_Cart);
  },
    onShow() {
        this.setData({
            hasList: true,
            len_Bool :true
        });

        var that = this;
        GMAPI.doSendMsg('api/Order/cart_list' ,{uid:wx.getStorageSync('strWXID').strUserID}, 'POST', that.onMsgCallBack_Cart);
    },
    onMsgCallBack_Cart: function (jsonBack) {
    var that = this;
    var data = jsonBack.data;
    if(data.code==200){
        var list=data.data;
        if(list.length>0){
            this.setData({
                len_Bool:true
            });
        }else{
            this.setData({
                len_Bool:false
            });
        }
      that.setData({
        carts: data.data,
        wxURL: data.url,
          hasList: true
      });
        this.getTotalPrice();
    }else{
      that.setData({
          hasList: false,
          len_Bool:false
      });
        wx.showToast({
            title: jsonBack.data.msg,
            icon: 'none',
            duration:2000
        });
    }
  },
    /**
     * 删除购物车当前商品
     */
    onDelete(e) {
        var that = this;
        GMAPI.doSendMsg('api/Order/cart_del' ,{uid:wx.getStorageSync('strWXID').strUserID,goods_id:e.currentTarget.dataset.id}, 'POST', that.onMsgCallBack_Delete);
    },
    onMsgCallBack_Delete: function (jsonBack) {
        var that = this;
        var data = jsonBack.data;
        if(data.code==200){
            wx.showToast({
                title: jsonBack.data.msg,
                icon: 'none',
                duration:2000
            });

            GMAPI.doSendMsg('api/Order/cart_list' ,{uid:wx.getStorageSync('strWXID').strUserID}, 'POST', that.onMsgCallBack_Cart);

        }else{
            wx.showToast({
                title: jsonBack.data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },

    /**
     * 结算
     * **/
    onShoppingCart:function (){
      let that=this;
        let carts = this.data.carts;
        let total = 0;
        let numb = 0;
        let cart_arr ='';
        for(let i = 0; i<carts.length; i++) {
            if(carts[i].selected) {
                total += carts[i].goods_num * carts[i].goods_price;
                numb++;
                cart_arr=carts[i].goods_id+','+cart_arr
            }
        }
        this.setData({
            cart_arr:cart_arr
        });
        if(numb==0){
            wx.showToast({
                title:'请选择购买的商品',
                icon: 'none',
                duration:2000
            });
        }else{
            GMAPI.doSendMsg('api/Order/cart_confirm',{ uid:wx.getStorageSync('strWXID').strUserID,goods_id:cart_arr}, 'POST', that.onMsgCallBack_ShoppingCart);
        }
  },
    onMsgCallBack_ShoppingCart: function (jsonBack) {
        var that = this;
        var data = jsonBack.data;
        if(data.code==200){
          wx.navigateTo({
              url:'/pages/cart_confirm/cart_confirm?id='+that.data.cart_arr
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