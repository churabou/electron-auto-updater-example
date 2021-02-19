const { app, dialog, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.webContents.openDevTools();
  win.on("closed", () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`);
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("ready", function () {
  createWindow();
  setTimeout(() => {
    sendStatusToWindow("app ready will checkForUpdates");
    autoUpdater.checkForUpdates();
  }, 1000);
});

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

autoUpdater.setFeedURL("http://localhost:8888");
log.info(autoUpdater.getFeedURL());

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send("message", text);
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (ev, info) => {
  sendStatusToWindow(`Update available. ${info}`);
});
autoUpdater.on("update-not-available", (ev, info) => {
  sendStatusToWindow(`Update not available. ${info}`);
});
autoUpdater.on("error", (ev, err) => {
  sendStatusToWindow(`Error in auto-updater. ${err}`);
});
autoUpdater.on("download-progress", (ev, progressObj) => {
  sendStatusToWindow(`Download progress... ${progressObj}`);
});
autoUpdater.on("update-downloaded", (ev, info) => {
  sendStatusToWindow(`Update downloaded; ${info}`);
});

autoUpdater.on("update-downloaded", (ev, info) => {
  const option = {
    type: "info",
    buttons: ["更新して再起動", "あとで"],
    message: "アップデート",
    detail:
      "新しいバージョンをダウンロードしました。再起動して更新を適用しますか？",
  };
  dialog.showMessageBox(win, option).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});
