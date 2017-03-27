var fs = require('fs');
const eol = '\r\n';

var Morelog = {};

// defining standard colors
Morelog.colors = {
    warn: 'red',
    error: 'red',
    info: 'yellow',
    debug: 'yellow'
}

Morelog._isDebugMode = function() {

    this.m_debugMode = false;
    var args = process.argv;
    for (arg in args) {
        if (args[arg] == "-dbg" || args[arg] == "--debugLog") {
            this.m_debugMode = true;
            break;
        }
    }
    return this.m_debugMode;
}
// check if its debug Mode
Morelog.isDebugMode = function() {
    return this.m_debugMode;
}

//filename for the debugfile
Morelog.m_dbgFile = 'mrlg.dbg';

// get a timestring for the output
Morelog._getTime = function() {
    return new Date().toLocaleTimeString();
}

//get the date for the filenames
Morelog._getDate = function() {
    return new Date().toLocaleDateString();
}

// set standard directory to store the log files
Morelog.m_dir = '.mrlgs';

//set the directory to store the logs readable for the log provider
Morelog.m_jLogDir = Morelog.m_dir + '/.jLog';

Morelog.setDir = function(directory) {
    this.m_dir = directory;
    this.m_jLogDir = this.m_dir + '/.jLog';
    return true;
}

//file extensions
Morelog.m_jLogExtension = '.jLog';
Morelog.m_extension = '.mrlg';

Morelog.log = function(data, jlog) {

    // create the human readable file
    var date = this._getDate();
    var filename = this.m_dir + '/' + date + this.m_extension;
    fs.appendFileSync(filename, data + eol);

    // create the file for the log provider
    // reading existing file
    var file = './' + this.m_jLogDir + '/' + date + this.m_jLogExtension;
    if (fs.existsSync(file)) {
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

}

Morelog.dbgLog = function(data) {

    fs.appendFileSync(this.m_dbgFile, data + eol);
}

// Morelog nees to be initialized to create the depending folders
Morelog.init = function(options) {
    //check if options were passed by
    if (options === undefined) {
        options = {};
    }

    // create the morelog directory first
    // check if a directory is defined in the options parameter
    if (options.dir) {
        // set the new dir
        this.setDir(options.dir)
    }

    // check if its exists and create it if not
    var dir = this.m_dir;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    //create the dir for the log provider
    // check if its exists and create it if not
    var jLogDir = this.m_jLogDir;
    if (!fs.existsSync(jLogDir))
        fs.mkdirSync(jLogDir);


    if (this._isDebugMode()) {
        if (!fs.existsSync(this.m_dbgFile));
        fs.writeFileSync(this.m_dbgFile, this._getDate() +
            " DEBUGGER " +
            eol + eol);
    }

    return true;
}
module.exports = Morelog;
