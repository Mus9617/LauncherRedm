// @language JavaScript
document.getElementById('selectCache').addEventListener('click', async () => {
    const cachePath = await window.electron.openDialog();
    if (cachePath) alert(`Ruta de Cache seleccionada: ${cachePath}`);
});

document.getElementById('clearCache').addEventListener('click', async () => {
    const success = await window.electron.clearCache();
    if (success) alert('Cache borrado exitosamente.');
    else alert('No se encontró la carpeta de cache.');
});

document.getElementById('connect').addEventListener('click', () => {
    alert('Conectando al servidor...');
});
