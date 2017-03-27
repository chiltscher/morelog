var Morelog = require('../Morelog');
var colors = require('colors');

var Logger = function(prefix, color) {

    // some specifications
    this.m_prefix = prefix.toUpperCase();
    this.m_color = color;
}
// outpout methods
//==============================================================================
Logger.prototype.print = function(text, preventLog) {

    var time = Morelog._getTime();
    var instance = this.m_prefix;
    var color = this.m_color;
    var data = '[ ' + time + ' - ' + instance + ' ]   ' + text;
    var json = {
        time: time,
        instance: instance,
        text: text
    };
    console.log(colors[color](data));
    if (!preventLog)
        Morelog.log(data, json);
}

Logger.prototype.warn = function(text, preventLog) {

    var time = Morelog._getTime();
    var color = Morelog.colors['warn'];
    var instance = this.m_prefix + ' WARNING';
    var data = '[ ' + time + ' - ' + instance + ' ]   ' + text;
    var json = {
        time: time,
        instance: instance,
        text: text
    };
    console.log(colors[color](data));
    if (!preventLog)
        Morelog.log(data, json);
}

Logger.prototype.error = function(text, preventLog) {

    var time = Morelog._getTime();
    var color = Morelog.colors['error'];
    var instance = this.m_prefix + ' ERROR';
    var data = '[ ' + time + ' - ' + instance + ' ]   ' + text;
    var json = {
        time: time,
        instance: instance,
        text: text
    };
    console.log(colors[color](data));
    if (!preventLog)
        Morelog.log(data, json);
}

Logger.prototype.info = function(text, preventLog) {

    var time = Morelog._getTime();
    var color = Morelog.colors['info'];
    var instance = this.m_prefix + ' INFO';
    var data = '[ ' + time + ' - ' + instance + ' ]   ' + text;
    var json = {
        time: time,
        instance: instance,
        text: text
    };
    console.log(colors[color](data));
    if (!preventLog)
        Morelog.log(data, json);
}

Logger.prototype.debug = function(text) {

    if (!Morelog.isDebugMode())
        return;

    var time = Morelog._getTime();
    var color = Morelog.colors['debug'];
    var instance = this.m_prefix + ' DEBUG';
    var data = '[ ' + time + ' - ' + instance + ' ]   ' + text;
    var json = {
        time: time,
        instance: instance,
        text: text
    };
    console.log(colors[color](data));
    Morelog.dbgLog(data);
}

module.exports = Logger;
