const colors = require('colors');
const fs = require('fs');
const os = require('os');
const eol = os.EOL;
const http = require('http');

var Morelog = function(prefix, color, file) {
    this.m_prefix = prefix.toUpperCase();
    this.m_color = color;
    this.m_date = true;
    this.m_file = file + '.mrlg';
    this.m_day = new Date().getDate();
    if (file) {
        this.m_log = true;
    }

    this.m_server = undefined;
    this.m_port = null;
}

Morelog.prototype.print = function(text, preventLog) {

    var date = this.__date();
    var data = date + '[' + this.m_prefix + ']' + ' - ' + text;
    console.log(colors[this.m_color](date + '[' + this.m_prefix + ']' + ' - ' + text));
    this.__write(data, preventLog);
}

Morelog.prototype.warn = function(text, preventLog) {

    var date = this.__date();
    var data = date + '[' + this.m_prefix + ' WARNING]' + ' - ' + text;
    console.log(colors['red'](data));
    this.__write(data, preventLog);
}

Morelog.prototype.error = function(text, preventLog) {

    var date = this.__date();
    var data = date + '[' + this.m_prefix + ' ERROR]' + ' - ' + text.toUpperCase();
    console.log(colors['red'](data));
    this.__write(data, preventLog);
}

Morelog.prototype.info = function(text, preventLog) {

    var date = this.__date();
    var data = date + '[' + this.m_prefix + ' INFO]' + ' - ' + text;
    console.log(colors['yellow'](data));
    this.__write(data, preventLog);
}

Morelog.prototype.debug = function(text) {

    if(!this.__debug())
        return;
    var date = this.__date();
    var data = date + '[DEBUGGER]' + ' - ' + text;
    console.log(colors['yellow'](data));
}
Morelog.prototype.__write = function(data, preventLog) {

    if (!this.m_log)
        return;

    if (preventLog)
        return

    if (!fs.existsSync(this.m_file))
        fs.writeFileSync(this.m_file, new Date() + eol + eol);

    var alreadyOpendToday = new Date().getDate() == fs.statSync(this.m_file).atime.getDate();
    if (alreadyOpendToday) {
        fs.appendFileSync(this.m_file, data + eol);
    } else {
        this.m_day = new Date().getDate();
        var date = new Date();
        fs.appendFileSync(this.m_file, eol + date + eol + eol + data + eol);
    }
}

Morelog.prototype.__date = function() {
    if (this.m_date)
        return new Date().toLocaleTimeString() + ' ';
    else
        return '';
}

Morelog.prototype.__debug = function() {

    var args = process.argv;
    for(arg in args){
        if(args[arg]=="-dbg" || args[arg]=="--debugLog")
            return true;
    }
    return false;
}

Morelog.prototype.startLogServer = function(port) {

    var that = this;

    if (this.m_server)
        return false;

    if (!port)
        this.error("Can not start Log-Server. Port required!");

    this.m_port = port;
    this.m_server = http.createServer(function(req, res){
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

    server.on('listening', function(){
        that.info("Logfile provided @port "+that.m_port)
    });
}

Morelog.prototype.__provideLog = function(req, res) {

    var log = fs.readFileSync(this.m_file);
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(log);

};

Morelog.prototype.closeLogServer = function() {

    if (!this.m_server)
        return true;

    this.m_server.close();
    this.m_server = undefined;
    return true;

}

module.exports = Morelog;
