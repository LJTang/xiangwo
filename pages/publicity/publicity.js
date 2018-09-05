//index.js
//获取应用实例
import GMAPI from "../../utils/api";
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();

Page({
  data: {
    filterdata: {},  //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null,
    cate:[
      { title: "视频" },{ title: "图文" },{ title: "文章" }
    ],
    area: [
      { name: "共享产品" }, { name: "非共享产品" }
    ],
    brochure:[],
    replyTemArray:[],
    xwURL:''
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
    onShow:function(){
        var that=this;
        GMAPI.doSendMsg('api/exhibition/index',{type:4,share:''},'GET',that.onMsgCallBack_Train);
/*********

*********/

    },
    onMsgCallBack_Train:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        if(data.code==200){
            if(data.data.length==0){
                this.setData({
                    brochure :[]
                })
            }else{
                var goods=[];
                var list=data.data;
                var arr='';

                for(var i=0;i<list.length;i++){

                    // WxParse.wxParse('reply' + i, 'html', list[i].art, that);
                    // if (i === list.length - 1) {
                    //   WxParse.wxParseTemArray("replyTemArray",'reply', list.length, that)
                    // }

                    goods.push(list[i]);
                }
                this.setData({
                    brochure :goods,
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
    }

});
