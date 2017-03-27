#!/usr/bin/env node
var Morelog = require('./index.js');

var options = {
    dir: 'logfiles'
}

Morelog.init();

var log = new Morelog.Logger('server', 'cyan');
var logProvider = new Morelog.LogProvider(1540);

log.print('This is a .print');
log.warn('This is a .warn');
log.error('This is a .error');
log.info('This is a .info');

log.print('You will find this entry in your log file');
log.print('You will NOT find THIS entry in your log file', true);

log.debug('this is a debugging note');
