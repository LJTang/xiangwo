import GMAPI from "../../utils/api";
Page({
  data: {
    height: 0,
    center: [],
    markers:[],
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
  },
    onLoad() {
        var that=this;
        const system = wx.getSystemInfoSync();
        this.setData({
          height: system.windowHeight
        });
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          console.log(res)
          that.setData({
            center: [res.longitude, res.latitude],
            markers:[]
          });
          wx.setStorage({
            key: 'getLocation',
            data: { lon: res.longitude, lat: res.latitude }
          });
      
          GMAPI.doSendMsg('api/merchants/index', { x_y: res.longitude + ',' + res.latitude}, 'GET', that.onMsgCallBack_Business);

        }
      });
       
      },

    onShow:function(){
        var that = this;
    
        this.setData({
          markers: [],
          center: []
        });
      GMAPI.doSendMsg('api/merchants/index', { x_y: wx.getStorageSync('getLocation').lon + ',' + wx.getStorageSync('getLocation').lat }, 'GET', that.onMsgCallBack_Business);

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
                markers:markers,
              center: [wx.getStorageSync('getLocation').lon, wx.getStorageSync('getLocation').lat]
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }

    },


  golist: function (e) {
      var index=e.currentTarget.dataset.index;
      if(parseInt(index)==0){
          wx.navigateTo({
              url: '/pages/business_list_s/business_list_s'
          })
      }else{
          wx.navigateTo({
              url: '/pages/business_list/business_list'
          })
      }

  },
    jump:function (e) {
        var url=e.currentTarget.dataset.url;
        wx.reLaunch({
            url: url
        })
    }
})
