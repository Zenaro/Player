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