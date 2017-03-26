var MorelogError = require('./src/Error');

const colors = require('colors');
var express = require('express');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const os = require('os');
const eol = '\r\n';

//  create a new instance of morelog with a specific name
//  for example the name off the application using morelog
var Morelog = function(prefix, color) {

    // some specifications
    this.m_prefix = prefix.toUpperCase();
    this.m_colors = {};
    this.m_colors["print"] = color;
    this.m_colors["warn"] = 'red';
    this.m_colors["error"] = 'red';
    this.m_colors["info"] = 'yellow';
    this.m_colors["debug"] = 'yellow';

    // modes
    this.m_debugMode = this._isDebugMode();
    this.m_dbgFile = 'mrlg.dbg';

    // files
    //storing json files for the Morelog File Provider;
    this.m_path = '.mrlgs';
    this.m_jLogPath = this.m_path + '/.jLog';
    this.m_jLogExtension = '.jLog';
    this.m_extension = '.mrlg';
    this.m_logDir = this._setupDir();
    this.m_logFiles = this._getAvailableLogFiles();

    // errors
    this.m_errors = [];

    // server
    this.m_app = express();
    this.m_server = undefined;
    this.m_port = undefined;
}
// outpout methods
//==============================================================================
Morelog.prototype.print = function(text, preventLog) {

    var time = this._getTime();
    var instance = this.m_prefix;
    var color = this.m_colors['print'];
    var data = '[ ' + time + ' - ' + instance + ' ]   ' + text;
    var json = {time: time, instance: instance, text: text};
    console.log(colors[color](data));
    if (!preventLog)
        this.log(data, json);
}

Morelog.prototype.warn = function(text, preventLog) {

    var time = this._getTime();
    var color = this.m_colors['warn'];
    var instance = this.m_prefix + ' WARNING';
    var data = '[ ' + time + ' - ' + instance + ' ]   ' + text;
    var json = {time: time, instance: instance, text: text};
    console.log(colors[color](data));
    if (!preventLog)
        this.log(data, json);
}

Morelog.prototype.error = function(text, preventLog) {

    var time = this._getTime();
    var color = this.m_colors['error'];
    var instance = this.m_prefix + ' ERROR';
    var data = '[ ' + time + ' - ' + instance + ' ]   ' + text;
    var json = {time: time, instance: instance, text: text};
    console.log(colors[color](data));
    if (!preventLog)
        this.log(data, json);
}

Morelog.prototype.info = function(text, preventLog) {

    var time = this._getTime();
    var color = this.m_colors['info'];
    var instance = this.m_prefix + ' INFO';
    var data = '[ ' + time + ' - ' + instance + ' ]   ' + text;
    var json = {time: time, instance: instance, text: text};
    console.log(colors[color](data));
    if (!preventLog)
        this.log(data, json);
}

Morelog.prototype.debug = function(text) {

    if (!this.m_debugMode)
        return;

    var time = this._getTime();
    var color = this.m_colors['debug'];
    var instance = this.m_prefix + ' DEBUG';
    var data = '[ ' + time + ' - ' + instance + ' ]   ' + text;
    var json = {time: time, instance: instance, text: text};
    console.log(colors[color](data));
    this.dbgLog(data);
}

// helpers and functions to check some things
//==============================================================================
Morelog.prototype._isDebugMode = function() {

    var args = process.argv;
    for (arg in args) {
        if (args[arg] == "-dbg" || args[arg] == "--debugLog")
            return true;
    }
    return false;
}

Morelog.prototype._getTime = function() {
    return new Date().toLocaleTimeString();
}

Morelog.prototype._getDate = function() {
    return new Date().toLocaleDateString();
}

// file system functions
//==============================================================================
Morelog.prototype._setupDir = function() {
    var PATH = this.m_path;
    if (!fs.existsSync(PATH))
        fs.mkdirSync(PATH);

    var jLogPATH = this.m_jLogPath;
    console.log(jLogPATH);
    if (!fs.existsSync(jLogPATH))
        fs.mkdirSync(jLogPATH);
    if (!fs.existsSync(this.m_dbgFile));
    fs.writeFileSync(this.m_dbgFile, this._getDate() +
        " DEBUGGER " +
        eol + eol);
    return PATH
}

Morelog.prototype._getAvailableLogFiles = function() {

    this.m_logFiles = [];
    var PATH = this.m_jLogPath;
    var dir = fs.readdirSync(PATH);
    var that = this;

    dir.forEach(function(file) {
        if (path.extname(file) === that.m_jLogExtension)
            that.m_logFiles.push(file);
    });
};

Morelog.prototype.dbgLog = function(data) {

    fs.appendFileSync(this.m_dbgFile, data + eol);
    this._getAvailableLogFiles();
}

Morelog.prototype.log = function(data, jlog) {

    var date = this._getDate();
    var filename = this.m_logDir + '/' + date + this.m_extension;
    fs.appendFileSync(filename, data + eol);

    //reading existing file
    var file = './' + this.m_jLogPath + '/' + date + this.m_jLogExtension;
    if(fs.existsSync(file)){
        //parse it as json
        var logArray = fs.readFileSync(file);
        logArray = JSON.parse(logArray);
        //push new log
        logArray.push(jlog);
        //override file
        fs.writeFileSync(file, JSON.stringify(logArray));
        return;
    } else {
        // create new array
        var logArray = [];
        //push new log
        logArray.push(jlog);
        //override file
        fs.writeFileSync(file, JSON.stringify(logArray));
    }

    this._getAvailableLogFiles();
}

// server that provides every log file
//==============================================================================
Morelog.prototype.startLogServer = function(port) {

    var that = this;
    var app = this.m_app;

    if (this.m_server)
        return false;
    if (!port)
        this.error("Can not start Log-Server. Port required!");

    this.m_port = port;

    app.set('view engine', 'ejs');
    app.use('/views', express.static('views'));
    app.use('/lib', express.static('lib'));

    app.get('/', function(req, res) {
        that._getAvailableLogFiles();
        res.render('index', {
            logFiles: that.m_logFiles
        });
    });

    this.m_server = app.listen(port);

    return true;
}

Morelog.prototype.__serverEvents = function() {

    var that = this;
    var server = this.m_server;

    // server.on('connection', function(request, response) {
    //     that.info("Log-Server accessed");
    // });
}

Morelog.prototype.closeLogServer = function() {

    if (!this.m_server)
        return true;

    this.m_server.close();
    this.m_server = undefined;
    return true;

}

//Morelog errors
Morelog.prototype.defineError = function(name, origin, solution, code){
    var error = new MorelogError(name, origin, solution, code);
    return error;
};

Morelog.ErrorCode = function(code) {
    console.log(this instanceof Morelog.ErrorCode);
    this.m_code
}


module.exports = Morelog;
