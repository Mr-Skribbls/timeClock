const {createWindow} = require('./windows');
const path = require('path');

let window;

function createWeeklyTotalsWindow(DEBUG) {
  window = createWindow(400, 250, path.join(__dirname, '/angular/weeklyTotals/weeklyTotals.html'));

  if(DEBUG) {
    window.webContents.openDevTools();
  }

  return window;
}

module.exports = {
  createWeeklyTotalsWindow
};