(function() {
  'use strict';

  angular.module('mainApp').factory('weekDay', weekDayFactory);

  weekDayFactory.inject = [];

  function weekDayFactory() {
    return {
      getWeekDay: function(dayNum) {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return weekdays[dayNum];
      }
    };
  }

}());