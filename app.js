//app.js
import GMAPI from "./utils/api";

App({
  data:{
    imgURL:'http://xiao.guangzhoubaidu.com/',
      user_code:'',
      loge_Bool:false
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that=this;
    var code='';
    // 登录
    wx.login({
      success: res => {

            code=res.code
          // GMAPI.doSendMsg('api/verification/login',{code:res.code,rawData:e.detail.rawData,signature:e.detail.signature,iv:e.detail.iv,encryptedData:e.detail.encryptedData},'POST',that.onMsgCallBack);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
                  wx.request({
                      url: 'https://xiao.guangzhoubaidu.com/api/verification/login',
                      data: {
                          code: code,
                          rawData: res.rawData,
                          signature: res.signature,
                          iv: res.iv,
                          encryptedData: res.encryptedData
                      },
                      responseType: 'text',
                      header: {
                          'content-type': 'application/json'
                      },
                      method: 'POST',
                      success: function (res) {
                          var strData = res.data;
                          if (strData.code == 200) {
                              wx.setStorage({
                                  key: 'strWXID',
                                  data: {strWXOpenID: strData.data.openid, strUserID: strData.data.uid,userType:(strData.data.type==2&&strData.data.type_status==2)}
                              });
                          } else {
                              wx.showToast({
                                  title: strData.msg,
                                  icon: 'none',
                                  duration: 2000
                              });
                          }
                      },
                      fail: function (res) {
                          wx.showToast({
                              title: '网络请求错误，请稍后再重试',
                              icon: 'none',
                              duration: 2000
                          });
                          // wx.hideLoading();
                      }
                  })
              }
              wx.request({
                    url: 'https://xiao.guangzhoubaidu.com/api/verification/login',
                    data: {
                        code: code,
                        rawData: res.rawData,
                        signature: res.signature,
                        iv: res.iv,
                        encryptedData: res.encryptedData
                    },
                    responseType: 'text',
                    header: {
                        'content-type': 'application/json'
                    },
                    method: 'POST',
                    success: function (res) {
                        var strData = res.data;
                        if (strData.code == 200) {
                            wx.setStorage({
                                key: 'strWXID',
                                data: {strWXOpenID: strData.data.openid, strUserID: strData.data.uid,userType:(strData.data.type==2&&strData.data.type_status==2)}
                            });
                        } else {
                            wx.showToast({
                                title: strData.msg,
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    },
                    fail: function (res) {
                        wx.showToast({
                            title: '网络请求错误，请稍后再重试',
                            icon: 'none',
                            duration: 2000
                        });
                        // wx.hideLoading();
                    }
                })
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,

  },
  post: function (url, data) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var promise = new Promise((resolve, reject) => {
      //init
      var that = this;
      var postData = data;
      //增加时间
      postData.time = util.formatDate2()

      //判断用户数据是否存在
      var user = wx.getStorageSync('user')
      if (user) {
        postData.openid = user.openid
      }
      /*
      //自动添加签名字段到postData，makeSign(obj)是一个自定义的生成签名字符串的函数
      postData.signature = that.makeSign(postData);
      */
      //网络请求
      wx.request({
        url: url,
        data: postData,
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {//服务器返回数据
          if (res.data.code == 1) {//res.data 为 后台返回数据，格式为{"data":{...}, "info":"成功", "status":1}, 后台规定：如果status为1,既是正确结果。可以根据自己业务逻辑来设定判断条件
            resolve(res.data.data);
          } else {//返回错误提示信息
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
        },
        error: function (e) {
          reject('网络出错');
        }
      })
    });
    return promise;
  },
})
