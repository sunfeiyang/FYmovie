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
var userdetail = [];//存储用户信息
var userdetail_name = "";//存储用户姓名
var userdetail_image = "";//存储用户图片
var params = "";
var more = false;//是否属于下拉加载更多
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
      title: userdetail[0],
      //title: getTitle(menuName),
      path: '/pages/film/user/user',
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
  onLoad: function (params) {
    console.log('onLoad')
    const that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
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

    this.loadFilms(pageNum, params, userdetail[0], userdetail[1]);
  },

  // 滑动到底部，加载更多
  lower(e) {
    console.log("******sum******" + sum);
    console.log("******num******" + num);
    console.log("******isload******" + isload);
    start = start + pageSize;
    if (isload) {
      this.loadFilms(pageNum, params, userdetail[0], userdetail[1]);
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
  bindscrolltoupper(e) {
    console.log(e)
  },
  //加载电影
  loadFilms(pageNum, params, userdetail_name, userdetail_image) {
    more = false
    userdetail = [];//加载前先清空原数据
    const that = this;
    let id = params.name;
    let image = params.image;
    console.log(params);
    //如果是初始化访问数据则将其实位置归0
    if (id == undefined) {
      more = true
      console.log("-----------下拉----------" + more)
      userdetail.push(userdetail_name);
      userdetail.push(userdetail_image);
      id = userdetail_name;
      image = userdetail_image;
    }else{
      isload = true
      more = false
      start = 0
      num = 2
      films = [];
    }
    userdetail.push(id);
    userdetail.push(image);
    console.log("id------------"+id);
    console.log(image);
    console.log(userdetail)
    wx.request({
      url: 'https://douban.uieee.com/v2/movie/search',
      data: {
        q: id,
        start: start
      },
      header: {
        "Content-Type": "json"
      },
      success(res) {
        urls = []
        let data = res.data.subjects;
        if (more) {
          for (let i = 0; i < data.length; i++) {
            films.push(data[i]);
          }
        }else{
          films = data
        }
        total = res.data.total;//所有数据总条数
        sum = Math.ceil(total / pageSize);//加载次数
        that.setData({
          films: films,
          total: total,
          loading: isload,
          completed: comp,
          sum: sum,
          userdetail: userdetail,
          id: id,
          image: image,
          urls: urls
        });
      },
      fail: function (e) {
        console.log("******error******: ", e);
      },
      complete: function (e) {
        console.log("******请求完成****** ", e);
        
      }
    })
  },
  bindDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },
  // -------- 点击图片放大 保存 -------
  userdetailImage: function (e) {
    var that = this
    //console.log(e);
    const img = userdetail[1];
    var urls = []
    //urls.push(e.currentTarget.dataset.medium);
    urls.push(img);
    wx.previewImage({
      current: img,
      urls: urls
      // urls必须是数组 不然会报错  
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
