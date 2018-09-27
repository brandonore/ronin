const ElectronTitlebarWindows = require('electron-titlebar-windows');
const titlebar = new ElectronTitlebarWindows({draggable: true, backgroundColor: '#03c9a9'});

titlebar.appendTo(document.getElementById('title-bar'));