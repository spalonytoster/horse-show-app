angular.module('App')
  .filter('secondsToMinutes', function () {
      return function(value, withHour) {
        var seconds = parseInt(value % 60);
        var minutes = parseInt((value / 60) % 60);
        var hours = parseInt((value / (60 * 60)) % 24);
        var out = "";

        minutes = (parseInt(minutes) + (60 * parseInt(hours)));
        // minutes = (minutes < 10) ? "0" + minutes : minutes;
        minutes = minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        out = minutes + ":" + seconds;

        if (withHour) {
          hours = (hours < 10) ? "0" + hours : hours;
          minutes = (minutes < 10) ? "0" + minutes : minutes;
          seconds = (seconds < 10) ? "0" + seconds : seconds;

          out = hours + ":" + minutes + ":" + seconds;
        }

        return out;
    };
  });
