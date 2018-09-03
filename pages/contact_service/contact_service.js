import GMAPI from "../../utils/api";
var app = getApp();
Page({
  data:{
      setting:{}
      },
    onShow:function(){
      var  that=this;
        GMAPI.doSendMsg('api/index/setting',{}, 'POST',that.onMsgCallBack_Setting);
    },
    onMsgCallBack_Setting:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            this.setData({
                setting:data.data.config
            })
        }
    },
    onMakePhoneCall:function (){
        var that=this;
        wx.makePhoneCall({
            phoneNumber:that.data.setting.customer_service
        })
    },

});