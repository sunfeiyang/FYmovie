//index.js
//获取应用实例
const app = getApp()
var pageNum = 20;//起始页个数
var pageSize = 20;//下拉刷新增加的个数
var total = 0;//数据总数
var isload = true;//是否显示加载更多
var jiazai = true;//加载时机
var comp = false;//加载完成
var urls = [];

Page({
    data: {
      films: [],
      loading: isload,
      comp: comp,
      findInput: '',

  },
  //获取搜索框中的内容
  findInput: function (e) {
    this.setData({
      findInput: e.detail.value
    })
  },
  //find
  findClick: function (e) {
    console.log("输入框内容：" + this.data.findInput);
    const image = ''
    wx.navigateTo({
      url: 'find/find?name=' + this.data.findInput + '&image=' + image
    })
  },
  //分享当前页面
  onShareAppMessage: function () {
    return {
      //title: getTitle(menuName),
      title: "正在热映",
      path: '/pages/film/film',
      success: function (res) {
        // 分享成功
        wx.showToast({
          title: '分享成功',
            icon: 'success',
              duration: 1000
        })
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  onLoad: function () {
      console.log('onLoad')
      const that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function(userInfo){
          //更新数据
          that.setData({
              userInfo:userInfo
          })
      });

      wx.getSystemInfo({
          success(res){
              that.setData({
                  scrollHeight: res.windowHeight
              })
              console.log(res.windowHeight)
          }
      })

    this.loadFilms(pageNum);
  },

  // 滑动到底部，加载更多
  lower(e){
    //console.log(pageNum);
    if (total <= pageNum) {
      //console.log("******loading--false******");
      isload = false
    }else{
      //console.log("******loading--true******");
      this.setData({
        loading: isload,
        comp: comp
      })
    }
    pageNum = pageNum + pageSize
    //console.log("******jiazai******" + jiazai);
    //console.log("******pageNum******" + pageNum);
    //console.log("******isload******" + isload);
    if (jiazai) {
      this.loadFilms(pageNum)
      if (!isload) {
        jiazai = false
        loading: isload
        comp: true
        this.setData({
          comp: comp
        })
      }
    }
    
  },
  //滑动到头部
  bindscrolltoupper(e){
      console.log(e)
  },
  //加载电影
loadFilms(pageNum){
  console.log("******comp******" + comp);
      const that = this;
      wx.request({
        url: 'https://douban.uieee.com/v2/movie/in_theaters',
        data: {
          count: pageNum
        },
        header: {
          "Content-Type": "json"
        },
        success(res) {
          urls = []
          let films = res.data.subjects; 
          total = res.data.total;
          that.setData({
            films: films,
            total: total,
            loading: isload,
            completed: comp,
            urls: urls
          });
        },
        fail: function (e) {
          console.log("******error******: ", e);
        },
        complete: function (e) {
          console.log("******请求完成****** ", e);
          //this.setData({
            //last_update: result.last_update
          //});
        }
      })
  },
  bindDetail(e){
      const id = e.currentTarget.dataset.id;
    if (id != "") {
      wx.navigateTo({
        url: 'detail/detail?id=' + id
      })
    }
  },
  // -------- 点击图片放大 保存 -------
  previewImage: function (e) {
    var that = this
    //console.log(e);
    const small = e.currentTarget.dataset.small; 
    var urls = []
    //urls.push(e.currentTarget.dataset.medium);
    urls.push(e.currentTarget.dataset.large); 
    wx.previewImage({
      current: small,
      urls: urls
      // urls必须是数组 不然会报错  
    })
  }
})
