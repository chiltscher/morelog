## MORELOG

Morelog provides options to create colored, named console logs and log files fore Nodejs.
The logfiles can be provided by the Morelog.LogProvider.

## Installation

```bash
$ npm install morelog
```
## Start
First, require the module and initialize it.
When initializing, Morelog will create the directories to save the log files in.
The standard dir is hidden in the root dir of your nodejs application and named './mrlgs'.

Example:
```js
var Morelog = require('./index.js');
Morelog.init();
```
You can pass an options argument to the ```init()``` function, to define another dir.
The following code will create a dir named 'logfiles' in the root dir of the app and saves all log files in it.

Example:
```js
var options = {
    dir: 'logfiles'
}
Morelog.init(options);
```

## Morelog.Logger

The Logger allows to create named and colored console logs, warnings, infos, errors and debugs.
The logs were saved in the ```'./mrlgs'``` dir, named with the current date. 
You can prevent saving the log in a file by passing ``` true ``` as a second argument.

Example:
```js
var log = new Morelog.Logger('app', 'cyan');
log.print('This is a .print');
log.warn('This is a .warn');
log.error('This is a .error');
log.info('This is a .info');

log.print('You will find this entry in your log file');
log.print('You will NOT find THIS entry in your log file', true);
```

The code above will result the following output:
![alt output](https://github.com/chiltscher/morelog/blob/master/img/output.png?raw=true)

## Debug mode

You can also create debug logs like
```js
log.debug('this is a debugging note');
```
You will see the output in your console, just if you start your application passing the argument ```-dbg``` or ```--debugLog```.
Everytime you start your application in debug mode, Morelog will create a file in the apps root directory named ```mrlg.dbg```,
containig all debug logs.


## Morelog.LogProvider

The LogProvider creates an http-server on a specified port and shows you all existing morelog-log-files in a web view.

Example:
```js
var logProvider = new Morelog.LogProvider(1540);
```

This will start the server at port ```1540``` on your ```localhost```.
![alt LogProvider](https://github.com/chiltscher/morelog/blob/master/img/provider.png?raw=true)
