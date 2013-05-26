var Fibers = Npm.require('fibers');
var net = Npm.require('net');
var http = Npm.require('http');

var server = net.createServer(function(socket) {
  socket.setNoDelay(true);
  socket.on('data', onData);
  function onData(data) {
    var source = JSON.parse(data.toString());
    Fibers(function() {
      eval('(' + source.func + ')(' + source.args.join(', ')+ ');');
    }).run();
  }

  socket.once('end', function() {
    emit = function() {};
    socket.removeListener('on', onData);
  });

  function emit() {
    var argsJson = JSON.stringify(arguments);
    socket.write(argsJson + '#DTF#');
  }

});

var port = getRandomPort();
server.listen(port, function() {
  console.log('laika code injected and listening on: ' + port);
});

function getRandomPort() {
  return Math.ceil(Math.random() * 20000) + 10000;
}