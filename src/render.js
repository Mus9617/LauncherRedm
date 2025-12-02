const { useEffect, useRef, useState } = React;
const h = React.createElement;

const EMPTY_CONFIG = {
  redmPath: "",
  cachePath: "",
  serverAddress: "",
};

const GALLERY_IMAGES = [
  "https://redencion.cloud/galeria/oldredencion.jpg",
  "https://redencion.cloud/galeria/banada.jpg",
  "https://redencion.cloud/galeria/artesanos.png",
  "https://redencion.cloud/galeria/amorentredosmundos.jpg",
  "https://redencion.cloud/galeria/caza.jpg",
  "https://redencion.cloud/galeria/valentine.JPG",
  "https://redencion.cloud/galeria/armeriavalentine.png",
  "https://redencion.cloud/galeria/policias.png",
  "https://redencion.cloud/galeria/tribus.png",
  "https://redencion.cloud/galeria/senorita.png",
];

function Status({ status }) {
  if (!status) return null;
  const tone =
    status.type === "error"
      ? "status error"
      : status.type === "info"
      ? "status info"
      : "status success";
  return h("div", { className: tone }, status.text);
}

function Field({ label, value, placeholder, onChange, actionLabel, onAction, hint }) {
  return h(
    "div",
    { className: "field" },
    h(
      "div",
      { className: "field-label" },
      h("span", null, label),
      hint ? h("small", null, hint) : null
    ),
    h(
      "div",
      { className: "field-row" },
      h("input", {
        value: value || "",
        placeholder,
        onChange: (e) => onChange(e.target.value),
      }),
      actionLabel
        ? h(
            "button",
            { className: "ghost", onClick: onAction },
            actionLabel
          )
        : null
    )
  );
}

function HeroStat({ label, value, className }) {
  return h(
    "div",
    { className: "hero-stat" + (className ? ` ${className}` : "") },
    h("span", { className: "hero-stat-label" }, label),
    h("span", { className: "hero-stat-value" }, value || "Pendiente")
  );
}

function Snowfall() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const flakes = Array.from({ length: 220 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.5 + Math.random() * 2.8,
      s: 1 + Math.random() * 2.5,
      w: -1.2 + Math.random() * 2.6,
    }));

    let active = true;
    function draw() {
      if (!active) return;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#dee4fd";
      flakes.forEach((f) => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        f.y += f.s;
        f.x += f.w;
        if (f.y > h) f.y = -10;
        if (f.x > w) f.x = -5;
        if (f.x < -5) f.x = w + 5;
      });
      requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      active = false;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return h("canvas", {
    ref: canvasRef,
    className: "snow-canvas",
  });
}

function GalleryModal({ open, onClose }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 3200);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  return h(
    "div",
    { className: "gallery-backdrop", onClick: onClose },
    h(
      "div",
      { className: "gallery-modal", onClick: (e) => e.stopPropagation() },
      h("div", { className: "gallery-track" }, [
        h("img", { key: index, src: GALLERY_IMAGES[index], alt: "Recuerdo de Redencion" }),
      ]),
      h(
        "div",
        { className: "gallery-controls" },
        h(
          "button",
          {
            className: "ghost",
            onClick: () => setIndex((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length),
          },
          "Anterior"
        ),
        h(
          "button",
          { className: "ghost", onClick: () => setIndex((i) => (i + 1) % GALLERY_IMAGES.length) },
          "Siguiente"
        )
      )
    )
  );
}

function GalleryPreview({ onOpen }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return h(
    "div",
    { className: "panel gallery-preview" },
    h("div", { className: "panel-head" }, "Galeria"),
    h("div", { className: "gallery-card" }, [
      h("img", { src: GALLERY_IMAGES[index], alt: "Preview galeria" }),
      h(
        "div",
        { className: "gallery-overlay" },
        h("button", { className: "ghost", onClick: onOpen }, "Abrir galeria")
      ),
    ])
  );
}

function App() {
  const [config, setConfig] = useState(EMPTY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    window.electronAPI.loadConfig().then((cfg) => {
      setConfig({ ...EMPTY_CONFIG, ...(cfg || {}) });
      setLoading(false);
    });
  }, []);

  const updateField = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const saveConfig = async () => {
    const saved = await window.electronAPI.saveConfig(config);
    setConfig(saved);
    setStatus({ type: "success", text: "Configuracion guardada." });
  };

  const pickCache = async () => {
    const res = await window.electronAPI.pickCache();
    if (res?.ok && res.config) {
      setConfig(res.config);
      setStatus({ type: "success", text: "Ruta de cache actualizada." });
    }
  };

  const pickRedm = async () => {
    const res = await window.electronAPI.pickRedm();
    if (res?.ok && res.config) {
      setConfig(res.config);
      setStatus({ type: "success", text: "Ejecutable de RedM seleccionado." });
    }
  };

  const clearCache = async () => {
    const res = await window.electronAPI.clearCache();
    setStatus({ type: res.ok ? "success" : "error", text: res.message });
  };

  const connect = async () => {
    setStatus(null);
    setConnecting(true);
    const res = await window.electronAPI.connect();
    setConnecting(false);
    setStatus({ type: res.ok ? "success" : "error", text: res.message });
  };

  const openCache = async () => {
    const res = await window.electronAPI.openCacheFolder();
    if (!res?.ok) setStatus({ type: "info", text: "Configura la ruta de cache primero." });
  };

  const ready = Boolean(config.redmPath && config.cachePath);

  return h(
    "div",
    { className: "shell" },
    h(Snowfall, null),
    connecting
      ? h(
          "div",
          { className: "veil" },
          h("div", { className: "veil-card" }, "Lanzando RedM...")
        )
      : null,
    h(
      "header",
      { className: "hero" },
      h("div", { className: "brand" }, "REDENCION"),
      h(
        "div",
        { className: "hero-copy" },
        h("p", { className: "eyebrow" }, "Frontier Ready"),
        h("h1", null, "REDENCION"),
        h(
          "p",
          { className: "lede" },
          "Configura tus rutas una sola vez y cabalga directo al servidor."
        ),
        h(
          "div",
          { className: "hero-actions" },
          h(
            "button",
            { className: "primary", onClick: connect, disabled: connecting || loading || !ready },
            connecting ? "Abriendo RedM..." : ready ? "Conectar ahora" : "Configura rutas"
          ),
          h(
            "button",
            { className: "ghost", onClick: saveConfig, disabled: loading },
            "Guardar ajustes"
          ),
          h(
            "button",
            { className: "ghost", onClick: clearCache, disabled: loading },
            "Borrar cache"
          ),
          h(
            "button",
            { className: "ghost", onClick: () => setGalleryOpen(true) },
            "Ver galeria"
          )
        ),
        h(
          "div",
          { className: "hero-stats" },
          h(HeroStat, {
            label: "Estado",
            value: ready ? "Listo" : "Pendiente",
            className: ready ? "ready" : "",
          }),
          h(HeroStat, { label: "RedM.exe", value: config.redmPath ? "Listo" : "Sin ruta" }),
          h(HeroStat, { label: "Cache", value: config.cachePath ? "Listo" : "Sin ruta" })
        )
      ),
      h(
        "div",
        { className: "hero-art" },
        h("div", { className: "video-frame" }, [
          h("video", {
            src: "hit.mp4",
            autoPlay: true,
            muted: true,
            loop: true,
            playsInline: true,
            poster: "favicon.ico",
          }),
        ])
      )
    ),
    h(
      "main",
      { className: "grid" },
      h(
        "section",
        { className: "panel slim" },
        h("div", { className: "panel-head" }, "Configuracion rapida"),
        h(Field, {
          label: "Ruta de RedM.exe",
          placeholder: "Selecciona el ejecutable de RedM",
          value: config.redmPath,
          onChange: (v) => updateField("redmPath", v),
          actionLabel: "Buscar",
          onAction: pickRedm,
        }),
        h(Field, {
          label: "Ruta de cache",
          placeholder: "Selecciona la carpeta de cache",
          value: config.cachePath,
          onChange: (v) => updateField("cachePath", v),
          actionLabel: "Buscar",
          onAction: pickCache,
          hint: "Se borrara completa al usar la opcion de limpieza.",
        }),
        h(
          "div",
          { className: "panel-actions" },
          h(
            "button",
            { className: "primary", onClick: saveConfig, disabled: loading },
            "Guardar"
          ),
          h("button", { className: "ghost", onClick: openCache }, "Abrir cache")
        ),
        h(Status, { status })
      ),
      h(GalleryPreview, { onOpen: () => setGalleryOpen(true) })
    ),
    h(GalleryModal, { open: galleryOpen, onClose: () => setGalleryOpen(false) })
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(h(App));
