/**
 * Created by zenaro on 16-4-2.
 */
define([
    {
        name: 'Love is blue',
        master: '理查德·克莱德曼',
        src: 'http://m2.music.126.net/WbUb9IhcGl58EFfChcVd-Q==/5639395138953449.mp3'
    },
    {
        name: '鸟之诗',
        master: 'V.A.',
        src: 'http://120.198.244.56:9999/m2.music.126.net/Zaz9AHLJppSjeLM-78Akig==/6040716883451498.mp3'
    },
    {
        name: 'V.A.~勿念他归-千本樱',
        master: 'V.A.',
        src: 'http://120.198.244.44:9999/m2.music.126.net/hvTY_PDCMhEbEMh4TfxqiA==/5931865231944544.mp3'
    }
]);
/**
 * Created by zenaro on 16-4-2.
 */

if(document.attachEvent) {
    alert("这个例子不支持 Old IE 哦");
}

define(function (require) {

    var json = require('./data');
    var Player = require('./player');
    var p = new Player(json);
    p.render();

});
/**
 * Created by zenaro on 16-4-2.
 */
define(function (require, exports, module) {

    function Player(json) {
        this.global = null;     // 祖先元素
        this.audio = null;      // audio对象
        this.loopType = 2;      // 1->单曲循环， 2->列表循环  3->随机播放    循环类型
        this.json = json;

        this.curTrack = null;           // 当前歌曲的json数据
        this.prvTrack = null;           // 上一条曲目的json
        this.nxtTrack = null;           // 下一条曲目的json

    }

    module.exports = Player;

    /* -------  public -------- */
    // 构建 Player 插件
    Player.prototype.render = function() {
        var $ = require('jquery');  // 引入jquery依赖
        this._createEl();           // 创建 UI
        this._bind();               // 启动事件监听器
    };

    // ------- private -------

    Player.prototype.init = function (data) {   // data.src, data.name, data.master
        $('.play-ing .pbar .cur .cur-inner').width(0);
        $('.play-ing .ptitle a.title').html(data.name);
        $('.play-ing .ptitle a.singer').html(data.master);
        this.audio.src = data.src;
        this.audio.play();
    };


    /*  ---------- private -------- */

    // 事件绑定
    Player.prototype._bind = function() {

        var self = this;

        // ----- DOM 委托
        $('body').on('click', function() {
            $('.play-ctrl .cbar').hide();
        });

        $(this.global).on('click', '.play-btns a.play', function() {

            if(self.audio.src === '') {
                self.prvTrack = self.curTrack = self.json[2];
                self.init(self.curTrack);

            } else {
                self.audio.paused ? self.audio.play() : self.audio.pause();
            }

        }).on('click', '.play-btns a.prv', function() {

            self.prvTrack !== null && self.init(self.prvTrack);

        }).on('click', '.play-btns a.nxt', function() {

            if (self.nxtTrack !== null) {   // 若有下一曲的记录 (如之前点击过上一曲)
                self.init(self.nxtTrack);
                self.nxtTrack = null;
            } else {
                var i = ~~ (Math.random() * self.json.length);
                self.prvTrack = self.curTrack;
                self.curTrack = self.json[i];
                self.nxtTrack = null;
                self.init(self.curTrack);
            }

        }).on('click', '.play-ing .pbar .barbg', function(event) {

            var percent = event.offsetX / $(this).width();
            self.audio.currentTime = percent * self.audio.duration;

        }).on('click', '.play-ctrl a.icon-vol', function(event) {

            event.stopPropagation();
            $('.play-ctrl .cbar').toggle();
            $('.play-ctrl .cbar .cur').height(self.audio.volume * 100 + '%');

        }).on('click', '.play-ctrl .cbar', function(event) {
            var adjust = 1 - (event.pageY - $(this).offset().top) / $(this).height();
            if (adjust > 1) adjust = 1;
            else if(adjust < 0) adjust = 0;
            self.audio.volume =adjust;
            event.stopPropagation();

        }).on({
            click: function() {
                var originType = self.loopType;

                if (originType === 3) {
                    $(this).attr('class', 'icon-one');
                    $(this).siblings('.lop-hint').html('单曲循环').show();
                    self.loopType = 1;
                    self.audio.loop = true;

                } else if(originType === 2) {
                    $(this).attr('class', 'icon-shuffle');
                    $(this).siblings('.lop-hint').html('随机播放').show();
                    self.loopType = 3;
                    self.audio.loop = false;

                } else {
                    $(this).attr('class', 'icon-loop');
                    $(this).siblings('.lop-hint').html('列表循环').show();
                    self.loopType = 2;
                    self.audio.loop = false;
                }

            },

            mouseleave: function() {
                $(this).siblings('.lop-hint').hide();
            }

        }, '.play-ctrl a#icn-lop');


        // ----- audio事件委托
        $(this.audio).on('canplay', function() {

            $('.play-ing .pbar .cur span.btn-cur i').hide();

        }).on('play', function() {

            $('.play-btns .play').removeClass('play-ply').addClass('play-pas');

        }).on('timeupdate', function() {
            var percent = ~~(self.audio.currentTime / self.audio.duration * 1000) / 10;
            $('.play-ing .pbar .cur .cur-inner').width(percent + '%');
            $('.play-ing .pbar .clock i').html(parseTime(self.audio.currentTime));

        }).on('pause', function() {

            $('.play-btns .play').removeClass('play-pas').addClass('play-ply');

        }).on('durationchange', function() {

            $('.play-ing .clock em').html(parseTime(self.audio.duration));  //更新时间

        }).on('loadstart', function() {     // 正在加载 loading

            $('.play-ing .pbar .cur span.btn-cur i').show();

        }).on('progress', function() {      // 正在缓冲--灰色缓冲条

            var percent = 0,
                index = self.audio.buffered.length;

            if(index > 0) {         // index大于0即可调用 buffered.end
                percent = ~~(self.audio.buffered.end(index-1) / self.audio.duration * 1000) / 10;
                $('.play-ing .pbar .rdy').width(percent + '%');
            }

        }).on('volumechange', function() {

            $('.play-ctrl .cbar .cur').height(~~(self.audio.volume * 1000) / 10 + '%');

        }).on('ended', function() {

            if (self.audio.loop === false) {
                var i = ~~ (Math.random() * self.json.length);
                self.prvTrack = self.curTrack;
                self.curTrack = self.json[i];
                self.nxtTrack = null;
                self.init(self.curTrack);
            }

        }).on('seeking', function() {
            console.log('seeking');
        });
    };

    // 创建 UI
    Player.prototype._createEl = function() {
        this.global = $("<div>").addClass('audio-player');

        var centerBtn = $("<div>").addClass('center-btn'),  // 中心按钮
            slide = $("<div>").addClass('slide');           // 延伸条

        var centerList = $('<div>').addClass('radius-list'),    // 列表按钮
            playBtns = $('<div>').addClass('play-btns'),    // 三按钮
            playHead = $('<div>').addClass('play-head'),    // img
            playIng = $('<div>').addClass('play-ing'),      // 进度条
            playCtrl = $('<div>').addClass('play-ctrl');    // 调节按钮

        var html = '<a href="javascript:;" class="icon-list" title="播放列表">0</a>';
        centerList.append(html);

        html = '<a href="javascript:;" class="prv" title="上一首"></a>' +
                '<a href="javascript:;" class="play play-ply" title="播放"></a>' +
                '<a href="javascript:;" class="nxt" title="下一首"></a>';
        playBtns.append(html);

        html = '<a href="#"><img src="./images/player/default_album.jpg" alt=""></a>';
        playHead.append(html);

        html = '<div class="ptitle">' +
                    '<a href="#" class="title" title="曲名"></a>' +
                    '<a href="#" class="singer" title="演绎者"></a>' +
                '</div>' +
                '<div class="pbar">' +
                    '<div class="barbg">' +     //总进度条
                        '<div class="rdy"></div>' +     //已加载
                        '<div class="cur">' +           //当前条
                            '<div class="cur-inner">' +
                                '<span class="btn-cur"><i></i></span>' +  //loading
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<span class="clock"><i>00:00</i><span> / </span><em>00:00</em></span>' +
                '</div>';
        playIng.append(html);

        html = '<div class="cbar">' +
                    '<div class="barbg">' +     //音量调节条
                        '<div class="cur">' +
                            '<span class="btn-cur"></span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<a href="javascript:;" class="icon-vol" title="音量"></a>' +
                '<a href="javascript:;" class="icon-loop" id="icn-lop" title="循环"></a>' +
                '<div class="lop-hint">单曲循环</div>';
        playCtrl.append(html);

        centerBtn.append(centerList);
        slide.append(playBtns).append(playHead).append(playIng).append(playCtrl);
        this.global.append(centerBtn).append(slide);
        $('body').prepend(this.global);

        this.audio = $("<audio>").appendTo(this.global).hide();
        this.audio = this.audio[0];     // 选取audio标签的第0个索引
        this.audio.volume = 0.5;
    };



    // helpers

    //数字 转 时间
    function parseTime(time) {
        var min = ~~(time / 60);
        var sec = ~~(time % 60);
        if (min < 10) {
            min = '0' + min;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }
        return min + ':' + sec;
    }

});