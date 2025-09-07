# RedencionLauncher - Launcher para RedM

**RedencionLauncher** es un launcher personalizado para **RedM**, diseñado para simplificar la conexión a servidores y optimizar la experiencia de los jugadores.  
Incluye funcionalidades de gestión de caché, conexión automática y una interfaz moderna que se adapta a las necesidades del usuario.

---

## Características principales

- Reproducción de fondo mediante video o GIF animado.  
- Conexión automática a un servidor RedM mediante IP.  
- Borrado seguro de la carpeta de caché.  
- Interfaz moderna, adaptable y fácil de usar.  
- Cifrado AES interno para proteger la conexión al servidor.  
- Autocierre del launcher tras iniciar RedM.  

---

## Novedades de la versión final (v1.0.2)

- Reemplazo del video por un **GIF optimizado** para mejorar el rendimiento.  
- Inclusión de un **ícono personalizado para Windows**.  
- Rediseño de la interfaz con un estilo más futurista y coherente.  
- Reubicación de botones para mejorar la usabilidad.  
- Mejoras en la función de borrado de caché.  
- Implementación del cierre automático del launcher después de conectar al servidor.  

---

## Estructura del proyecto

```
RedencionLauncher/
├── main.js             # Archivo principal de Electron (back-end)
├── preload.js          # Comunicación entre front-end y back-end
├── index.html          # Interfaz de usuario (front-end)
├── package.json        # Configuración de dependencias y scripts
├── gif-background.gif  # Fondo animado optimizado (antes video.mp4)
├── icon.ico            # Ícono personalizado para Windows
├── node_modules/       # Dependencias instaladas
├── build/              # Carpeta generada tras la compilación
├── config.json         # Configuración (ruta de caché y otros datos)
```

---

## Instalación

1. **Clonar el repositorio**  
   ```bash
   git clone https://github.com/Mus9617/LauncherRedm.git
   ```

2. **Instalar dependencias**  
   ```bash
   npm install
   ```

---

## Uso en desarrollo

Para ejecutar el launcher en modo desarrollo:
```bash
npm run start
```

---

## Empaquetado para Windows

Para compilar el launcher en Windows:
```bash
npm run package-win
```

El ejecutable se generará en la carpeta `build/`.

---

## Configuración en `package.json`

```json
{
  "name": "RedencionLauncher",
  "version": "1.0.2",
  "description": "Launcher para RedM",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "package-win": "electron-packager . RedencionLauncher --platform=win32 --arch=x64 --icon=icon.ico --out=build --overwrite --extra-resource=gif-background.gif"
  },
  "devDependencies": {
    "electron": "^25.3.0",
    "electron-packager": "^15.5.2"
  }
}
```

---

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
