import GMAPI from "../../utils/api";

var app = getApp();
Page({
  data: {
    menuTapCurrent:3,
      teams:[],
      vipArray:[],
      len_Bool :true
  },

  swichNav: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    this.setData({
      menuTapCurrent: current,
        vipArray:[],
        len_Bool :true
    });
      var that=this;
      GMAPI.doSendMsg('api/user/myTeam',{uid:wx.getStorageSync('strWXID').strUserID,level:parseInt(current)},'GET',that.onMsgCallBack_myTeam);
  },
    onShow:function(){
        var that=this;
        this.setData({
            vipArray:[],
            len_Bool:true
        });
        GMAPI.doSendMsg('api/user/myTeam',{uid:wx.getStorageSync('strWXID').strUserID,level:that.data.menuTapCurrent},'GET',that.onMsgCallBack_myTeam);
    },
    onMsgCallBack_myTeam:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            var list=data.data.vipArray;
            if(list.length==0){
                this.setData({
                    len_Bool :false
                })
            }else{
                this.setData({
                    len_Bool :true
                })
            }
            this.setData({
                teams:data.data,
                vipArray:data.data.vipArray
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
});