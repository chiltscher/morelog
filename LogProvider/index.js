var Morelog = require('../Morelog');
var express = require('express');

var LogProvider = function(port){
    this.m_app = app = express();
    app.use('/public', express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    app.get('/', function(req, res){
        res.render('index');
    });

    app.listen(port);
}

module.exports = LogProvider;
