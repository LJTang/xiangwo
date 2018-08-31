import GMAPI from "../../utils/api";
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();

Page({
  data: {
    imgUrls: [
      '../../img/banner1.png',
      '../../img/banner1.png',
      '../../img/banner1.png'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    id:'',
    pid:'',
    carts: [
      { id: 1, title: '体重秤', image: '../../img/gouwu.png', num: 1, price: 100, },],
    imgURL: app.data.imgURL,
      details:'',
      wxURL: '',
      numb:1,
      hasUserInfo:false,
      userInfo: {}
  },
  buy: function () { //立即购买
    this.setData({
      buy_box: true
    })
  },
  close: function () { //关闭立即购买
    this.setData({
      buy_box: false
    })
  },
  open_share: function () { //分享打开
    this.setData({
      share_box: true,
    })
  },
  down_share: function () { //分享关闭
    this.setData({
      share_box: false,
    })
  },
  /**
   * 绑定加数量事件
   */
  addCount:function(e) {
    const index = e.currentTarget.dataset.index;
    let num = this.data.numb;
    num = num + 1;
    this.setData({
        numb: num
    });
    // this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount:function(e) {
    const index = e.currentTarget.dataset.index;
    let num = this.data.numb;
    if (num <= 1) {
      num=1;
    }else{
      num = num - 1;
    }
    this.setData({
        numb: num
    });
    // this.getTotalPrice();
  },
  jiaru:function(){
    var that = this;
    GMAPI.doSendMsg('api/Order/cart_add',{ uid:wx.getStorageSync('strWXID').strUserID,goods_id:that.data.details.id}, 'POST', that.jiarugo);

  },

  jiarugo: function (jsonBack){
    var that = this;
      var data=jsonBack.data;
      if(data.code==200){
          wx.showToast({
              title: jsonBack.data.msg,
              icon: 'none',
              duration:2000
          });
      }else{
          wx.showToast({
              title: jsonBack.data.msg,
              icon: 'none',
              duration:2000
          });
      }
  },

    onShow:function(){
      this.setData({
          buy_box:false
      })
    },
  //  下单
    placeAnOrder:function(e){
        var that = this;
        // GMAPI.doSendMsg('api/Order/order_add',{ uid:wx.getStorageSync('strWXID').strUserID,goods_id:that.data.details.id,num:that.data.numb}, 'POST', that.onMsgCallBack_PlaceAnOrder);
        this.setData({
            share_box: false,
        });
        wx.navigateTo({
            url:'/pages/confirm_order/confirm_order?id='+e.currentTarget.dataset.id+'&numb='+that.data.numb
        })
    },
    onMsgCallBack_PlaceAnOrder: function (jsonBack){
        var that = this;
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
  // 接口
  onLoad: function (option) {
      var that = this;
      if(option.pid==undefined){
          this.setData({
              pid: ''
          });
      }else{
          this.setData({
              pid: option.pid
          });
          GMAPI.doSendMsg('api/verification/savePid',{pid:option.pid,uid:wx.getStorageSync('strWXID').strUserID}, 'POST',that.onMsgCallBack_P);
      }
      GMAPI.doSendMsg('api/Goods/goods_detail', { id: option.id }, 'POST', that.onMsgCallBack_Details);
    this.setData({
      id: option.id,
    });

      wx.getSetting({
          success: res => {
              if (res.authSetting['scope.userInfo']){
                  wx.getUserInfo({
                      success: res => {
                          that.setData({
                              userInfo:res.userInfo,
                              hasUserInfo:false
                          });

                          if (this.userInfoReadyCallback) {
                              this.userInfoReadyCallback(res)

                          }
                      }
                  })
              }else{
                  that.setData({
                      hasUserInfo:true
                  });
              }
          }
      });
  },
    onMsgCallBack_Details: function (jsonBack) {
        var that = this;
        if(jsonBack.data.code==200){
            var article = jsonBack.data.data.content;
            WxParse.wxParse('article', 'html', article, that, 5);
            that.setData({
                details: jsonBack.data.data,
                wxURL: jsonBack.data.url
            })
        }else{
            wx.showToast({
                title: jsonBack.data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
    onShareAppMessage: function (res) {
      var that=this;
        return {
            title: '享沃测试2',
            path: '/pages/ware_more/ware_more?pid='+wx.getStorageSync('strWXID').strUserID+'&id='+that.data.id,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
    // 授权
    getUserInfo: function (e) {
        var that=this;
        this.setData({
            popUp_Bool:false
        });
        if(e.detail.errMsg=='getUserInfo:ok'){
            app.globalData.userInfo = e.detail.userInfo;
            wx.setStorage({
                key: 'getUserInfo',
                data: true
            });
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: false
            });
            wx.login({
                success: res => {
                    wx.setStorage({
                        key: 'log',
                        data:{code:res.code}
                    });
                    GMAPI.doSendMsg('api/verification/login',{code:res.code,rawData:e.detail.rawData,signature:e.detail.signature,iv:e.detail.iv,encryptedData:e.detail.encryptedData},'POST',that.onMsgCallBack);
                }
            });

        }else{
            this.setData({
                popUp_Bool:false,
                hasUserInfo: true
            });
        }
    },
    onMsgCallBack:function (jsonBack){
        var strData=jsonBack.data;
        if(jsonBack.data.code==200){
            wx.setStorage({
                key: 'strWXID',
                data: {strWXOpenID:strData.data.openid,strUserID:strData.data.uid}
            });
            GMAPI.doSendMsg('api/verification/savePid',{pid:option.pid,uid:strData.data.uid}, 'POST',that.onMsgCallBack_P);
        }else{
            wx.showToast({
                title:jsonBack.data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    onMsgCallBack_P:function (jsonBack){},
});