const colors = require('colors');
const fs = require('fs');
const os = require('os');
const eol = os.EOL;
const http = require('http');

//  create a new instance of morelog with a specific name
//  for example the name off the application using morelog
var Morelog = function(prefix, color) {

    this.m_prefix = prefix.toUpperCase();
    this.m_colors = {};
    this.m_colors["print"] = color;
    this.m_colors["warn"] = 'red';
    this.m_colors["error"] = 'red';
    this.m_colors["info"] = 'yellow';
    this.m_colors["debug"] = 'yellow';

    this.m_debugMode = this._isDebugMode();
    this.m_logDir = this._setupDir();
    this.m_extension = '.mrlg';

    this.m_server = undefined;
    this.m_port = undefined;
}

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

Morelog.prototype._isDebugMode = function() {

    var args = process.argv;
    for (arg in args) {
        if (args[arg] == "-dbg" || args[arg] == "--debugLog")
            return true;
    }
    return false;
}

Morelog.prototype._getTime = function() {
    return new Date().toLocaleTimeString() + ' ';
}

Morelog.prototype._getDate = function() {
    return new Date().toLocaleDateString() + ' ';
}

Morelog.prototype._setupDir = function(){
    var path = '.logs';
    if(!fs.existsSync(path))
        fs.mkdirSync(path);
    return path
}

Morelog.prototype.log = function(data){

    var filename = this.m_logDir + '/' + this._getDate() + this.m_extension;
    fs.appendFileSync(filename, data + eol);

}

Morelog.prototype.startLogServer = function(port) {

    var that = this;

    if (this.m_server)
        return false;

    if (!port)
        this.error("Can not start Log-Server. Port required!");

    this.m_port = port;
    this.m_server = http.createServer(function(req, res) {
        that.__provideLog(req, res)
    });
    this.__serverEvents();
    this.m_server.listen(port)


    return true;
}

Morelog.prototype.__serverEvents = function() {

    var that = this;
    var server = this.m_server;

    server.on('connection', function(request, response) {
        that.info("Log-Server accessed");
    });

    server.on('listening', function() {
        that.info("Logfile provided @port " + that.m_port)
    });
}

Morelog.prototype.__provideLog = function(req, res) {

    var log = fs.readFileSync(this.m_file);
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end(log);

};

Morelog.prototype.closeLogServer = function() {

    if (!this.m_server)
        return true;

    this.m_server.close();
    this.m_server = undefined;
    return true;

}

Morelog.Error = function(name, origin, solution) {

    this.m_name = name;
    this.m_origin = origin;
    this.m_solution = solution;

    Morelog.m_errors.push(this);
}


module.exports = Morelog;
