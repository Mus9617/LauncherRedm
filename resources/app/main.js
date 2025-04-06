const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false,
            allowRunningInsecureContent: true
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


function findRedMPath() {
    const localAppData = process.env.LOCALAPPDATA;
    const redmPath = path.join(localAppData, 'RedM', 'RedM.exe');
    return fs.existsSync(redmPath) ? redmPath : null;
}


function deleteFolderRecursive(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const currentPath = path.join(directoryPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                deleteFolderRecursive(currentPath);
            } else {
                try {
                    fs.unlinkSync(currentPath);
                } catch (error) {
                    console.error(`No se pudo borrar el archivo: ${currentPath} - ${error.message}`);
                }
            }
        });

        try {
            fs.rmdirSync(directoryPath, { recursive: true });
            console.log('Cache borrada correctamente.');
        } catch (error) {
            console.error(`No se pudo borrar la carpeta: ${directoryPath} - ${error.message}`);
        }
    }
}


ipcMain.handle('select-cache', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const configPath = path.join(__dirname, 'config.json');
        fs.writeFileSync(configPath, JSON.stringify({ cachePath: result.filePaths[0] }, null, 2));
        return result.filePaths[0];
    }
    return null;
});


ipcMain.handle('clear-cache', async () => {
    const configPath = path.join(__dirname, 'config.json');

    if (fs.existsSync(configPath)) {
        const { cachePath } = JSON.parse(fs.readFileSync(configPath));
        
        if (fs.existsSync(cachePath)) {
            try {
                deleteFolderRecursive(cachePath);
                return true;
            } catch (error) {
                console.error(`Error al intentar borrar la cache: ${error.message}`);
                return false;
            }
        }
    }

    return false;
});


ipcMain.handle('connect-server', async () => {
    const redmPath = findRedMPath();

    if (!redmPath) {
        console.error("No se pudo encontrar RedM instalado en el sistema.");
        return false;
    }

    try {
        const serverIP = "51.210.105.36";

        const child = require('child_process').spawn(redmPath, ['+connect', serverIP], {
            detached: true,
            stdio: 'ignore'
        });
        child.unref();

        console.log(`Ejecutando RedM desde: ${redmPath}`);
        return true;
    } catch (error) {
        console.error("Error al intentar conectar:", error);
        return false;
    }
});
