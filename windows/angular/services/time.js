(function() {
  'use strict';

  angular.module('mainApp').factory('time', timeFactory);

  timeFactory.inject = [];

  function timeFactory() {
    
    /**
     * convert the time range to a decimal
     * @param {string} timeString time range as string
     */
    function toDecimalTime(timeString) {
      const timesplit = timeString.split(':');
      const h = timesplit[0] * 1;
      const m = timesplit[1] * 1;
      const s = timesplit[2] * 1;
      return (h + m/60 + (s/60)/60).toFixed(3);
    }

    /**
     * get the time range from clock in to now
     * @param {Object} start Date
     */
    function getLaps(start) {
      const now = new Date().getTime();
      const ms = (Object.prototype.toString.call(start) === '[object Date]') ? start.getTime() : now;
      return now - ms;
    }

    /**
     * convert milliseconds to time as a string
     * @param {Number} s milliseconds
     */
    function msToTime(s) {
      const pad = (n, z = 2) => ('00' + n).slice(-z);
      return pad(s/3.6e6|0) + ':' + pad((s%3.6e6)/6e4 | 0) + ':' + pad((s%6e4)/1000|0); // + '.' + pad(s%1000, 3);
    }


    return {
      toDecimalTime,
      getLaps,
      msToTime,
    };
  }

}());