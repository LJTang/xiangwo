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
    userInfo: {},
      text:'',
      setting:{}
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
      this.setData({
          id: option.id
      });
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
                          GMAPI.doSendMsg('api/user/userInfo',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_BusinessTips);
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
    onShow:function(){
        var that = this;
        this.setData({
            // text: (app.data.loge_Bool==false?'免费领取':'填写商家信息')
        });
        GMAPI.doSendMsg('api/index/setting',{}, 'POST',that.onMsgCallBack_Setting);
    },
  onMsgCallBack_Details: function (jsonBack) {
    var that = this;
    var article = jsonBack.data.data.content;
    WxParse.wxParse('article', 'html', article, that, 5);
    that.setData({
        details: jsonBack.data.data,
        wxURL: jsonBack.data.url
    })
  },
    onMsgCallBack_Setting:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            this.setData({
                setting:data.data.config
            })
        }
    },
    onMsgCallBack_BusinessTips:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        if(data.code==200){
            this.setData({
                text: (data.data.type==0?'免费领取':'填写商家信息')
            });
        }
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
                data: {strWXOpenID:strData.data.openid,strUserID:strData.data.uid,userType:(strData.data.type==2&&strData.data.type_status==2)}
            });
            GMAPI.doSendMsg('api/verification/savePid',{pid:that.data.pid,uid:strData.data.uid}, 'POST',that.onMsgCallBack_P);
            GMAPI.doSendMsg('api/user/userInfo',{uid:strData.data.uid},'GET',that.onMsgCallBack_BusinessTips);
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