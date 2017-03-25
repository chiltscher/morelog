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

    // files
    this.m_path = '.mrlgs';
    this.m_logDir = this._setupDir();
    this.m_extension = '.mrlg';
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

    var date = this._getTime();
    var color = this.m_colors['print'];
    var data = '[ '+ date + ' - ' + this.m_prefix + ' ]   ' + text;
    console.log(colors[color](data));
    if(!preventLog)
        this.log(data);
}

Morelog.prototype.warn = function(text, preventLog) {

    var date = this._getTime();
    var color = this.m_colors['warn'];
    var data = '[ ' + date + ' - ' + this.m_prefix + ' WARNING ]   ' + text;
    console.log(colors[color](data));
    if(!preventLog)
        this.log(data);
}

Morelog.prototype.error = function(text, preventLog) {

    var date = this._getTime();
    var color = this.m_colors['error'];
    var data = '[ ' + date + ' - ' + this.m_prefix + ' ERROR ]   ' + text;
    console.log(colors[color](data));
    if(!preventLog)
        this.log(data);
}

Morelog.prototype.info = function(text, preventLog) {

    var date = this._getTime();
    var color = this.m_colors['info'];
    var data = '[ ' + date + ' - ' + this.m_prefix + ' INFO ]   ' + text;
    console.log(colors[color](data));
    if(!preventLog)
        this.log(data);
}

Morelog.prototype.debug = function(text) {

    if (!this.m_debugMode)
        return;
    var date = this._getTime();
    var color = this.m_colors['debug'];
    var data = '[ ' + date + ' - ' + this.m_prefix + ' DEBUG ]   ' + text;
    console.log(colors[color](data));
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
Morelog.prototype._setupDir = function(){
    var PATH = this.m_path;
    if(!fs.existsSync(PATH))
        fs.mkdirSync(PATH);
    return PATH
}

Morelog.prototype._getAvailableLogFiles = function(){

    this.m_logFiles = [];
    var PATH = this.m_path;
    var dir = fs.readdirSync(PATH);
    var that = this;

    dir.forEach(function(file){
        if(path.extname(file) === that.m_extension)
            that.m_logFiles.push(file);
    });
};

Morelog.prototype.log = function(data){

    var filename = this.m_logDir + '/' + this._getDate() + this.m_extension;
    fs.appendFileSync(filename, data + eol);
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
        res.render('index', {logFiles: that.m_logFiles});
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


// Morelog error // in process
//==============================================================================
Morelog.Error = function(name, origin, solution) {

    this.m_name = name;
    this.m_origin = origin;
    this.m_solution = solution;
    this.m_code = code;

    Morelog.m_errors.push(this);
}


module.exports = Morelog;
