import GMAPI from "../../utils/api";

var app = getApp();
Page({
  data: {
    active: 1,
      pid: '',
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
      popUp_Bool:true,
      len_Bool:true

  },
  //tab
  swichNav: function (e) {
    var that = this;
    var current = e.currentTarget.dataset.current;
    this.setData({
      active: current,
        gx_list:[],
        fgx_list:[],
        len_Bool:true
    });
    GMAPI.doSendMsg('api/Goods/goods_list',{type:that.data.active}, 'POST', that.onMsgCallBack_Home);
  },
  // 接口
  onLoad: function (option) {
    var that = this;
    console.log(option.pid==undefined)
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
      wx.getSetting({
          success: res => {
              if (res.authSetting['scope.userInfo']){
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                      success: res => {
                          // 可以将 res 发送给后台解码出 unionId
                          // this.globalData.userInfo = res.userInfo;
                          that.setData({
                              userInfo:res.userInfo,
                              hasUserInfo:false
                          });

                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          // 所以此处加入 callback 以防止这种情况
                          if (this.userInfoReadyCallback) {
                              this.userInfoReadyCallback(res)

                          }
                          // GMAPI.doSendMsg('api/user/userInfo',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_BusinessTips);

                      }
                  })
              }else{
                  that.setData({
                      hasUserInfo:true
                  });
              }
          }
      });
      //   console.log(wx.getStorageSync('strWXID').userType)
      // if(wx.getStorageSync('strWXID').userType==true){
      //     wx.showToast({
      //         title:'您是业务员，请选择对应的产品发布',
      //         icon:'none',
      //         duration: 3000
      //     });
      // }
      // GMAPI.doSendMsg('api/user/userInfo',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_BusinessTips);
  },
    onShow:function(){
        var that = this;
        this.setData({
            popUp_Bool:(wx.getStorageSync('getUserInfo')==''?true:false)
        });
        GMAPI.doSendMsg('api/Goods/goods_list',{type:that.data.active}, 'POST', that.onMsgCallBack_Home);
    },

    onShareAppMessage: function (res){
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
      if(list.length>0){
          this.setData({
              len_Bool:true
          });
      }else{
          this.setData({
              len_Bool:false
          });
      }
    this.setData({
        xwURL:jsonBack.data.url,
      gx_list:goods,
      fgx_list:goods
    })
  },
    onMsgCallBack_BusinessTips:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        if(data.code==200){
            if(data.data.type==2&&data.data.type_status==2){
                wx.showToast({
                    title:'您是业务员，请选择对应的产品发布',
                    icon:'none',
                    duration: 3000
                });
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
                my_UserInfo:false,
                imgURL:e.detail.userInfo.avatarUrl,
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
            // GMAPI.doSendMsg('api/user/userInfo',{uid:strData.data.uid},'GET',that.onMsgCallBack_BusinessTips);

        }else{
            wx.showToast({
                title:jsonBack.data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    onMsgCallBack_P:function (jsonBack){},
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