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
    address_Code:0
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
      console.log(cityData[val[0]].code)


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
    console.log(val)
    if (val[1] != t[1]) {
      const countys = [];
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }
        console.log(cityData[val[0]].code)
        console.log(cityData[val[0]].sub[val[1]].code)
      this.setData({
          address_Code:cityData[val[0]].code,
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
            // console.log(cityData[val[0]].code)
            code=cityData[val[0]].sub[0].sub[val[2]].code;
        }else if(parseInt(cityData[val[0]].code)==120000){
            // console.log(cityData[val[0]].code)
            code=cityData[val[0]].sub[0].sub[val[2]].code;
        }else if(parseInt(cityData[val[0]].code)==310000){
            // console.log(cityData[val[0]].code)
            code=cityData[val[0]].sub[0].sub[val[2]].code;
        }else if(parseInt(cityData[val[0]].code)==500000){
            // console.log(cityData[val[0]].code)
            code=cityData[val[0]].sub[0].sub[val[2]].code;
        }else{
            // console.log(cityData[val[0]].code)
            // console.log(cityData[val[0]].sub[val[1]].code)
            code=cityData[val[0]].sub[val[1]].sub[val[2]].code;
        }
      this.setData({
        address_Code:code,
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
  onLoad: function () {
    console.log("onLoad");
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

})