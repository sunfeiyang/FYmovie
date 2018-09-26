//index.js
//获取应用实例
const app = getApp()
var video_list = []
var video_first = ""
Page({
  data: {

  },
  //分享当前页面
  onShareAppMessage: function () {
    return {
      //title: getTitle(menuName),
      title: "预告片",
      path: '/pages/film/video/video',
      success: function (res) {
        // 分享成功,
        wx.showToast({
          title: '分享成功',
          icon:'success',
          duration:1000
        })
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  onLoad: function (params) {
    const that = this
    const id = params.id; 
    console.log(id);
    let url = 'https://douban.uieee.com/v2/movie/subject/' + id
    wx.request({
      url: url,
      data: {},
      header: {
        "Content-Type": "json"
      },
      success(res) {
        video_list = [];
        video_first = "";
        console.log(res);
        let detail = res.data;
        //var clip_urls = detail.clip_urls;
        let bloopers = detail.bloopers;
        console.log(bloopers);
        for (let i = 0; i < bloopers.length; i++) {
          console.log(bloopers[i].resource_url);
          if(i == 0){
            video_first = bloopers[i].resource_url;
          }else{
            video_list.push(bloopers[i]);
          }
        } 
        //console.log(clip_urls.length);
        //for (let i = 0; i < clip_urls.length; i++) {
        //  video_first = clip_urls[0];
        //}
        console.log(video_first);
        console.log(video_list);
        that.setData({
          detail: detail,
          video_list: video_list,
          video_first: video_first
        });
      }
    })
  },
  // -------- 播放视频 -------
  playvideo: function (e) {
    var that = this
    console.log(e);
    const url = e.currentTarget.dataset.url;
    console.log(url);
    that.setData({  
      video_first: url
    });
  },
  startPlay: function (e) {
    //console.log(e)
    //获得当前选择的id
    var curVideoId = e.currentTarget.id; 
    var pauseId = "";
    var bloopers_pauseId = ""; 
    var clips_pauseId = "";
    for(var i=0;i<15;i++){
      //暂停第一个video
      var prevV_first = wx.createVideoContext("myVideo");
      prevV_first.pause()
      //暂停所有trailers中的video
      pauseId = "myVideo" + i; 
      var prevV = wx.createVideoContext(pauseId);
      prevV.pause()
      //暂停所有bloopers中的video
      bloopers_pauseId = "bloopers_myVideo" + i; 
      var bloopers_prevV = wx.createVideoContext(bloopers_pauseId);
      bloopers_prevV.pause()
      //暂停所有clips中的video
      clips_pauseId = "clips_myVideo" + i;
      var clips_prevV = wx.createVideoContext(clips_pauseId);
      clips_prevV.pause()
    }

    //播放当前选择的video
    var videoContext = wx.createVideoContext(curVideoId);
    videoContext.play();

  }
})


