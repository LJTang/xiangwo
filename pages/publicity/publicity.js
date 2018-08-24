//index.js
//获取应用实例
const app = getApp()

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
})
