module.exports = function(io) {
  return {
    channels: {
      main: io.of('/main')
        .on('connection', function (socket) {
          console.log('someone has connected to main channel');
          socket.on('main:message', function (data) {
            console.log('/main:\n' + JSON.stringify(data, null, 2));
          });
          socket.on('main:startContest', function (data) {
            console.log('test: ' + data);
          });
        })
    }
  };
};
