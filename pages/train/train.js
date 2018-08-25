//index.js
//获取应用实例
import GMAPI from "../../utils/api";

const app = getApp()

Page({
  data: {
    filterdata: {},  //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null,
      full_Bool:true,
      d_index:null,
    mask_box:true,
    cate: [
      { title: "视频" }, { title: "图文" }, { title: "文章" }
    ],
    area: [
      { name: "共享产品" }, { name: "非共享产品" }
    ],
      xwURL:'',
      article:'',

      cateindex:'',
      areaindex:'',
  },
    onLoad:function(){
        var that=this;
        // GMAPI.doSendMsg('api/user/userInfo',{uid:wx.getStorageSync('strWXID').strUserID},'GET',that.onMsgCallBack_UserInfo);
    },
    onShow:function(){
        var that=this;
        GMAPI.doSendMsg('api/exhibition/index',{type:that.data.cateindex,share:that.data.areaindex},'GET',that.onMsgCallBack_Train);
    },
    onMsgCallBack_Train:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        if(data.code==200){
            if(data.data.length==0){
                this.setData({
                    article :[]
                })
            }else{
                var goods=[];
                var list=data.data;
                var arr='';
                for(var i=0;i<list.length;i++){
                    // list[i].splice(i,0,{selected:true});
                    // console.log(list)
                    goods.push(list[i]);
                }
                console.log(goods)
                this.setData({
                    article :goods,
                    xwURL:jsonBack.data.Https
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
    });
    console.log(dataset.cateindex)
      var that=this;
      GMAPI.doSendMsg('api/exhibition/index',{type:dataset.cateindex,share:that.data.areaindex},'GET',that.onMsgCallBack_Train);
  },
  setAreaIndex: function (e) { //地区一级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      areaindex: dataset.areaindex,
      showfilter: false,
      showfilterindex: null
    });
      var that=this;
      GMAPI.doSendMsg('api/exhibition/index',{type:that.data.cateindex,share:dataset.areaindex},'GET',that.onMsgCallBack_Train);

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
  },
    full:function (e) {
       var dataset=e.currentTarget.dataset;
       var list=this.data.article;
       for(var i=0;i<list.length;i++){
           if(i==parseInt(dataset.index)){
               list[i].selected=true;
               list[i].active=false;
           }
       }

        this.data.article=[];
       this.setData({
           article:list
       });
    },
    fewer:function (e) {
        var dataset=e.currentTarget.dataset;
        var list=this.data.article;
        for(var i=0;i<list.length;i++){
            if(i==parseInt(dataset.index)){
                list[i].selected=false;
                list[i].active=true;
            }
        }

        this.data.article=[];
        this.setData({
            article:list
        });
    }
})