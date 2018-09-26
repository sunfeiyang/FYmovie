//index.js
//获取应用实例
const app = getApp()
var start = 0;//起始位置
var pageNum = 20;//起始页个数
var pageSize = 20;//下拉刷新增加的个数
var total = 0;//数据总数
var isload = true;//是否显示加载更多
var comp = false;//加载完成
var num = 2;//加载次数
var films = [];//所有数据
var sum = 999;//所有数据
var urls = [];
Page({
    data: {
      films: films,
      loading: isload,
      comp: comp,
  },
  //分享当前页面
  onShareAppMessage: function () {
    return {
      //title: getTitle(menuName),
      title: "即将上映",
      path: '/pages/upcoming/film/film',
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
      console.log("******sum******" + sum);
      console.log("******num******" + num);
      console.log("******isload******" + isload);
      start = start + pageSize;
      if (isload) {
        this.loadFilms(pageNum);
      }
      if (num == sum) {
        isload = false
        comp = true
        this.setData({
          films: films,
          loading: isload,
          completed: comp
        });
      }
      num++;
      
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
          url: 'https://douban.uieee.com/v2/movie/coming_soon',
          data: {
            start: start,
            count: pageNum
          },
          header: {
            "Content-Type": "json"
          },
          success(res) {
            urls = []
            let data = res.data.subjects;
            //console.log("******data.size******: " + data.length);
            for (let i = 0; i < data.length; i++) {
              //console.log("******data[i]******: " + data[i]);
              //films.join(data[i]);
              films.push(data[i]);
              //console.log("******films******: " + films);
            }
            //console.log("******data******: " + data);
            //films.join(data);
            //console.log("******films******: " + films);
            //let films = res.data.subjects; 
            total = res.data.total;//所有数据总条数
            sum = Math.ceil(total / pageSize);//加载次数
            that.setData({
              films: films,
              total: total,
              loading: isload,
              completed: comp,
              sum: sum,
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
        wx.navigateTo({
            url: '../detail/detail?id=' + id
        })
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
