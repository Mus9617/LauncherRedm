
# 🌟 RedencionLauncher - Launcher para RedM 🌟

Este proyecto es un **Launcher personalizado para RedM** que incluye diversas funcionalidades como:

- ✅ Reproducción de video de fondo (`video.mp4`).
- ✅ Conexión automática a un servidor RedM mediante IP.
- ✅ Borrado seguro de la carpeta de caché.
- ✅ Interfaz moderna y adaptable.

---

## 📂 Estructura del Proyecto

```
RedencionLauncher/
├── main.js             # Archivo principal de Electron (back-end)
├── preload.js          # Comunicación entre front-end y back-end
├── index.html          # Interfaz de usuario (front-end)
├── package.json        # Configuración de dependencias y scripts de Electron
├── video.mp4           # Video de fondo que se reproduce al iniciar el Launcher
├── node_modules/       # Dependencias instaladas
├── build/              # Carpeta generada tras la compilación
```

---

## 📦 Instalación

### 1. Clonar el Repositorio
```
git clone https://github.com/Mus9617/LauncherRedm.git
```

### 2. Instalar Dependencias
```bash
npm install
```

---

## 🔨 Uso en Desarrollo

Para ejecutar el launcher en modo desarrollo:
```bash
npm run start
```

---

## 📦 Empaquetado para Windows

Para compilar el launcher en Windows:

```bash
npm run package-win
```

Esto generará un ejecutable en la carpeta `build/`.

---

## 📁 Configuración en `package.json`

```json
{
  "name": "RedencionLauncher",
  "version": "1.0.0",
  "description": "Launcher para RedM",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "package-win": "electron-packager . RedencionLauncher --platform=win32 --arch=x64 --icon=icon.ico --out=build --overwrite --extra-resource=video.mp4"
  },
  "devDependencies": {
    "electron": "^25.3.0",
    "electron-packager": "^15.5.2"
  }
}
```

---

## 🚀 Cómo Asegurarte que el Video Funciona

- El archivo `video.mp4` debe estar en la raíz del proyecto.
- Si no se reproduce, asegúrate de que el `main.js` tenga configurado:
```javascript
webSecurity: false,
allowRunningInsecureContent: true
```
- Usa siempre la ruta `src="video.mp4"` en tu `index.html`.

---

## ❌ Problemas Comunes

1. **El video no se ve:**
   - Asegúrate de que el archivo `video.mp4` está en la raíz.
   - Confirma que tu `main.js` permite `webSecurity: false`.

2. **El cache no se borra:**
   - Ejecuta el launcher con permisos de administrador.
   - Asegúrate de que ningún otro programa esté utilizando esos archivos.

3. **No se conecta al servidor RedM:**
   - Asegúrate de que la IP del servidor esté correctamente configurada en `main.js`.

---

## 📜 Licencia

Este proyecto está licenciado bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.
