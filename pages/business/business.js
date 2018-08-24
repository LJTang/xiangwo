import GMAPI from "../../utils/api";
Page({
  data: {
    height: 0,
    center: [],
    markers: [
      {
        iconPath: "../../img/dwei.png",
        id: 0,
        latitude: 23.111380,
        longitude: 113.403800,
        width: 18,
        height: 27,
        callout: {
          content: "广州市铁一中学 \n 距离12km" ,
          color: "#ffffff",
          fontSize: 12,
          borderRadius: 7,
          bgColor: "#000000",
          textAlign:"center",
          padding: 10,
          display: 'BYCLICK',
        }
      },
      {
        iconPath: "../../img/dwei.png",
        id: 1,
        latitude: 23.110790,
        longitude: 113.402010,
        width: 18,
        height: 27,
        callout: {
          content: "广州市铁一中学 \n 距离12km",
          color: "#ffffff",
          fontSize: 12,
          borderRadius: 7,
          bgColor: "#000000",
          textAlign: "center",
          padding: 10,
          display: 'BYCLICK',
        }
      },
    ],
    nav: [
      { img: "../../img/nav.png", url: "/pages/mall/mall", text: "商城", on: false  },
      { img: "../../img/nav1_1.png", url: "/pages/business/business", text: "商家", on: true },
      { img: "../../img/nav2.png", url: "/pages/login/login", text: "发布 ", on: false },
      { img: "../../img/nav3.png", url: "/pages/my/my", text: "我的", on: false },
    ],
  },
  
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('map')
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation();
    console.log(111)
  },
    onMap: function () {
  },
    onLoad() {

        var that=this;
        const system = wx.getSystemInfoSync();
        this.setData({
          height: system.windowHeight
        })
        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
                this.setData({
                    center: [res.longitude, res.latitude]
                });
                wx.setStorage({
                    key: 'getLocation',
                    data: {lon:res.longitude,lat:res.latitude}
                });
                // console.log(res.longitude, res.latitude);
                // GMAPI.doSendMsg('near_seller',{lon:res.longitude,lat:res.latitude,fanwei:10}, 'GET',that.onMsgCallBack_Business);
                // GMAPI.doSendMsg('api/merchants/index',{ x_y:res.longitude+','+res.latitude}, 'GET', that.onMsgCallBack_Business);
            }
        });
      },
    onShow:function(){
        var that = this;
        this.setData({
            center:[wx.getStorageSync('getLocation').lon,wx.getStorageSync('getLocation').lat],
        });
        GMAPI.doSendMsg('api/merchants/index',{ x_y:wx.getStorageSync('getLocation').lon+','+wx.getStorageSync('getLocation').lat}, 'GET', that.onMsgCallBack_Business);

      },

    onMsgCallBack_Business: function (jsonBack) {
        console.log(jsonBack.data);
        var data=jsonBack.data;
        if(data.code==200){
            var list=data.data;
            var markers=[];
            for(var i=0;i<list.length;i++){
                markers.push({
                    iconPath: "../../img/dwei.png",
                    id:list[i].id,
                    latitude: list[i].m_address_y,
                    longitude: list[i].m_address_x,
                    width: 18,
                    height: 27,
                    callout: {
                        content: list[i].m_address+ "\n距离"+list[i].count ,
                        color: "#ffffff",
                        fontSize: 12,
                        borderRadius: 7,
                        bgColor: "#000000",
                        textAlign:"center",
                        padding: 10,
                        display: 'BYCLICK',
                    }
                })
            }

            this.setData({
                markers:markers
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }

    },


  golist: function () {
    wx.navigateTo({
      url: '/pages/business_list/business_list'
    })
  }
})
