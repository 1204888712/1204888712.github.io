(function ($, root) {
    // 进度条模块  渲染左右时间  更新进度条
    var duration;
    var frameId = null;
    var lastPer = 0;
    var startTime;
    // 渲染总时间
    function updateLastPer(){
        // lastPer = 0;
        cancelAnimationFrame(frameId);
    }
    function renderAllTime(time) {
        duration = time;
        // 每次切换重置lastPer
        lastPer = 0;
        time = formatTime(time);
        $('.all-time').html(time);
    }
    // 处理时间格式   秒--分+':' + 秒
    function formatTime(t) {
        t = Math.round(t);
        var m = Math.floor(t / 60);
        var s = t - m * 60;
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        return m + ':' + s;
    }
    
    // 渲染左侧时间
    function start(p) {
        // 如果没有传入值则使用保存的上次播放时间，
        lastPer = p === undefined ? lastPer : p;
        // 获取开始时间
        startTime = new Date().getTime();
        function frame() {
            // 获取当前时间
            var curTime = new Date().getTime();
            // 获取当前百分比
            var per = lastPer + (curTime - startTime) / (duration * 1000);
            update(per);
            // 每次显示器刷新前执行当前函数
            frameId = requestAnimationFrame(frame);
        }
        // 函数启动
        frame();
    }
    // 更新html(css样式)
    function update(p) {
        var time = p * duration;
        time = formatTime(time);
        $('.cur-time').html(time);
        // 进度条css
        var perX = (p - 1) * 100 + '%';
        $('.pro-top').css({
            transform: 'translateX(' + perX + ')'
        })
    }
    // 停止更新
    function stop() {
        var stopTime = new Date().getTime();
        // 取消刷新事件监听
        if(frameId){
            cancelAnimationFrame(frameId);
        }
        
        // 更新最后的百分比
        lastPer = lastPer + (stopTime - startTime) / (duration * 1000);
    }
    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        update:update,
        updateLastPer
    }


})(window.Zepto, window.player || (window.player == {}));