import GMAPI from "../../utils/api";

var tcity = require("../../utils/citys.js");
var app = getApp()
Page({
  data: {
    provinces: [],
    province: "请选择地址",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [],
    values: [],
    condition: false,
    address_Code:0,
      address_id:'',
      name:'',
      phone:'',
      address_val:''
  },
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
          address_Code:cityData[val[0]].code+','+cityData[val[0]].sub[val[1]].code+','+cityData[val[0]].sub[val[1]].sub[val[2]].code,
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
      const countys = [];
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }
        console.log(cityData[val[0]].code)
        console.log(cityData[val[0]].sub[val[1]].code)
        console.log(cityData[val[0]].sub[val[1]].sub[val[2]].code)
      this.setData({
          address_Code:cityData[val[0]].code+','+cityData[val[0]].sub[val[1]].code+','+cityData[val[0]].sub[val[1]].sub[val[2]].code,
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      });
      return;
    }
    if (val[2] != t[2]) {
      var code=0;
        if(parseInt(cityData[val[0]].code)==110000){
            code=cityData[val[0]].sub[0].sub[val[2]].code;
        }else if(parseInt(cityData[val[0]].code)==120000){
            code=cityData[val[0]].sub[0].sub[val[2]].code;
        }else if(parseInt(cityData[val[0]].code)==310000){
            code=cityData[val[0]].sub[0].sub[val[2]].code;
        }else if(parseInt(cityData[val[0]].code)==500000){
            code=cityData[val[0]].sub[0].sub[val[2]].code;
        }else{
            code=cityData[val[0]].sub[val[1]].sub[val[2]].code;
        }
      this.setData({
        address_Code:cityData[val[0]].code+','+cityData[val[0]].sub[val[1]].code+','+cityData[val[0]].sub[val[1]].sub[val[2]].code,
        county: this.data.countys[val[2]],
        values: val
      });
      return;
    }


  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  onLoad: function (option) {
      console.log(option.id)
    if(option.id==''){
        this.setData({
            address_id:''
        })
    }else{
        this.setData({
            address_id:option.id,
            name:option.name,
            phone:option.phone,
            province:option.province,
            city:option.city,
            county:option.district,
            address_val:option.value
        })
    }

    var that = this;
    tcity.init(that);
    var cityData = that.data.cityData;

    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    // console.log('省份完成');
    //省份
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    // console.log('city完成');
    //city
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      
    })
  },

    add_Address:function (e) {
    var that=this;
        if(e.detail.value.userName==''){
            wx.showToast({
                title: '店铺老板名称不能为空',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.phone.length!=11||e.detail.value.phone==''||GMAPI.checkPhone(e.detail.value.phone)==false){
            wx.showToast({
                title: '请输入正确的密码',
                icon: 'none',
                duration: 2000
            });
        }else if(that.data.province==''){
            wx.showToast({
                title: '请选择地址',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.address_value==''){
            wx.showToast({
                title: '请输入详细地址',
                icon: 'none',
                duration: 2000
            });
        }else{
          if(that.data.address_id==''){
              GMAPI.doSendMsg('api/user/userAddressAdd',{uid:wx.getStorageSync('strWXID').strUserID,username:e.detail.value.userName,phone:e.detail.value.phone,address_id:that.data.province+','+that.data.city+','+that.data.county,address_value:e.detail.value.address_value},'POST',that.onMsgCallBack_AddressOK);
          }else{
              GMAPI.doSendMsg('api/user/userAddressEdit',{id:that.data.address_id,uid:wx.getStorageSync('strWXID').strUserID,username:e.detail.value.userName,phone:e.detail.value.phone,address_id:that.data.province+','+that.data.city+','+that.data.county,address_value:e.detail.value.address_value},'POST',that.onMsgCallBack_AddressOK);
          }

        }
    },
    onMsgCallBack_AddressOK:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });

              setTimeout(function () {
                  wx.navigateBack({
                      delta: 1
                  },2000)
              })


        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },

});