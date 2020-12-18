const {createWindow, setMenu} = require('./windows');
const {app} = require('electron');
const path = require('path');
const {createWeeklyTotalsWindow} = require('./weeklyTotals.window');
const {createAlertWindow} = require('./alert.window');
const {createAddProjectWindow} = require('./addProject.window');
const {createRemoveProjectWindow} = require('./removeProject.window');

let mainWin;

function createMainWindow(DEBUG) {
  mainWin = createWindow(800, 850, path.join(__dirname, '/angular/main/index.html'));

  if(DEBUG) {
    mainWin.webContents.openDevTools();
  }

  mainWin.on('closed', () => app.quit());

  setMenu(menu(DEBUG));

  return mainWin;
}

// Menu Template
const menu = function menu(DEBUG) {
  return [
    { // file
      label: 'File',
      submenu: [
        { // quit
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click() { app.quit(); }
        }
      ]
    }, { // projects
      label: 'Projects',
      submenu: [
        { // add project
          label: 'Add Project',
          click() {
            createAddProjectWindow(DEBUG, mainWin);
          }
        }, { // clear projects
          label: 'Remove Project',
          click() {
            createRemoveProjectWindow(DEBUG, mainWin);
          }
        }
      ]
    }, { // time
      label: 'Time',
      submenu: [
        {
          label: 'Weekly Total',
          click() {
            createWeeklyTotalsWindow(DEBUG);
          }
        }
      ]
    }, { // new week
      label: 'New Week',
      click() {
        createAlertWindow(DEBUG, mainWin);
      }
    }
  ];
};

module.exports = {
  createMainWindow
};