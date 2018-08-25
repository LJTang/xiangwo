var app = getApp()
Page({
  data: {},
    onMakePhoneCall:function (){
        var that=this;
        wx.makePhoneCall({
            phoneNumber:'18988936665'
        })
    },

})