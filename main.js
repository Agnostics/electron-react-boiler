const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;

let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
	dev = true;
}

global.dev = dev;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 500,
		height: 500,
		show: false
	});

	mainWindow.setMenu(null);

	let indexPath;
	if (dev && process.argv.indexOf("--noDevServer") === -1) {
		indexPath = url.format({
			protocol: "http:",
			host: "localhost:8080",
			pathname: "index.html",
			slashes: true
		});
	} else {
		indexPath = url.format({
			protocol: "file:",
			pathname: path.join(__dirname, "dist", "index.html"),
			slashes: true
		});
	}
	mainWindow.loadURL(indexPath);

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});

	mainWindow.on("closed", function() {
		mainWindow = null;
	});
}

app.on("ready", () => {
	createWindow();
	globalShortcut.register("Control+`", () => {
		mainWindow.webContents.openDevTools({ mode: "detach" });
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});
