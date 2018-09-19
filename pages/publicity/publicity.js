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
    xwURL:'',
    height:'',
    cat_list:[],
    all_list:[],
    classifySeleted:0,
    seletedText:'全部类型'
  },
    onLoad:function(){
      var that=this;
        wx.getSystemInfo({
            success: function(res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height:res.windowHeight-(rpx*122)
                });
            }
        });
    },
    // http://xiao.guangzhoubaidu.com/api/exhibition/exhiSearch?search=%E5%AE%A3
    onShow:function(){
        var that=this;
        // GMAPI.doSendMsg('api/exhibition/index',{type:4,share:''},'GET',that.onMsgCallBack_Train);
        GMAPI.doSendMsg('api/exhibition/cat_list','','GET',that.onMsgCallBack_Train);
        // http://xiao.guangzhoubaidu.com/api/Exhibition/art_list
        GMAPI.doSendMsg('api/Exhibition/art_list',{cat_id:''}, 'POST', that.onMsgCallBack_allList);
    },
    onMsgCallBack_allList: function (jsonBack) {
        var goods=[];
        var list=jsonBack.data.data;
        for(var i=0;i<list.length;i++){
            goods.push(list[i]);
        }
        if(list.length>0){
            this.setData({
                len_Bool:true
            });
        }else{
            this.setData({
                len_Bool:false
            });
        }
        this.setData({
            xwURL:jsonBack.data.url,
            all_list:goods
        })
    },
    getFocus: function (e) {
        this.setData({
            search_Text: e.detail.value,
            brochure:[]
        });
        var that=this;
        GMAPI.doSendMsg('api/exhibition/exhiSearch',{search:e.detail.value}, 'GET',that.onMsgCallBack_Train);
    },
    clearInput: function (){
        this.setData({
            search_Text:'',
            brochure:[]
        });
    },
    //  搜索
    onSearch:function(e){
        var that=this;
        this.setData({
            search_Text: e.detail.value,
            brochure:[]
        });
        GMAPI.doSendMsg('api/exhibition/exhiSearch',{search:e.detail.value}, 'GET',that.onMsgCallBack_Train);
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

    onMsgCallBack_Train:function (jsonBack){
        var data=jsonBack.data;
        var that=this;
        if(data.code==200){
            if(data.data.length==0){
                this.setData({
                    cat_list :[]
                })
            }else{
                var goods=[];
                var list=data.data;
                for(var i=0;i<list.length;i++){
                    goods.push(list[i]);
                }
                this.setData({
                    cat_list:goods
                })
            }

        }else{
            this.setData({
                cat_list :[]

            })
        }
    },
    tapClassify: function (e) {
        var id =e.currentTarget.dataset.id;
        var index =e.currentTarget.dataset.statu;
        var text =e.currentTarget.dataset.text;
        this.setData({
            classifySeleted:index,
            seletedText:text,
            listID:id,
            all_list:[]
        });
        GMAPI.doSendMsg('api/Exhibition/art_list',{cat_id:id}, 'POST', that.onMsgCallBack_allList);
    },

});
