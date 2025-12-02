const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const CONFIG_PATH = path.join(app.getPath("userData"), "redencion-config.json");
const LEGACY_CONFIG = path.join(__dirname, "..", "config.json");
const DEFAULT_SERVER = "141.94.99.137";
const DEFAULT_CONFIG = {
  redmPath: "",
  cachePath: "",
  serverAddress: DEFAULT_SERVER,
};

let mainWindow;

function readConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) };
    }
    if (fs.existsSync(LEGACY_CONFIG)) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(LEGACY_CONFIG, "utf8")) };
    }
  } catch (err) {
    console.error("No se pudo leer el archivo de configuracion:", err.message);
  }
  return { ...DEFAULT_CONFIG };
}

function persistConfig(nextConfig) {
  const config = { ...DEFAULT_CONFIG, ...nextConfig };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
  return config;
}

function resolveRedMPath(config) {
  if (config.redmPath && fs.existsSync(config.redmPath)) return config.redmPath;

  const localApp = process.env.LOCALAPPDATA;
  if (localApp) {
    const guess = path.join(localApp, "RedM", "RedM.exe");
    if (fs.existsSync(guess)) return guess;
  }
  return null;
}

function deleteFolderRecursive(targetPath) {
  if (!fs.existsSync(targetPath)) return;

  fs.readdirSync(targetPath).forEach((entry) => {
    const entryPath = path.join(targetPath, entry);
    const stat = fs.lstatSync(entryPath);
    if (stat.isDirectory()) {
      deleteFolderRecursive(entryPath);
    } else {
      try {
        fs.unlinkSync(entryPath);
      } catch (err) {
        console.error("No se pudo borrar el archivo:", err.message);
      }
    }
  });

  try {
    fs.rmdirSync(targetPath, { recursive: true });
  } catch (err) {
    console.error("No se pudo borrar la carpeta:", err.message);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 1100,
    minHeight: 680,
    backgroundColor: "#0d0906",
    icon: path.join(__dirname, "..", "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("config:load", () => readConfig());

ipcMain.handle("config:save", (_evt, payload) => {
  return persistConfig({ ...readConfig(), ...payload });
});

ipcMain.handle("dialog:pick-cache", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (result.canceled || !result.filePaths.length) return { ok: false };

  const config = persistConfig({ ...readConfig(), cachePath: result.filePaths[0] });
  return { ok: true, path: result.filePaths[0], config };
});

ipcMain.handle("dialog:pick-redm", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "RedM", extensions: ["exe"] }],
  });
  if (result.canceled || !result.filePaths.length) return { ok: false };

  const config = persistConfig({ ...readConfig(), redmPath: result.filePaths[0] });
  return { ok: true, path: result.filePaths[0], config };
});

ipcMain.handle("cache:clear", () => {
  const config = readConfig();
  if (!config.cachePath) return { ok: false, message: "Configura primero la ruta de cache." };
  if (!fs.existsSync(config.cachePath))
    return { ok: false, message: "La ruta configurada no existe." };

  try {
    deleteFolderRecursive(config.cachePath);
    return { ok: true, message: "Cache borrada correctamente." };
  } catch (err) {
    console.error("Error al borrar cache:", err);
    return { ok: false, message: "No se pudo borrar la cache." };
  }
});

ipcMain.handle("connect:server", () => {
  const config = readConfig();
  const redmPath = resolveRedMPath(config);
  const targetServer = config.serverAddress || DEFAULT_SERVER;
  if (!targetServer) return { ok: false, message: "Configura la direccion del servidor." };
  if (!redmPath) return { ok: false, message: "No se encontro RedM. Ajusta la ruta manualmente." };

  try {
    const child = spawn(redmPath, ["+connect", targetServer], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();

    setTimeout(() => app.quit(), 900);
    return { ok: true, message: "RedM lanzado, cerrando el launcher." };
  } catch (err) {
    console.error("Error al lanzar RedM:", err);
    return { ok: false, message: "No se pudo lanzar RedM." };
  }
});

ipcMain.handle("open:cache", () => {
  const { cachePath } = readConfig();
  if (cachePath && fs.existsSync(cachePath)) {
    shell.openPath(cachePath);
    return { ok: true };
  }
  return { ok: false };
});
