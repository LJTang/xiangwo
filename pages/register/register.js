import GMAPI from "../../utils/api";

var tcity = require("../../utils/citys.js");
var app = getApp()
Page({
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [],
    values: [],
    condition: false,
      countDown:180,
      codeText:'获取验证码',
      codeClick: true,
      name:'',
      phone:'',
      code:'',
      idcard:'',
      school:'',
      major:'',
      year:'',
      invite:'',
      checkboxValue:1
  },
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value;
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
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
  },
    getFocus:function (e) {
        var status=e.currentTarget.dataset.status;
        console.log(status);
        if(status==0){
            this.setData({
                name: e.detail.value,
            });
        }else if(status==1){
            this.setData({
                phone: e.detail.value,
            });
        }else if(status==2){
            this.setData({
                code: e.detail.value,
            });
        }else if(status==3){
            this.setData({
                idcard: e.detail.value,
            });
        }else if(status==4){
            this.setData({
                school: e.detail.value,
            });
        }else if(status==5){
            this.setData({
                major: e.detail.value,
            });
        }else if(status==6){
            this.setData({
                year: e.detail.value,
            });
        }else if(status==7){
            this.setData({
                invite: e.detail.value,
            });
        }else{
            this.setData({
                inputVal: e.detail.value,
            });
        }
    },
    checkboxChange: function(e) {
        this.setData({
            checkboxValue: parseInt(e.detail.value),
        });
    },
    /*****
     * 短信验证
     * ****/
    gm_SendCode: function () {
        var that=this;
        if(this.data.phone.length!=11||that.data.phone==''||GMAPI.checkPhone(that.data.phone)==false){
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration: 2000
            });
        }else{
            if(that.data.codeText=='获取验证码'||that.data.codeText=='重新获取'){
                // var strMsgSend = GCMAPI.doCreate_gcmMsg_134_GetConnect(1, this.data.phoneNumber);
                // GZK_Coder.doSendMsgWXSMA(strMsgSend, this.onMsgCallBack_134);
                that.gm_SendCode_Back();
            }
        }
    },
    gm_SendCode_Back:function (jsonBack) {
        // if(jsonBack.intSendSMSStatus==0){
        this.setData({
            codeClick: false
        });
        if (this.data.countDown<180) {
            this.setData({
                codeClick: true
            });
            return;
        }
        this.setData({
            codeText: this.data.countDown + 's'
        });
        var that=this;
        var timer=null;
        timer = setInterval(function () {
            that.data.countDown--;
            that.setData({
                codeClick: false
            });
            if (that.data.countDown <= 0) {
                that.setData({
                    codeClick: true
                });
                clearInterval(timer);
                that.data.countDown = 180;
                that.setData({
                    codeText: '重新获取'
                });
                return
            }
            that.setData({
                codeText: that.data.countDown + 's'
            })
        }, 1000);

        wx.showToast({
            title: '验证码已发送，请注意查收',
            icon: 'none',
            duration: 3000
        });

    },

    //选择日期
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        });
        var that=this;

        // GMAPI.doSendMsg('api/verification/punchLog', {uid:wx.getStorageSync('userInfo').uid,nowtime:GMAPI.doTurnTimestamp(e.detail.value)/1000},'POST',that.onMsgCallBack_Clock_Time);
    },
    onRegister:function (e) {
        var that=this;
        if(that.data.name=='') {
            wx.showToast({
                title: '请输入用户名',
                icon: 'none',
                duration: 2000
            });
        }else if(this.data.phone.length!=11||that.data.phone==''||GMAPI.checkPhone(that.data.phone)==false){
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration: 2000
            });
        }else if(e.detail.value.password==''||e.detail.value.password.length<6){
            wx.showToast({
                title: '请输入正确的密码',
                icon: 'none',
                duration: 2000
            });
        }else if(this.data.idcard==''){
            wx.showToast({
                title: '请输入身份证号',
                icon: 'none',
                duration: 2000
            });
        }else if(this.data.school==''){
            wx.showToast({
                title: '请输入学校名称',
                icon: 'none',
                duration: 2000
            });
        }else if(this.data.major==''){
            wx.showToast({
                title: '请输入专业名称',
                icon: 'none',
                duration: 2000
            });
        }else if(this.data.date==''){
            wx.showToast({
                title: '请输入入学年份',
                icon: 'none',
                duration: 2000
            });
        }else{
            // GMAPI.doTurnTimestamp(e.detail.value)/1000
            var json={uid:wx.getStorageSync('strWXID').strUserID,username:e.detail.value.user_name,phone:that.data.phone,password:e.detail.value.password,idc:that.data.idcard,school:that.data.school,school_major:that.data.major,school_time:GMAPI.doTurnTimestamp(that.data.date)/1000,sex:that.data.checkboxValue};
            // console.log(json)
            GMAPI.doSendMsg('api/verification/register',json,'POST',that.onMsgCallBack_Register);
        }
    },
    onMsgCallBack_Register:function (jsonBack){
        var data=jsonBack.data;
        if(data.code==200){
            wx.setStorage({
                key: 'xiangwo',
                data:true
            });
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            wx.navigateBack({
                delta: 1
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    }
})