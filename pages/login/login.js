import GMAPI from "../../utils/api";
var app = getApp();
Page({
  data: {
      height:null,
      inputVal:'',
      login_Bool:true,
      salesman_Bool:true,
      passwordVal:'',
      address:'',
      d_address:'',
      location:{},
      userInfo: {},
      info:{},
      gx_list:[],
      m_product_id:'',
      m_product:''
  },
    onLoad:function (){
      var that=this;
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
        wx.setNavigationBarTitle({
            title: '推广'
        });
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    height: res.windowHeight
                });

            }
        });
    },
    onShow:function(e){
        var that=this;
        GMAPI.doSendMsg('api/user/userInfo',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_UserInfo);
        GMAPI.doSendMsg('api/Goods/goods_list',{type:1}, 'POST', that.onMsgCallBack_Goods);
        },
    onMsgCallBack_UserInfo:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        if(data.code==200){

            if(data.data.type==0){
                this.setData({
                    info:data.data,
                    login_Bool:false,
                    salesman_Bool:true,
                })
            }else if(data.data.type==2&&data.data.type_status==2){
                this.setData({
                    info:data.data,
                    login_Bool:true,
                    salesman_Bool:false,
                });
            }else{
                this.setData({
                    info:data.data,
                    login_Bool:false,
                    salesman_Bool:true,
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

    onMsgCallBack_Goods: function (jsonBack) {
        var goods=[];
        var list=jsonBack.data.data;
        for(var i=0;i<list.length;i++){
            goods.push(list[i]);
        }
        this.setData({
            gx_list:goods,
        });
    },
    clearInput: function (){
        this.setData({
            inputVal:'',
            strSearchValue:'',
            inputShowed: true
        });
        // this.onSearch();
    },
    getFocus: function (e) {
        this.setData({
            inputVal: e.detail.value,
        });
    },
    getPassword: function (e) {
        this.setData({
            passwordVal: e.detail.value,
        });
    },
    searchBtn:function (e){},

    logon:function (e) {
      var that=this;
        if(e.detail.value.user.length!=11||e.detail.value.user==''||GMAPI.checkPhone(e.detail.value.user)==false){
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.password==''||e.detail.value.password.length<6){
            wx.showToast({
                title: '请输入正确的密码',
                icon: 'none',
                duration: 2000
            });
        }else{
            GMAPI.doSendMsg('api/verification/dologin',{phone:e.detail.value.user,password:e.detail.value.password},'POST',that.onMsgCallBack_Logon);
        }
    },
    onMsgCallBack_Logon:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });

            this.setData({
                login_Bool:true,
                salesman_Bool:false,
            });

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    verification:function (e){
        wx.navigateTo({
            url: '/pages/modify/modify'
            // '?id='+e.currentTarget.dataset.id
        })
    },

    //获取经纬度
    getLocation:function(e){
        var that=this
        wx.getLocation({
            success: function(res){
                // success
                console.log(res)
                that.setData({
                    hasLocation:true,
                    location:{
                        longitude: res.longitude,
                        latitude:res.latitude
                    }
                })
            }
        })
    },
    //根据经纬度在地图上显示
    openLocation:function(e){
        var value=e.detail.value
        wx.openLocation({
            longitude: Number(value.longitude),
            latitude: Number(value.latitude)
        })
    },
    //选择位置位置
    chooseLocation:function(e){
        var that=this
        wx.chooseLocation({
            success: function(res){
                console.log(res)
                that.setData({
                    address:res.name,
                    d_address:res.address,
                    hasLocation:true,
                    location:{
                        longitude:res.longitude,
                        latitude:res.latitude
                    }
                })
            },
            fail: function() {

            },
            complete: function() {

            }
        })
    },

    bindPickerChange: function(e) {
        var that=this;
        var index=parseInt(e.detail.value);
        var list=this.data.gx_list;
        this.setData({
            m_product_id:list[index].id,
            m_product:list[index].title
        });
    },
    submitData:function (e) {
        var that=this;
        if(e.detail.value.m_name==''){
            wx.showToast({
                title: '店铺老板名称不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.m_phone.length!=11||e.detail.value.m_phone==''||GMAPI.checkPhone(e.detail.value.m_phone)==false){
            wx.showToast({
                title: '请输入正确的密码',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.m_openid==''){
            wx.showToast({
                title: '店铺老板微信不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(that.data.m_product==''){
            wx.showToast({
                title: '产品名称不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.m_store_name==''){
            wx.showToast({
                title: '店铺名称不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.m_address==''){
            wx.showToast({
                title: '店铺地址不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.m_address_detailed==''){
            wx.showToast({
                title: '店铺详细地址不能为空',
                icon: 'none',
                duration: 2000
            });
        }else{
            var json={uid:wx.getStorageSync('strWXID').strUserID,m_name:e.detail.value.m_name,m_phone:e.detail.value.m_phone,m_openid:e.detail.value.m_openid,m_product_id:that.data.m_product_id,m_store_name:e.detail.value.m_store_name,m_address:e.detail.value.m_address,m_address_x:that.data.location.longitude,m_address_y:that.data.location.latitude,m_address_detailed:e.detail.value.m_address_detailed};
            console.log(json)
            GMAPI.doSendMsg('api/verification/merchantRegister',json,'POST',that.onMsgCallBack_SubmitData);
        }
    },
    onMsgCallBack_SubmitData:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            setTimeout(function (){
                wx.switchTab({
                    url: '/pages/mall/mall'
                });
            },2000)
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },


    jump:function (e) {
        var url=e.currentTarget.dataset.url;
        wx.reLaunch({
            url: url
        })
    }

});