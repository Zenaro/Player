# Player
先前接到了个关于音乐素材的项目，里面的核心是音乐插件。然而花了个寒假打出来后，效果还是不满意。后来我把播放器插件单独拿出来重新优化。便有了这个小项目，这是笔者目前的所针对的优化方案。
我主要是针对HTML5的 [audio](http://www.w3school.com.cn/jsref/dom_obj_audio.asp) 标签进行 DOM 和 UI 的优化，话不多磕叨，上图先~

![Z-Player](http://7xstax.com1.z0.glb.clouddn.com/player.png)

## 插件 简介
插件的主要功能包括构建插件样式和DOM控制，并在最后公开出播放方法。以实现调用插件即可使用的效果。而且插件的css为悬浮定位，不会影响到原页面的布局~
具体调用只需要 new 出插件实例就嘛都搞定了
``` bash
var Player = require('./player');
var p = new Player(json);	// json为歌曲信息，下文会分析
Player.render();	// render为构建插件的方法
```

代码包我已经放在 [Github](https://github.com/Zenaro/Player) 上面啦，忍不住想先睹为快的童鞋可以到[这里](https://github.com/Zenaro/Player) 下载~。当然啦，更具体的信息请容我慢慢道来

## 如何使用
项目稍微大一些的都需要JS模块化开发，这个插件为了走向大众化也使用了。作者这里用的是seajs，毕竟seajs可是来自大陆的阿里模块化js神器，怎么也得支持一下，这里我们新建一个空的html文件，然后引入player.css样式和seajs配置

``` bash
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Player</title>
    <link rel="stylesheet" href="./dest/css/player.css"/>
    <style>
        html, body { width: 100%; height: 100%; }
    </style>
</head>
<body>
	
<script type="text/javascript" src="./sea-modules/seajs/sea.js"></script>
<script type="text/javascript">
    seajs.config({ 		//设置configuration
        base: "./sea-modules",
        alias: {
            "jquery" : "jquery/jquery.js"
        }
    });
    seajs.use('./src/js/main');		// 引入main.js
</script>
</body>
</html>
```

接着便是main.js的写法了，假设你的项目里面已经有很多个模块了，这时候player作为新的模块被引入进来
``` bash
define(function (require) {
    // ...其他模块

    // player模块
    var json = require('./data');
    var Player = require('./player');
    var p = new Player(json);
    p.render();

    // ...更多模块
});
```
这里的data模块只是我自己写上去的一些歌曲测试数据而已，包括了若干歌曲的曲名，歌手，和路径(路径由于是引用别人的服务器，所以会有失效期=.= ，大家记得隔一段时间就手动换一次哈，或者换成自己的音乐地址更好)。引入json数据来对player进行初始化。

最后是如何调用player，简单直接使用接口就行
``` bash
	p.init(data);		// 某首歌曲的数据，
```
到了这里，大家是不是已经开着插件在听歌了呢？那接下来是程序员的世界了，我要开始讲代码啦，不喜欢代码的童鞋千万不要往下看...

## JS代码分析

插件框架一览
首先我们创建 Player 对象，它包含了以下几个属性和方法。最后别忘了暴露出这个Player模块
``` bash
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

    module.exports = Player;	// 暴露Player

    Player.prototype.render = function() {
        var $ = require('jquery');  // 引入jquery依赖
        this._createEl();           // 创建 UI
        this._bind();               // 启动事件监听器
    };

    Player.prototype.init = function (data) {		//向外暴露的播放方法

    }

    Player.prototype._bind = function() {		// 一些事件绑定

    }

    Player.prototype._createEl = function() {	// 创建UI

    }
});
```
需要了解具体的代码实现的同学再自行翻开源代码啦。由于技术未深，有错误的地方烦请批评指正
