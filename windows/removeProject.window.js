const {ipcMain} = require('electron');
const {createWindow} = require('./windows');
const path = require('path');
const projects = require('../projects');

let window;
let mainWin;

function createRemoveProjectWindow(DEBUG, mainWindow) {
  mainWin = mainWindow;
  window = createWindow(700, 350, path.join(__dirname, '/angular/removeProject/removeProject.html'));

  if(DEBUG) {
    window.webContents.openDevTools();
  }

  return window;
}

ipcMain.on('removeProject', function(e, proj) {
  projects.removeProject(proj).then((days) => {
    mainWin.webContents.send('projects:load', days);
  });
  window.close();
});

module.exports = {
  createRemoveProjectWindow
};