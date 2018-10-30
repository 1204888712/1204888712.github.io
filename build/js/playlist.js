(function($,root){
    var $scope = $(document.body);
    var control;
    var $playList = $("<div class = 'play-list'>"+
        "<div class='play-header'>播放列表</div>" + 
        "<ul class = 'list-wrapper'></ul>" +
        "<div class='close-btn'>关闭</div>"+
    "</div>") 
    //渲染我们的播放列表dom
    function renderList(songList){
        var html = '';
        for(var i = 0;i < songList.length;i++){
            html += "<li><h3 >"+songList[i].song+"-<span>"+songList[i].singer+"</span></h3></li>"
        }
        $playList.find("ul").html(html);
        $scope.append($playList);
        bindEvent();
    }  

    // 控制是否展示选项页面，及标亮当前歌曲
    function show(controlmanager){
        control = controlmanager;
        $playList.addClass("show");
        signSong(control.index);
    }

    // 时间绑定，关闭事件及选择事件
    function bindEvent(){
        // ************
        $playList.on("click",".close-btn",function(){

            $playList.removeClass("show")
        })
        // ************
        $playList.find("li").on("click",function(){
            // 获取当前元素在兄弟中的位置
            var index = $(this).index();
            signSong(index);
            control.index = index;
            root.pro.stop();
            $scope.trigger("play:change",index);
            // $scope.trigger("play:change",[index,true]);
            // $scope.find(".play-btn").addClass("playing");


            // if(window.player.audio.status == 'play'){
                
            //     root.pro.start(0);
            // }else{
            //     // root.pro.stop()
            //     root.pro.update(0);            
            // }
            setTimeout(function(){
                $playList.removeClass("show")
                console.log(window.player.audio.status)
            }, 200);
        })
    }

    function signSong(index){
        $playList.find(".sign").removeClass("sign");
        $playList.find("ul li").eq(index).addClass("sign");
    }

    root.playList = {
        renderList : renderList,
        show : show
    }
})(window.Zepto,window.player || (window.player = {}))