/**
 * Created by Administrator on 2016/4/6.
 */
var express = require('express');
var app = express();

app.use(express.static('dest'));

app.get('/submit.html', function(req, res) {
    res.sendFile(__dirname + '/' + 'submit.html');
});

app.get('/process_get', function(req, res) {
    response = {
        first_name: req.query.first_name,
        last_name: req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
});

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('应用实例');
});