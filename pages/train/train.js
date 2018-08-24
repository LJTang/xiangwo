//index.js
//获取应用实例
import GMAPI from "../../utils/api";

const app = getApp()

Page({
  data: {
    filterdata: {},  //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null,
    mask_box:true,
    cate: [
      { title: "视频" }, { title: "图文" }, { title: "文章" }
    ],
    area: [
      { name: "共享产品" }, { name: "非共享产品" }
    ],
  },
    onLoad:function(){
        var that=this;
        // GMAPI.doSendMsg('api/user/userInfo',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_UserInfo);
    },
    onShow:function(){
        var that=this;
        GMAPI.doSendMsg('api/exhibition/index',{type:0},'GET',that.onMsgCallBack_Train);
    },
    onMsgCallBack_Train:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        console.log(data.data.type,data.data.type_status)
        if(data.code==200){
            if(data.data.type==0){
                this.setData({
                    info:data.data,
                    user_View:false,
                    business_View: true
                })
            }else if(data.data.type==2&&data.data.type_status==2){
                this.setData({
                    user_View:true,
                    business_View: false
                });
                GMAPI.doSendMsg('api/user/myTeam',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_myTeam);
            }else{
                this.setData({
                    info:data.data,
                    user_View:false,
                    business_View: true
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
  setFilterPanel: function (e) { //展开筛选面板
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if (d.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
      })
    }
    console.log('显示第几个筛选类别：' + d.showfilterindex);
  },
  setCateIndex: function (e) { //分类一级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      cateindex: dataset.cateindex,
      showfilter: false,
      showfilterindex: null
    })
  },
  setAreaIndex: function (e) { //地区一级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      areaindex: dataset.areaindex,
      showfilter: false,
      showfilterindex: null
    })
  },
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  bindPlay: function () {
    this.videoContext.play();
    this.setData({
      mask_box: false
    })
  },
  stop:function(){
    this.setData({
      mask_box: true
    })
  }
})
