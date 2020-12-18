const {BrowserWindow, Menu} = require('electron');
const url = require('url');

function createWindow(width, height, pathname) {
  let win = new BrowserWindow({
    width: width,
    height: height,
    // icon: __dirname + '/images/icon.png'
  });

  win.loadURL(url.format({
    pathname: pathname,
    protocol: 'file:',
    slashes: true
  }));

  win.on('closed', () => {
    win = null;
  });

  return win;
}

function setMenu(menuTemplate) {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

module.exports = {
  createWindow,
  setMenu
};