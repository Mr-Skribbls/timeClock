(function(){
  'use strict';

  const {ipcRenderer} = require('electron');

  angular.module('mainApp')
    .controller('weeklyTotals', weeklyTotals);

  weeklyTotals.$inject = ['time', 'weekDay', '$timeout'];

  function weeklyTotals(time, weekDay, $timeout) {
    const vm = this;
    let timer = null;
    const weekHrs = 40;
    let dailyHrs = 8;
    let earlyAlarmSounded = false;
    let clockOutAlarmSounded = false;
    vm.dailyHrs = dailyHrs;
    vm.totalTime = '';
    vm.clockOut = '';
    vm.setDailyHrs = setDailyHrs;
    
    function calcDayTime(day) {
      let dayTime = 0;

      day.projects.forEach(p => {
        dayTime += p.acc_time || 0;
        dayTime += time.getLaps(p.start);
      });
      return dayTime;
    }

    function calcWeekTime(week) {
      return week.reduce((acc, day) => {
        return acc + calcDayTime(day);
      }, 0);
    }

    function startTimers() {
      silenceAlert('tick-tok');
      silenceAlert('celebrate');

      if(timer) clearInterval(timer);

      timer = setInterval(() => {
        $timeout(() => {
          const now = new Date().getTime();
          const today = new Date().getDay();
          const weekTimeMs = calcWeekTime(vm.weekProjects);
          vm.totalTime = time.msToTime(weekTimeMs);
          
          // calculate clock out time
          let timeLeft = (weekHrs * 60 * 60 * 1000) - weekTimeMs; // time to finish for the week
          const msToFinishDailyHrs = (today * dailyHrs * 60 * 60 * 1000) - weekTimeMs; // time to finish for the day, for a [dailyHrs] work day
          timeLeft = msToFinishDailyHrs < timeLeft ? msToFinishDailyHrs : timeLeft;
          const clockOutDate = new Date(now + timeLeft);

          // display clock out time
          vm.clockOut = `${weekDay.getWeekDay(clockOutDate.getDay())} ${formatNumber(clockOutDate.getHours())}:${formatNumber(clockOutDate.getMinutes())}:${formatNumber(clockOutDate.getSeconds())}`;

          // 30 minutes left sound alert
          if(timeLeft <= (30 * 60 * 1000) && timeLeft >= (29 * 60 * 1000) && !earlyAlarmSounded) {
            soundAlert('tick-tok');
            earlyAlarmSounded = true;
          }

          // less than a minute left sound the finished alert
          if(timeLeft < (1 * 60 * 1000) && !clockOutAlarmSounded) {
            soundAlert('celebrate');
            clockOutAlarmSounded = true;
          }
        });
      }, 250);
    }

    function soundAlert(id) {
      document.getElementById(id).play();
    }

    function silenceAlert(id) {
      document.getElementById(id).pause();
    }

    function formatNumber(num) {
      return ('0' + num).slice(-2);
    }

    function setDailyHrs() {
      dailyHrs = vm.dailyHrs;
      startTimers();
    }

    function init() {
      ipcRenderer.on('projects:load', function(e, projects) {
        vm.weekProjects = (typeof projects === 'string') ? JSON.parse(projects) : projects;

        vm.weekProjects.forEach(day => {
          day.projects.forEach(p => {
            if(typeof p.start === 'string') {
              p.start = new Date(p.start);
            }
          });
        });

        startTimers();
        
      });

      ipcRenderer.send('projects:request');
    }

    // $timeout(function() {
    //   init();
    // }, 3000);

    init();

  }

}());