// detail.js
//获取应用实例
const app = getApp()
var next_start = 0;//起始位置
var pageNum = 20;//起始页个数
var isload = true;//是否显示加载更多
var comp = false;//加载完成
var detail = [];//所有数据
var sum = 999;//加载次数
var num = 0;
var id = "";
Page({
  data: {
    hideText: true,
    hideClass: 'up'
  }, 
  onLoad: function (params) {
    console.log('onLoad')
    const that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        params: params
      })
    });

    wx.getSystemInfo({
      success(res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
        console.log(res.windowHeight)
      }
    })

    this.loadComment(params, pageNum);
  },

  // 滑动到底部，加载更多
  lower(e, params, id) {
    //next_start = next_start + pageNum;
    if (isload) {
      this.loadComment(params, pageNum);
    }
    if (num == sum) {
      isload = false
      comp = true
      this.setData({
        detail: detail,
        loading: isload,
        completed: comp
      });
    }
    num++;

  },
  //滑动到头部
  bindscrolltoupper(e) {
    console.log(e)
  },
  //加载电影
  loadComment(params,pageNum) {
    const that = this;
    if (id == ""){
      id = params.id;
    }
    const url = 'https://douban.uieee.com/v2/movie/subject/' + id + '/reviews'
    wx.request({
      url: url,
      data: {
        start: next_start,
        count: pageNum
      },
      header: {
        "Content-Type": "json"
      },
      success(res) {
        //detail = res.data;
        next_start = res.data.next_start;//所有数据总条数
        let data = res.data.reviews;
        for (let i = 0; i < data.length; i++) {
          detail.push(data[i]);
        }
        that.setData({
          detail: detail,
          id: id,
          next_start: next_start,
          loading: isload
        });

      }
    })
  },
  toggleText(event) {
    const showId = event.currentTarget.dataset.id;
    var aaa = "hideClass" + showId;
    console.log("-------aaa-------" + aaa);
    console.log("-------this.data.hideClass + showId-------" + this.data.aaa);
    let hideText = this.data.hideText,
      hideClass = this.data.aaa == 'up' ? 'down' : 'up';
    this.setData({
      hideText: !hideText,
      changeHideClass: hideClass
    })
  }
})