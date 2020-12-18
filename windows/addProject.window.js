const {ipcMain} = require('electron');
const {createWindow} = require('./windows');
const path = require('path');
const projects = require('../projects');

let window;
let mainWin;

function createAddProjectWindow(DEBUG, mainWindow) {
  mainWin = mainWindow;
  window = createWindow(700, 200, path.join(__dirname, '/angular/addProject/addProject.html'));

  if(DEBUG) {
    window.webContents.openDevTools();
  }

  return window;
}

ipcMain.on('addProject', function(e, proj) {
  projects.addProject(proj).then((days) => {
    mainWin.webContents.send('projects:load', days);
  });
  window.close();
});

module.exports = {
  createAddProjectWindow
};