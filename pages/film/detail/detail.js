// detail.js
var title = "";
var blooper_urls = [];
var urls = [];
Page({
  data: {
    hideText: true,
    hideClass: 'up'
  },
  //分享当前页面
  onShareAppMessage: function () {
    return {
      title: title,
      path: '/pages/film/detail/detail',
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
  onLoad(params) {
    const that = this;
    const id = params.id,
      url = 'https://douban.uieee.com/v2/movie/subject/' + id
    console.log(id)
    wx.request({
      url: url,
      data: {},
      header: {
        "Content-Type": "json"
      },
      success(res) {
        console.log(res);
        let detail = res.data
        title = detail.title
        let photos_url = detail.photos;
        console.log(photos_url);
        urls = []
        for (let i = 0; i < photos_url.length; i++) {
          urls.push(photos_url[i].thumb);
        }
        that.setData({
          detail: detail,
          title: title,
          urls: urls
          //comment: comment
        });

      }
    })
    //<!-- 腾讯视频播放插件-->
    //const TxvContext = requirePlugin("tencentVideo");
    //let txvContext = TxvContext.getTxvContext('txv1');
    //txvContext.play(); //播放
  },
  toggleText() {
    let hideText = this.data.hideText,
      hideClass = this.data.hideClass == 'up' ? 'down' : 'up';
    this.setData({
      hideText: !hideText,
      hideClass: hideClass
    })
  },
  userDetail: function (event) {
    //console.log(event);
    //console.log(event.currentTarget.dataset.index);
    const name = event.currentTarget.dataset.name;
    const image = event.currentTarget.dataset.image;
    wx.navigateTo({
      url: '../user/user?name=' + name + '&image=' + image
    })
  },
  bofang: function (event) {
    //console.log(event);
    //console.log(event.currentTarget.dataset.title);
    const id = event.currentTarget.dataset.id;
    const title = event.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../video2/video2?id=' + id + '&title = ' + title
    })
  },
  // -------- 点击图片放大 保存 -------
  previewImage: function (e) {
    var that = this
    console.log(e);
    const thumb = e.currentTarget.dataset.thumb;

    //urls.push(e.currentTarget.dataset.medium);
    //urls.push(thumb);
    console.log(urls);
    wx.previewImage({
      current: thumb,
      urls: urls
      // urls必须是数组 不然会报错  
    })
  },    
  modalcnt:function(){
    wx.showModal({
      title: '评分详情：',
      content: '1星：25689人</br>2星：25689人',
      cancel:'',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //打开评分详情
  showRule: function () {
    this.setData({
      isRuleTrue: true
    })
  },
  //关闭评分详情
  hideRule: function () {
    this.setData({
      isRuleTrue: false
    })
  },
  moreComments: function (event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../comments/comments?id=' + id
    })
  },
  morePhoto: function (event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../photo/photo?id=' + id
    })
  }

})