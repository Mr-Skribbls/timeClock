const {app, ipcMain} = require('electron');
const {createMainWindow} = require('./windows/main.window');
const projects = require('./projects');

const DEBUG = false;

let mainWin;

app.on('ready', function() {
  mainWin = createMainWindow(DEBUG);
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});

// catch projects:save
ipcMain.on('projects:save', function(e, proj) {
  projects.updateProjects(proj);
});

ipcMain.on('projects:request', function(e, day) {
  projects.getProjectsString().then(res => {
    // https://electronjs.org/docs/api/ipc-main

    const project = res.find(p => p.day === day) || res;

    e.sender.send('projects:load', project);
  }, err => {
    throw err;
  });
});