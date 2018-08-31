import GMAPI from "../../utils/api";

var tcity = require("../../utils/citys.js");
var app = getApp()
Page({
  data: {
    search_Text:'',
    provinces: [],
    province: "请选择地址",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [],
    values: [],
    condition: false,
    search_Bool: false,
    form_Bool: true,
    goods_id:''

  },
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  onLoad: function (option) {
    var that = this;
      this.setData({
          goods_id:option.id,
      });
    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      
    })
  },
    // 显示输入信息
    onToggle: function (e) {
        this.setData({
            search_Bool: true,
            form_Bool: false
        });
    },

    getFocus: function (e) {
        this.setData({
            search_Text: e.detail.value
        });
        var that=this;
        console.log(e.detail.value)
        // GMAPI.doSendMsg('api/merchants/merchantsList',{seach_name:e.detail.value}, 'GET',that.onMsgCallBack_BusinessList);
    },
    clearInput: function (){
        this.setData({
            search_Text:'',
        });
    },
    //  搜索
    onSearch:function(){
        var that=this;
        GMAPI.doSendMsg('api/merchants/merchantsList',{seach_name:that.data.search_Text}, 'GET',that.onMsgCallBack_BusinessList);
    },
    onMsgCallBack_BusinessList: function (jsonBack) {
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
    //选择位置位置
    chooseLocation:function(e){
        var that=this
        wx.chooseLocation({
            success: function(res){
                console.log(res)
                that.setData({
                    address:res.name,
                    d_address:res.address,
                    hasLocation:true,
                    location:{
                        longitude:res.longitude,
                        latitude:res.latitude
                    }
                })
            },
            fail: function() {

            },
            complete: function() {

            }
        })
    },

    //  提交
    submitData:function (e) {
        var that=this;
        if(e.detail.value.m_name==''){
            wx.showToast({
                title: '店铺老板名称不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.m_phone.length!=11||e.detail.value.m_phone==''||GMAPI.checkPhone(e.detail.value.m_phone)==false){
            wx.showToast({
                title: '请输入正确的密码',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.m_openid==''){
            wx.showToast({
                title: '店铺老板微信不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.m_store_name==''){
            wx.showToast({
                title: '店铺名称不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.m_address==''){
            wx.showToast({
                title: '店铺地址不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.m_address_detailed==''){
            wx.showToast({
                title: '店铺详细地址不能为空',
                icon: 'none',
                duration: 2000
            });
        }else{
            var json={uid:wx.getStorageSync('strWXID').strUserID,m_name:e.detail.value.m_name,m_phone:e.detail.value.m_phone,m_openid:e.detail.value.m_openid,m_product_id:that.data.goods_id,m_store_name:e.detail.value.m_store_name,m_address:e.detail.value.m_address,m_address_x:that.data.location.longitude,m_address_y:that.data.location.latitude,m_address_detailed:e.detail.value.m_address_detailed};
            console.log(json)
            // verification/merchantRegister
            GMAPI.doSendMsg('api/verification/merchantRegister',json,'POST',that.onMsgCallBack_SubmitData);
        }
    },
    onMsgCallBack_SubmitData:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            setTimeout(function () {
                wx.navigateBack({
                    delta:1
                })
            },2000)
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },

    //  审核 审核中
    onAudit :function(e){
        var that=this;
        GMAPI.doSendMsg('api/verification/merchantSearch',{uid:wx.getStorageSync('strWXID').strUserID,id:e.currentTarget.dataset.id,m_product_id:that.data.goods_id}, 'POST',that.onMsgCallBack_Audit);
    },
    onMsgCallBack_Audit: function (jsonBack) {
        var data=jsonBack.data;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });

            setTimeout(function () {
                wx.reLaunch({
                    url: '/pages/my/my'
                })
            },2000)
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }

    }
});