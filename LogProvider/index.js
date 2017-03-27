var Morelog = require('../Morelog');
var socketio = require('socket.io');
var express = require('express');
var path = require('path');
var fs = require('fs');

var LogProvider = function(port) {
    this.m_app = express();
    this.m_httpServer = this.m_app.listen(port);
    this._setUpExpress();
    this._setupSocketio();
}

LogProvider.prototype._setUpExpress = function() {
    var app = this.m_app;
    var that = this;

    app.use('/public', express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    app.get('/', function(req, res) {
        res.render('index');
    });
}

LogProvider.prototype._setupSocketio = function() {
    var that = this;
    var io = socketio(this.m_httpServer);
    io.on('connection', function(socket){
        var logFiles = that.collectFiles();
        socket.emit('files', logFiles);
        socket.on('getContent', function(filename){
            var content = that.readFile(filename);
            socket.emit('content', content);
        });
    });
}

LogProvider.prototype.collectFiles = function() {

    var PATH = Morelog.m_jLogDir;
    var logFiles = [];
    var files = fs.readdirSync(PATH);
    files.forEach(function(file) {
        if (path.extname(file) === Morelog.m_jLogExtension) {
            logFiles.push(file)
        }
    });

    return logFiles;
}

LogProvider.prototype.readFile = function(filename) {
    var PATH = path.join(Morelog.m_jLogDir, filename);
    var content = fs.readFileSync(PATH).toString();
    var contentJSON = JSON.parse(content);
    return {
        filename: filename,
        content: contentJSON
    }
}

module.exports = LogProvider;
