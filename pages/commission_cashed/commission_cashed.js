// pages/commission_cashed/commission_cashed.js
import GMAPI from "../../utils/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      money:0,
      total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '佣金提现'
    });
    this.setData({
        money:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
    getFocus: function (e) {
        this.setData({
            total: e.detail.value
        });
    },
    onWithdrawDeposit :function (e) {
    var that=this;
    if(that.data.money<that.data.total){
        wx.showToast({
            title:'输入的提现金额不能大于可提现金额',
            icon:'none',
            duration: 2000
        });
    }else if(that.data.total==0) {
        wx.showToast({
            title:'输入的提现金额不能大于可提现金额',
            icon:'none',
            duration: 2000
        });
    }else{
        GMAPI.doSendMsg('api/cash/cashAdd',{uid:wx.getStorageSync('strWXID').strUserID, cash_value:that.data.total}, 'POST',that.onMsgCallBack_WithdrawDeposit);
    }

    },
    onMsgCallBack_WithdrawDeposit:function (jsonBack){
        var data=jsonBack.data;
        // console.log(jsonBack)
        var that=this;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
});