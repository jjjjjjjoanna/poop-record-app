const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const recordManager = require("./backend/recordManager.js");

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "renderer", "app.html"));
}

function createDetailsWindow(dateStr) {
  const detailsWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const filePath = path.join(__dirname, "renderer", "details.html");
  // const url = `file://${filePath}?date=${dateStr}`;
  // detailsWindow.loadURL(url);
  detailsWindow.loadFile(filePath, { query: { date: dateStr } });
}

app.whenReady().then(() => {
  recordManager.ensureDataFile();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ipcMain handlers
ipcMain.handle("save-record", async (event, record) => {
  const { date, time, type, note } = record;
  return recordManager.saveRecord(date, time, type, note);
});

ipcMain.handle("load-records", async () => {
  return recordManager.loadAll();
});

ipcMain.handle("delete-record", async (event, { date, index }) => {
  return recordManager.deleteRecord(date, index);
});

ipcMain.handle("get-records-by-date", async (event, date) => {
  return recordManager.getRecordsByDate(date);
});

ipcMain.handle("open-details-window", (event, dateStr) => {
  createDetailsWindow(dateStr);
});
