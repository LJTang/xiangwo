import GMAPI from "../../utils/api";
var app = getApp();
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
    yj_list:[]
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
    var that=this;
      GMAPI.doSendMsg('api/user/orderBill',{uid:wx.getStorageSync('strWXID').strUserID,nowtime:0}, 'POST',that.onMsgCallBack_Commission);
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
        yj_list: [],
    });
      var that=this;
      GMAPI.doSendMsg('api/user/orderBill',{uid:wx.getStorageSync('strWXID').strUserID,nowtime:parseInt(dataset.cateindex)}, 'POST',that.onMsgCallBack_Commission);

  },
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false
    })
  },

    onMsgCallBack_Commission: function (jsonBack) {
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
                yj_list: data.data,
            });
        }else{
            this.setData({
                len_Bool:false
            });
            wx.showToast({
                title:data.msg,
                icon: 'none',
                duration:2000
            });
        }
    }
});
