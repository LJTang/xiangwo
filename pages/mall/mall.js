import GMAPI from "../../utils/api";

var app = getApp();
Page({
  data: {
    active: 1,
    xwURL:'',
    gx_list:[],
    fgx_list: [],
    imgURL:'http://xiao.guangzhoubaidu.com/',
    nav: [
      { img: "../../img/nav_1.png", url: "/pages/mall/mall", text: "商城", on: true },
      { img: "../../img/nav1.png", url: "/pages/business/business", text: "商家", on: false },
      { img: "../../img/nav2.png", url: "/pages/login/login", text: "发布 ", on: false },
      { img: "../../img/nav3.png", url: "/pages/my/my", text: "我的", on: false },
    ],
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      popUp_Bool:(wx.getStorageSync('getUserInfo')==''?true:false)
    
  },
  //tab
  swichNav: function (e) {
    var that = this;
    var current = e.currentTarget.dataset.current;
    this.setData({
      active: current,
        gx_list:[],
        fgx_list:[]
    });
    GMAPI.doSendMsg('api/Goods/goods_list',{type:that.data.active}, 'POST', that.onMsgCallBack_Home);
  },
  // 接口
  onLoad: function (option) {
    var that = this;
      if(option.pid==undefined){}else{
          GMAPI.doSendMsg('api/verification/savePid',{savePid:option.pid}, 'POST');
      }
      if (app.globalData.userInfo) {
          this.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true
          })
      } else if (this.data.canIUse) {
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
              app.globalData.userInfo=res.userInfo;
              this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
              })
          }
      } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
              success: res => {
                  app.globalData.userInfo = res.userInfo;
                  this.setData({
                      userInfo: res.userInfo,
                      hasUserInfo: true
                  })
              }
          })
      }
  },
    onShow:function(){
        var that = this;
        this.setData({
            popUp_Bool:(wx.getStorageSync('getUserInfo')==''?true:false)
        })
        GMAPI.doSendMsg('api/Goods/goods_list',{type:that.data.active}, 'POST', that.onMsgCallBack_Home);
    },

    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            // console.log(res.target)
            return {
                title: '享沃测试',
                path: '/pages/mall/mall?pid='+wx.getStorageSync('strWXID').strUserID,
                success: function(res) {
                    // 转发成功
                },
                fail: function(res) {
                    // 转发失败
                }
            }
        }
        return {
            title: '享沃测试2',
            path: '/pages/mall/mall?pid='+wx.getStorageSync('strWXID').strUserID,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
  onMsgCallBack_Home: function (jsonBack) {
      var goods=[];
      var list=jsonBack.data.data;
      for(var i=0;i<list.length;i++){
          goods.push(list[i]);
      }
    this.setData({
        xwURL:jsonBack.data.url,
      gx_list:goods,
      fgx_list:goods
    })
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
                my_UserInfo:false,
                imgURL:e.detail.userInfo.avatarUrl,
                userInfo: e.detail.userInfo,
                hasUserInfo: true
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
                popUp_Bool:false
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
        }else{
            wx.showToast({
                title:jsonBack.data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    popClose:function () {
        this.setData({
            canIUse:false,
            hasUserInfo:false
        });
    },
    jump:function (e) {
        var url=e.currentTarget.dataset.url;
        wx.reLaunch({
            url: url
        })
    }
});