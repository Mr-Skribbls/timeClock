(function(){
  'use strict';

  const {ipcRenderer} = require('electron');

  angular.module('mainApp')
    .controller('alert', alertController);

  alertController.$inject = [];

  function alertController() {
    const vm = this;

    vm.action = choice => {
      ipcRenderer.send('newWeek', choice);
    };
  }

}());