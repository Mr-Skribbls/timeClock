const {ipcMain} = require('electron');
const {createWindow} = require('./windows');
const path = require('path');
const projects = require('../projects');

let window;
let mainWin;

function createAlertWindow(DEBUG, mainWindow) {
  mainWin = mainWindow;
  window = createWindow(400, 250, path.join(__dirname, '/angular/alert/alert.html'));

  if(DEBUG) {
    window.webContents.openDevTools();
  }

  return window;
}

ipcMain.on('newWeek', (e, resetWeek) => {
  if(resetWeek) {
    projects.emptyProjects().then(() => {
      projects.getProjectsString().then(r => {
        mainWin.webContents.send('projects:load', r);
      }, err => {
        throw err;
      });
    }, err => {
      throw err;
    });
  }
  window.close();
});

module.exports = {
  createAlertWindow
};