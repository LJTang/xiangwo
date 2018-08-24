import GMAPI from "../../utils/api";
var app = getApp()
Page({
  data: {
    // carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:false , // 全选状态
    carts: [
      { id: 1, title: '体重秤', concent: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", image: '../../img/gouwu.png', num: 1, price: 100, selected: false },
      { id: 2, title: '体重秤', concent: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", image: '../../img/gouwu.png', num: 1, price: 100, selected: false },
      { id: 3, title: '体重秤', concent: "规格和描述，免费测量体重机，可放在商城或者大型购物广场内。【高1.2米】", image: '../../img/gouwu.png', num: 1, price: 100, selected: false }
    ],
    imgURL:app.data.imgURL
  },
  onShow() {
    this.setData({
      hasList: true,
    });
    this.getTotalPrice();
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
    console.log(jsonBack)
    if (jsonBack.code==1){
      let carts = this.data.carts;
      carts.splice(index, 1);
      this.setData({
        carts: carts
      });
      if (!carts.length) {
        this.setData({
          hasList: false
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
   * 删除购物车当前商品
   */
  deleteList(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      key: e.currentTarget.dataset.index,
    })

    //请求
    var that = this;
    GMAPI.doSendMsg('clear_shopping', {shopping_id:id}, 'POST', that.onMsgCallBack_Home2);
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
    if(num <= 1){
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
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  onLoad: function (option) {
    var that = this;
    // GMAPI.doSendMsg('see_shopping' , '', 'GET', that.onMsgCallBack_Home);
  },
  onMsgCallBack_Home: function (jsonBack) {
    var that = this;
    console.log(jsonBack.data)
    // var data = JSON.parse(jsonBack.data);
    var data = jsonBack.data;
    if(data.code==1){
      that.setData({
        carts: data.data
      })
    } else if (data.code == 2){
      that.setData({
        hasList: false
      })
    }
  }
})