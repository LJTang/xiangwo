import GMAPI from "../../utils/api";
var app = getApp();
Page({
  data: {
      inputVal:'',
      login_Bool:true,
      fabu_Bool:true,
      passwordVal:'',
    nav: [
      { img: "../../img/nav.png", url: "/pages/mall/mall", text: "商城", on: false },
      { img: "../../img/nav1.png", url: "/pages/business/business", text: "商家", on: false },
      { img: "../../img/nav2_1.png", url: "/pages/login/login", text: "发布 ", on: true },
      { img: "../../img/nav3.png", url: "/pages/my/my", text: "我的", on: false },
    ],
      address:'',
      d_address:'',
      location:''
  },
    onLoad:function (){
        this.setData({
            login_Bool:false,
            fabu_Bool:true,
        });
    },
    onShow:function(e){
      console.log(wx.getStorageSync('xiangwo'));
        if(wx.getStorageSync('xiangwo')=='') {
            wx.setNavigationBarTitle({
                title: '登录'
            });
            this.setData({
                login_Bool:false,
                fabu_Bool:true,
            });
        }else{
            this.setData({
                login_Bool:true,
                fabu_Bool:false,
            });
            wx.setNavigationBarTitle({
                title: '发布'
            });
        }
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
            wx.setNavigationBarTitle({
                title: '发布'
            });
            wx.setStorage({
                key: 'xiangwo',
                data:true
            });
            this.setData({
                login_Bool:true,
                fabu_Bool:false,
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
        console.log(e)
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
            var json={uid:wx.getStorageSync('strWXID').strUserID,m_name:e.detail.value.m_name,m_phone:e.detail.value.m_phone,m_openid:e.detail.value.m_openid,m_product_id:1,m_store_name:e.detail.value.m_store_name,m_address:e.detail.value.m_address,m_address_xy:that.data.location.longitude,m_address_y:that.data.location.latitude,m_address_detailed:e.detail.value.m_address_detailed};
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