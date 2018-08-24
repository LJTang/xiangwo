import GMAPI from "../../utils/api";

var app = getApp();
Page({
  data: {

    menuTapCurrent: 0,

    sella: [
      { img: "../../img/logo1.png", name: "dhhdoi、", time: "13587895241", typeId: 0 },
      { img: "../../img/logo2.png", name: "享沃", time: "13587895241", typeId: 1 },
      { img: "../../img/logo1.png", name: "dhhdoi、", time: "13587895241", typeId: 2 }],

    sellb: [{ img: "../../img/logo.png", name: "享沃", tel: "13587895241", map: "东圃XX店", names: "免费纸巾机", price: "1899", time: "10", typeId: 0 },
      { img: "../../img/logo.png", name: "享沃", tel: "13587895241", map: "东圃XX店", names: "免费纸巾机", price: "1899", time: "10", typeId: 0 }],

    sellc: [
      { img: "../../img/logo.png", name: "享沃", tel: "13587895241", map: "东圃XX店", names: "免费纸巾机", price: "1899", time: "10", typeId: 0 }],

    selld: [
      { img: "../../img/logo.png", name: "享沃", tel: "13587895241", map: "东圃XX店", names: "免费纸巾机", price: "1899", time: "10", typeId: 0 },
      { img: "../../img/logo.png", name: "享沃", tel: "13587895241", map: "东圃XX店", names: "免费纸巾机", price: "1899", time: "10", typeId: 1 }],
  },

  swichNav: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current
    });
  },
    onShow:function(){
        var that=this;
        GMAPI.doSendMsg('api/user/myTeam',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_myTeam);
    },
    onMsgCallBack_myTeam:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
})