(function(){
  'use strict';

  const {ipcRenderer} = require('electron');

  angular.module('mainApp')
    .controller('addProject', addProjectController);

  addProjectController.$inject = [];

  function addProjectController() {
    const vm = this;

    vm.project = {
      name: '',
    };

    vm.addProject = () => {
      ipcRenderer.send('addProject', vm.project);
    };
    
  }

}());