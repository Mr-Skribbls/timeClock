(function(){
  'use strict';

  const {ipcRenderer} = require('electron');

  angular.module('mainApp')
    .controller('removeProject', removeProjectController);

  removeProjectController.$inject = [];

  function removeProjectController() {
    const vm = this;

    vm.projectList = [];
    vm.project;

    vm.removeProject = () => {
      ipcRenderer.send('removeProject', vm.project);
    };

    function createProjectListItem(project) {
      return {
        name: project.name,
      };
    }

    function init() {
      ipcRenderer.send('projects:request');
    }

    ipcRenderer.on('projects:load', function(e, days) {
      days = (typeof days === 'string') ? JSON.parse(days) : days;
      
      vm.projectList = days.reduce((acc , day) => {
        day.projects.forEach(project => {
          if(!acc.some(proj => proj.name === project.name)) {
            acc.push(createProjectListItem(project));
          }
        });
        return acc;
      }, []);
    });

    init();
  }

}());