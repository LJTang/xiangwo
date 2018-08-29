import GMAPI from "../../utils/api";

Page({
  data: {
    address_list:[],
      status:0,
  },
    onLoad:function(option){
      if(option.status==1){
          this.setData({status:1})
      }else{
          this.setData({status:1})
      }
    },
    onShow:function(){
        var that=this;
        GMAPI.doSendMsg('api/user/userAddressList',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_Address);
    },
    onMsgCallBack_Address:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        var list=data.data;
        var goods=[];
        if(data.code==200){
            if(list.length==0){
                this.setData({
                    address_list:[]
                })
            }else{
                for(var i=0;i<list.length;i++){
                    goods.push(list[i])
                }
                this.setData({
                    address_list:goods
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
    radioChange: function(e) {
        var that=this;
        GMAPI.doSendMsg('api/user/userAddressEdit',{id:e.currentTarget.dataset.id,uid:wx.getStorageSync('strWXID').strUserID,status:1},'GET',that.onMsgCallBack_ModificationAddress);
    },
    onMsgCallBack_ModificationAddress:function (jsonBack){
        var that=this;
        var data=jsonBack.data;
        if(data.code==200){
            if( this.data.status==1){
                wx.navigateBack({
                    delta:1
                })
            }else{
                GMAPI.doSendMsg('api/user/userAddressList',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_Address);
            }
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
    }
})