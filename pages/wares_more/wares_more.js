import GMAPI from "../../utils/api";
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()

Page({
  data: {
      id:'',
      pid:'',
    imgUrls: [
      '../../img/banner.png',
      '../../img/banner.png',
      '../../img/banner.png'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgURL: app.data.imgURL,
    wxURL:'',
    details:'',
    hasUserInfo:false,
    userInfo: {}
  },
  open_share: function () { //打开
    this.setData({
      share_box: true,
    })
  },
  down_share: function () { //关闭
    this.setData({
      share_box: false,
    })
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
    console.log(jsonBack)
    var that = this;
    var article = jsonBack.data.data.content;
    WxParse.wxParse('article', 'html', article, that, 5);
    that.setData({
        details: jsonBack.data.data,
        wxURL: jsonBack.data.url
    })
  },
    onShareAppMessage: function (res) {
      var that=this;
        return {
            title: '享沃测试2',
            path: '/pages/wares_more/wares_more?pid='+wx.getStorageSync('strWXID').strUserID+'&id='+that.data.id,
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
      var that=this;
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