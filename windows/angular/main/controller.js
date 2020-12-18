(function() {
  'use strict';

  const {ipcRenderer} = require('electron');

  angular.module('mainApp')
    .controller('jobTable', jobTable);

  jobTable.$inject = ['weekDay', 'time', '$scope'];
  
  function jobTable(weekDay, time, $scope) {

    /* 
    | -----------------------------------------
    | Variables
    | -----------------------------------------
    */
    $scope.weekProjects = [];
    $scope.projects = [];
    $scope.totalTime, $scope.totalDecimalTime;
    let day = new Date().getDay();
    $scope.displayDay;
    let timer = null;


    /* 
    | -----------------------------------------
    | Scope Methods
    | -----------------------------------------
    */
    $scope.start = function(project) {
      if(project.start === null) {
        // stop all other projects
        $scope.projects.forEach(p => $scope.stop(p));

        project.start = new Date();
      }
      saveProjects();
    };

    $scope.stop = function(project) {
      if(project.start !== null) {
        // make sure start is a date
        if(Object.prototype.toString.call(project.start) !== '[object Date]') {
          project.start = null;
          return;
        }

        project.acc_time += time.getLaps(project.start);
        project.start = null;
      }
      saveProjects();
    };

    $scope.workingProject = function() {
      return $scope.projects.find(p => p.start !== null);
    };

    $scope.isWorkingProject = function(project) {
      return $scope.workingProject() === project;
    };

    $scope.decimalTime = function(project) {
      return time.toDecimalTime(project.display_time);
    };

    $scope.save = function() {
      saveProjects();
    };

    $scope.cycleDayLeft = function() {
      day--;
      if(day < 0) day = 6;
      $scope.displayDay = weekDay.getWeekDay(day);

      saveProjects();
      init();
    };

    $scope.cycleDayRight = function() {
      day++;
      if(day > 6) day = 0;
      $scope.displayDay = weekDay.getWeekDay(day);

      saveProjects();
      init();
    };


    /**
     * update the current days total time
     */
    function updateTotalTime() {
      $scope.totalTime = 0;
      $scope.projects.forEach(p => {
        $scope.totalTime += p.acc_time + time.getLaps(p.start);
      });

      $scope.totalTime = time.msToTime($scope.totalTime);
      $scope.totalDecimalTime = time.toDecimalTime($scope.totalTime);
      $scope.$apply();
    }

    function saveProjects() {
      $scope.weekProjects.forEach(wp => {
        wp.projects.forEach(p => {
          delete p.$$hashKey;
        });
      });

      ipcRenderer.send('projects:save', JSON.stringify($scope.weekProjects));
    }

    function startTimers() {
      if(timer) clearInterval(timer);

      timer = setInterval(() => {
        $scope.projects.forEach(p => {
          const acc_time = p.acc_time + time.getLaps(p.start);
          p.display_time = time.msToTime(acc_time);
        });
        updateTotalTime();
      }, 250);
    }

    function init() {
      // get the current day of the week
      $scope.displayDay = weekDay.getWeekDay(day);


      // load projects from file
      ipcRenderer.on('projects:load', function(e, projects) {
        $scope.weekProjects = (typeof projects === 'string') ? JSON.parse(projects) : projects;
        $scope.projects = $scope.weekProjects.find(wp => wp.day === $scope.displayDay).projects;

        $scope.projects.forEach(p => {
          if(typeof p.start === 'string') {
            p.start = new Date(p.start);
          }
        });

        //$scope.$apply();
        startTimers();
      });

      ipcRenderer.send('projects:request');
    }

    init();
  }


}());