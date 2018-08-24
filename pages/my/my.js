//index.js
//获取应用实例
import GMAPI from "../../utils/api";

const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    user_View:true,
    business_View: true,
      strGoods:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    my_list:[
      { limg: "../../img/my4.png", text: "购物车", rimg: "../../img/myr.png", url:"/pages/cart/cart"},
      { limg: "../../img/my5.png", text: "全部订单", rimg: "../../img/myr.png", url: "/pages/all_order/all_order" },
      { limg: "../../img/my6.png", text: "联系客服", rimg: "../../img/myr.png", url: "/pages/contact_service/contact_service" },
      { limg: "../../img/my6.png", text: "我的地址", rimg: "../../img/myr.png", url: "/pages/select_address/select_address" },

    ],
    nav: [
      { img: "../../img/nav.png", url: "/pages/mall/mall", text: "商城", on: false },
      { img: "../../img/nav1.png", url: "/pages/business/business", text: "商家", on: false },
      { img: "../../img/nav2.png", url: "/pages/login/login", text: "发布 ", on: false },
      { img: "../../img/nav3_1.png", url: "/pages/my/my", text: "我的", on: true },
    ],
    row_list:[],
      my_lists:[
          { limg: "../../img/my12.png", text: "佣金明细", rimg: "../../img/myr.png", url: "/pages/commission/commission" },
          { limg: "../../img/my5.png", text: "分销订单", rimg: "../../img/myr.png", url: "/pages/sale_order/sale_order" },
          { limg: "../../img/my8.png", text: "我的团队", rimg: "../../img/myr.png", url: "/pages/team_superior/team_superior" },
          { limg: "../../img/my10.png", text: "培训", rimg: "../../img/myr.png", url: "/pages/train/train" },
          { limg: "../../img/my11.png", text: "宣传册", rimg: "../../img/myr.png", url: "/pages/publicity/publicity" },
          { limg: "../../img/my6.png", text: "联系客服", rimg: "../../img/myr.png", url: "/pages/contact_service/contact_service" },
      ],
      row_lists:[
          { price: "￥75.00", text: "累计佣金",},
          { price: "￥75.00", text: "可提现佣金",},
          { price: "￥7.00", text: "未结算佣金",},
      ],
      info:''
  },

    onLoad: function () {
        if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
        } else if (this.data.canIUse) {
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
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
      var that=this;
      GMAPI.doSendMsg('api/user/userInfo',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_UserInfo);
    },
    onMsgCallBack_UserInfo:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        if(data.code==200){
            if(data.data.type==0){
                this.setData({
                    info:data.data,
                    user_View:false,
                    business_View: true
                })
            }else if(data.data.type==2&&data.data.type_status==2){
                this.setData({
                    info:data.data,
                    user_View:true,
                    business_View: false
                });
                // GMAPI.doSendMsg('api/user/myTeam',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_myTeam);
            }else{
                this.setData({
                    info:data.data,
                    user_View:false,
                    business_View: true
                })
            }

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    // 业务员
  getUserInfo: function (e) {
      var that=this;
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
                      data: {code:res.code}
                  });
                  GMAPI.doSendMsg('api/verification/login',{code:res.code,rawData:e.detail.rawData,signature:e.detail.signature,iv:e.detail.iv,encryptedData:e.detail.encryptedData},'POST',that.onMsgCallBack);
              }
          });
          // this.globalData.userInfo = e.detail.userInfo;
      }
  },
    onMsgCallBack:function (jsonBack){
        var strData=jsonBack.data;

        if(strData.code==200){
            wx.setStorage({
                key: 'strWXID',
                data: {strWXOpenID:strData.data.openid,strUserID:strData.data.uid}
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    open_spread: function () { //打开
        this.setData({
            spread_box: true,
        })
    },
    down_spread: function () { //关闭
        this.setData({
            spread_box: false,
        })
    },
    copyBtn: function (e) {
        var that = this;
        wx.setClipboardData({
            //准备复制的数据
            data: that.data.code_ids,
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                });
            }
        });


    },
    download:function () {
        wx.getSetting({
            success: function (res) {
                wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success: function (res) {
                        var imgUrl ='/img/ewm.png';//图片地址
                            wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                                url: imgUrl,
                                success: function (res) {
                                    console.log(res);
                                    // 下载成功后再保存到本地
                                    wx.saveImageToPhotosAlbum({
                                        filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                                        success: function(res){
                                            wx.showToast({
                                                title:'成功',
                                                icon:'none',
                                                duration: 2000
                                            });
                                        },
                                        fail(){
                                            wx.showToast({
                                                title:'失败',
                                                icon:'none',
                                                duration: 2000
                                            });
                                        }
                                    })
                                }
                            })
                    }
                })
            }
        })

    //     wx.saveImageToPhotosAlbum({
    //         filePath:'/xiangwo/img/ewm.png',
    //         success(res) {
    //             wx.showToast({
    //                 title:'成功',
    //                 icon:'none',
    //                 duration: 2000
    //             });
    //         },
    //         fail(){
    //             wx.showToast({
    //                 title:'失败',
    //                 icon:'none',
    //                 duration: 2000
    //             });
    //         }
    //     })
    }


})
