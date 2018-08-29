import GMAPI from "../../utils/api";
Page({
  data: {
      searchName:'',
    list:[
      { map: "广州天河区东圃二马路45号 ", name: "海王星辰大药房东圃店", juli:"距离12km",img:"../../img/dwei.png"},
      { map: "广州天河区东圃二马路45号 ", name: "海王星辰大药房东圃店", juli: "距离12km", img: "../../img/dwei.png" },
      { map: "广州天河区东圃二马路45号 ", name: "海王星辰大药房东圃店", juli: "距离12km", img: "../../img/dwei.png" },
      { map: "广州天河区东圃二马路45号 ", name: "海王星辰大药房东圃店", juli: "距离12km", img: "../../img/dwei.png" },
      { map: "广州天河区东圃二马路45号 ", name: "海王星辰大药房东圃店", juli: "距离12km", img: "../../img/dwei.png" },
      { map: "广州天河区东圃二马路45号 ", name: "海王星辰大药房东圃店", juli: "距离12km", img: "../../img/dwei.png" }
    ],
      goods:[]
  },
    onLoad:function () {
      var that=this;
        GMAPI.doSendMsg('api/merchants/index',{ x_y:wx.getStorageSync('getLocation').lon+','+wx.getStorageSync('getLocation').lat}, 'GET', that.onMsgCallBack_BusinessList);
    },

    onSearch:function(){
        var that=this;
        this.setData({
            goods:[]
        });
        GMAPI.doSendMsg('api/merchants/searchs',{searchs:that.data.searchName}, 'GET',that.onMsgCallBack_BusinessList);
    },
    onMsgCallBack_BusinessList: function (jsonBack) {
        console.log(jsonBack.data);
        var data=jsonBack.data;
        if(data.code==200){
            var list=data.data;
            var goods=[];
            if(list.length==0){
                goods=[]
            }else{
                for(var i=0;i<list.length;i++){
                    goods.push(list[i]);
                }
            }
            this.setData({
                goods:goods
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }

    },
    getFocus:function (e) {
        this.setData({
            searchName: e.detail.value,
        });
    },
    onAddress:function (e) {
        wx.setStorage({
            key: 'getLocation',
            data: {lon:e.currentTarget.dataset.lon,lat:e.currentTarget.dataset.lat}
        });
        wx.navigateBack({
            delta: 1
        })
    }
})
