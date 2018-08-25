import GMAPI from "../../utils/api";

var app = getApp();
Page({
  data: {
    menuTapCurrent:3,
      teams:[],
      vipArray:[]
  },

  swichNav: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current
    });
      var that=this;
      this.data.vipArray=[];
      GMAPI.doSendMsg('api/user/myTeam',{uid:wx.getStorageSync('strWXID').strUserID,level:parseInt(current)},'GET',that.onMsgCallBack_myTeam);
  },
    onShow:function(){
        var that=this;
        this.data.vipArray=[];
        GMAPI.doSendMsg('api/user/myTeam',{uid:wx.getStorageSync('strWXID').strUserID,level:that.data.menuTapCurrent},'GET',that.onMsgCallBack_myTeam);
    },
    onMsgCallBack_myTeam:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            // if(list.length==0){
            //     this.setData({
            //         address_list:[]
            //     })
            // }else{
            //     for(var i=0;i<list.length;i++){
            //         goods.push(list[i])
            //     }
            //     this.setData({
            //         address_list:goods
            //     })
            // }
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
})