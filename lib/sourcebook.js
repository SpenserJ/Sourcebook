var conf = require('./config')
  , chokidar = require('chokidar')
  , webapp = require('./webserver').webapp
  , webserver = require('./webserver').webserver
  , sockethandler = require('./socket')
  , io = require('socket.io');

var Sourcebook = function() {
  this.webapp = webapp;
  this.webserver = webserver;
}

Sourcebook.prototype.start = function start() {
  var self = this;

  self.io = io.listen(webserver);
  self.io.sockets.on('connection', function(socket) {
    socket.emit('initialize', { hello: 'world' });
    sockethandler(socket);
  });

  this.watcher = chokidar.watch(conf.get('app_path'), { ignoreInitial: true });
  this.watcher
    .on('add',    function(path) { self.processChange(path, 'add'); })
    .on('change', function(path) { self.processChange(path, 'change'); })
    .on('unlink', function(path) { self.processChange(path, 'unlink'); })
    .on('error', self.handleError);

  console.log('Sourcebook started on port ' + conf.get('port'));
  console.log('Sourcebook is monitoring ' + conf.get('app_path'))
}

Sourcebook.prototype.processChange = function processChange(path, change) {
  console.log(path + " called " + change);
  this.io.sockets.emit('change', { type: change, path: path });
}

Sourcebook.prototype.handleError = function handleError(error) {
  console.log(error);
}

module.exports = Sourcebook;