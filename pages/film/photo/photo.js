// detail.js
//获取应用实例
const app = getApp()
var next_start = 20;//起始位置
var pageNum = 20;//起始页个数
var isload = true;//是否显示加载更多
var comp = false;//加载完成
var detail = [];//所有数据
var sum = 999;//加载次数
var num = 2;
var id = "";
var urls = [];
Page({
  data: {
    id: id,
    detail: detail,
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

    this.loadPhoto(params, pageNum);
  },

  // 滑动到底部，加载更多
  lower(e, params, id) {
    next_start = next_start + pageNum;
    console.log("next_start------" + next_start);
    console.log("sum------" + sum);
    console.log("isload------" + isload); 
    if (isload) {
      this.loadPhoto(params, pageNum);
    }
    if (next_start >= sum) {
      isload = false
      comp = true
      this.setData({
        loading: isload,
        completed: comp
      });
    }
  },
  //滑动到头部
  bindscrolltoupper(e) {
    console.log(e)
  },
  //加载电影
  loadPhoto(params, pageNum) {
    const that = this;
    if (params != "" && params != undefined) {
      detail = [];//加载前先清空原数据
      next_start = 20;
      id = params.id;
    }else{
      id = id;
    }
    const url = 'https://douban.uieee.com/v2/movie/subject/' + id + '/photos'
    wx.request({
      url: url,
      data: {
        count: next_start
      },
      header: {
        "Content-Type": "json"
      },
      success(res) {
        console.log("success")
        //detail = res.data;
        let data = res.data.photos;
        for (let i = detail.length; i < data.length; i++) {
          detail.push(data[i]);
        }
        urls = []
        for (let i = 0; i < detail.length; i++) {
          urls.push(detail[i].image);
        }
        let num_sum = data.length;
        that.setData({
          detail: detail,
          id: id,
          urls: urls, 
          loading: isload,
          sum: num_sum
        });
      }
    })
  },
  // -------- 点击图片放大 保存 -------
  previewImage: function (e) {
    var that = this
    console.log(e);
    const image = e.currentTarget.dataset.image;
    console.log(urls);
    wx.previewImage({
      current: image,
      urls: urls
      // urls必须是数组 不然会报错  
    })
  }
})