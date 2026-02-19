# Gisela.UGC - Portafolio de Creadora de Contenido

![Gisela UGC](https://img.shields.io/badge/UGC-Content%20Creator-C77D8D?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)

Sitio web profesional y portafolio personal de **Gisela Saldarriaga**, creadora de contenido UGC (User Generated Content) especializada en crear contenido auténtico y elegante que conecta marcas con su audiencia.

## ✨ Características

- 🎨 **Diseño Moderno** - Interfaz elegante con animaciones suaves y efectos glassmorphism
- 🌙 **Modo Oscuro/Claro** - Soporte completo para temas claro y oscuro
- 🌐 **Bilingüe** - Disponible en Español e Inglés (i18n)
- 📱 **Responsive** - Optimizado para móviles, tablets y desktop
- ⚡ **Alto Rendimiento** - Construido con Vite para carga ultrarrápida
- 🎭 **Animaciones** - Micro-interacciones y transiciones fluidas

## 🛠️ Tecnologías

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Estilos:** Tailwind CSS
- **Internacionalización:** react-i18next
- **Iconos:** Lucide React
- **UI Components:** Radix UI + shadcn/ui

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Torrente179/GiseUGC.git

# Entrar al directorio
cd GiseUGC

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Vista previa de la build de producción |
| `npm run lint` | Ejecuta el linter |
| `npm run video:encode` | Genera versiones `preview` y `mobile` de los MP4 |
| `npm run video:encode:dry` | Muestra comandos ffmpeg sin ejecutar |
| `npm run security:cf:baseline:dry` | Muestra payload de reglas Cloudflare (sin aplicar) |
| `npm run security:cf:baseline:apply` | Aplica baseline de rate-limit/firewall en Cloudflare |
| `npm run security:cf:monitor:dry` | Ejecuta monitoreo de spike (solo reporte) |
| `npm run security:cf:monitor:apply` | Ejecuta monitoreo de spike con acciones |

## 🎬 Pipeline de Video (R2/CDN)

Genera dos salidas por cada clip en `public/uploads/videos`:

- `*-preview.mp4`: loop corto (4s por defecto), pensado para tarjetas/carruseles.
- `*-mobile.mp4`: versión completa optimizada para modal/theater en móvil.
- Defaults actuales (prioridad calidad + velocidad):
  - Preview: `~700 KB`, ancho máximo `480px`
  - Mobile: `~5 MB`, ancho máximo `720px`, audio `96 kbps`

Comando base:

```bash
npm run video:encode
```

Opciones útiles:

```bash
# Ajustar presupuesto y sobreescribir salidas
npm run video:encode -- --mobile-target-mb 6 --preview-target-kb 820 --overwrite

# Procesar solo clips específicos
npm run video:encode -- ugc-lifestyle-review.mp4 ugc-brand-spokesperson.mp4
```

Salida:
- Videos en `tmp/video-encodes/`
- Reporte CSV en `tmp/video-encodes/manifest.csv`

## 🔐 Seguridad (anti-cost spike + media firmada)

Se agregó un kit de hardening en `security/` con:

- Endpoint de sesión de media firmada: `/api/media/session`
- Scripts de Cloudflare para baseline y modo emergencia
- Workflow programado cada 5 minutos para activar/desactivar protección automáticamente
- Plantilla de Worker para proteger `videos/main/*` con token `st` + `exp`

Ver guía completa en `security/README.md`.

## 📂 Estructura del Proyecto

```
GiseUGC/
├── public/
│   └── uploads/          # Imágenes y assets
├── src/
│   ├── components/       # Componentes React
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── Services.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Contact.tsx
│   │   └── ui/           # Componentes UI reutilizables
│   ├── i18n/             # Configuración de idiomas
│   │   ├── locales/
│   │   │   ├── en.json   # Traducciones en inglés
│   │   │   └── es.json   # Traducciones en español
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── package.json
```

## 🎯 Secciones

1. **Hero** - Presentación principal con imagen y call-to-action
2. **Servicios** - Tipos de contenido UGC disponibles
3. **Portafolio** - Galería de trabajos realizados
4. **Testimonios** - Opiniones de clientes satisfechos
5. **Contacto** - Formulario para conectar

## 🌐 Demo

Visita el sitio en vivo: [giseugc.com](https://giseugc.com)

## 📄 Licencia

Este proyecto es privado y pertenece a Gisela Saldarriaga.

---

<p align="center">
  Desarrollado con 💗 para <strong>Gisela.UGC</strong>
</p>
