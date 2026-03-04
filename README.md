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
| `npm run video:encode` | Genera versiones `preview` y `mobile` de los videos `.mp4/.mov` |
| `npm run video:encode:dry` | Muestra comandos ffmpeg sin ejecutar |
| `npm run video:catalog` | Genera catálogo runtime de `nuevos` con validación estricta en R2 |

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

Catálogo estricto para `public/uploads/videos/nuevos`:

```bash
npm run video:catalog
```

- Incluye clips en runtime solo si existen en R2 (`main`, `mobile`, `preview`, `poster`)
- Genera `src/data/nuevos-r2-ready.ts`
- También se ejecuta automáticamente antes de `npm run build` / `npm run build:dev`

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
