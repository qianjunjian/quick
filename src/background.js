'use strict';

import {
	app,
	protocol,
	BrowserWindow,
	Menu,
	dialog,
	ipcMain
} from 'electron';
import {
	createProtocol
} from 'vue-cli-plugin-electron-builder/lib';
import { mainProcessForHeader } from './node/mainHeader';
// import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
	scheme: 'app',
	privileges: {
		secure: true,
		standard: true
	}
}]);

let win = null;

async function createWindow() {
	Menu.setApplicationMenu(null);
	// Create the browser window.
	win = new BrowserWindow({
		width: 1000,
		height: 800,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableWebSQL: false,
			nativeWindowOpen: true,
			enableRemoteModule:true
		}
	});

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol('app');
		// Load the index.html when not in development
		win.loadURL('app://./index.html');
	}

	// Header主进程
	mainProcessForHeader(win);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	// if (isDevelopment && !process.env.IS_TEST) {
	//   // Install Vue Devtools
	//   try {
	//     await installExtension(VUEJS3_DEVTOOLS);
	//   } catch (e) {
	//     console.error("Vue Devtools failed to install:", e.toString());
	//   }
	// }
	createWindow();
});

app.on('browser-window-focus', () => {
	win.webContents.send('window-focus');
});

app.on('browser-window-blur', () => {
	win.webContents.send('window-blur');
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit();
			}
		});
	} else {
		process.on('SIGTERM', () => {
			app.quit();
		});
	}
}

ipcMain.on('open-directory-dialog', function (event, p) {
	dialog.showOpenDialog({
		properties: [p]
	}).then(result => {
		if (result.filePaths[0]) { // 如果有选中
			// 发送选择的对象给子进程
			event.sender.send('selectedItem', result.filePaths[0]);
		}
	});
});
