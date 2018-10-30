var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var songList;
var controlmanager;
var audio = new root.audioManager();
root.audio = audio
var id = root.pro.frameId
function bindClick() {
    $scope.on("play:change", function (event, index, flag) {
        audio.setAudioSource(songList[index].audio);
        root.pro.renderAllTime(songList[index].duration);
        root.render(songList[index]);
        if (audio.status == "play" || flag) {
            
            audio.play();
            root.pro.start();
        }else{
            root.pro.update(0);            
        }
        
    })
    //移动端click有300ms延迟
    $scope.on("click", ".prev-btn", function () {
        // 先改变index值  再去触发play change
        var index = controlmanager.prev();
        root.pro.stop();
        // if(audio.status == 'play'){
        //     // audio.pause();
        //     root.pro.stop();
        //     // root.pro.start(0);
        // }else{
        //     root.pro.update(0);            
        // }
        $scope.trigger("play:change", index);
        // if(audio.status == 'play'){
        //     // audio.pause();
        //     // root.pro.stop();
        //     root.pro.start(0);
        // }else{
        //     root.pro.update(0);            
        // }
    })
    $scope.on("click", ".next-btn", function () {
        var index = controlmanager.next();
        root.pro.stop();

        $scope.trigger("play:change", index);
        // if(audio.status == 'play'){
        //     // root.pro.stop();
        //     root.pro.start(0);
        // }else{
        //     root.pro.update(0);            
        // }
    })
    $scope.on("click", ".play-btn", function () {
        if (audio.status == "play") {
            console.log(audio.status)
            audio.pause();
            // root.pro.start(0);
            root.pro.stop();
            console.log(audio.status)
            // console.log(id)
            
        } else {
            audio.play();
            root.pro.start();
            // console.log(id)
        }
        $(this).toggleClass("playing");
    })
    $scope.on("click", ".list-btn", function () {
        root.playList.show(controlmanager);
    })
};


function bindTouch(){
    var left = $('.pro-bottom').offset().left;
    var width = $('.pro-bottom').offset().width;
    
    // 小圆点上的时间
    $('.slider-point').on('touchstart',function(){
        root.pro.stop();
    }).on('touchmove',function(e){
        console.log(e)
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        // 得到百分比per
        if(per >=0 && per <= 1){
            root.pro.update(per);
        }
    }).on('touchend',function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per >= 0 && per <= 1){
            var duration = songList[controlmanager.index].duration;
            var curTime = Math.floor(per * duration);
            // 跳转歌曲时间
            // console.log(curTime)
            audio.playTo(curTime);
            // 标记当前音乐为播放
            $('.play-btn').addClass('playing');
            audio.status = 'play';
            root.pro.start(per);
        }
    })
};



function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            bindClick();
            bindTouch();
            root.playList.renderList(data);
            controlmanager = new root.controlManager(data.length);
            songList = data;
            $scope.trigger("play:change", 0);

        },
        error: function () {
            console.log("error")
        }
    })
   
}

getData("../mock/data.json")
