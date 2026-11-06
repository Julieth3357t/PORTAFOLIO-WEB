# Portafolio audiovisual de Julieth / Nicol Moya Quispe

Web estática en español, en rojo y negro, para GitHub Pages: presentación, habilidades técnicas, galería de diez videos con reproductor propio y contacto directo por WhatsApp, Instagram y correo.

Dirección publicada: **https://julieth3357t.github.io/PORTAFOLIO-WEB/**

## Qué incluye

- **Inicio (`#inicio`):** «Portafolio» y el nombre «Julieth / Nicol Moya Quispe», la biografía y accesos rápidos a WhatsApp, Instagram y correo.
- **Habilidades técnicas (`#habilidades`):** CapCut Pro (nivel 5), Figma (4), Photoshop (3) e Illustrator (3), en una escala del 1 al 5.
- **Trabajos (`#trabajos`):** pestañas para **Videos de Boda**, **Videos de Entrevista** y **Proyectos**, además de «Todos». Cada categoría se muestra en un **abanico**: una rueda roja que gira con las tarjetas y se maneja deslizando el dedo, con las flechas, con el teclado o con el trackpad. Al tocar una tarjeta lateral, esta pasa al centro; al tocar la central, se reproduce. «Ver todos» despliega la cuadrícula completa. Los videos se reproducen dentro de la página, sin abrir otras pestañas, con controles propios en rojo y negro: reproducir, barra de progreso, tiempo, volumen, pantalla completa y anterior/siguiente.
- **Contacto (`#contacto`):** WhatsApp `+591 75541660` (enlace `wa.me` con mensaje inicial), Instagram [@nabi\_\_films](https://www.instagram.com/nabi__films/) y correo `julieth3357t@gmail.com` (`mailto:`).

> **Instagram:** el usuario correcto lleva **dos** guiones bajos: `@nabi__films`. La cuenta `@nabi_films`, con uno solo, pertenece a otra persona. El verificador impide publicar ese enlace por error.

## Ver el portafolio en la computadora

Con Node.js 20 o superior, desde esta carpeta:

```powershell
npm.cmd run dev
```

Abrir **http://127.0.0.1:4173/PORTAFOLIO-WEB/**. En macOS/Linux se puede usar `npm` en lugar de `npm.cmd`. El servidor reproduce la subcarpeta de GitHub Pages y permite adelantar los videos. Se detiene con `Ctrl+C`.

La web usa solo HTML, CSS y JavaScript, sin dependencias, servicios externos ni claves. La tipografía (Bricolage Grotesque, licencia SIL OFL) se sirve desde `assets/fonts/`.

## Carpetas

```text
PORTAFOLIO-WEB/
├── index.html                  # Página: inicio, habilidades, trabajos, contacto y reproductor
├── assets/
│   ├── css/styles.css          # Estilos; colores definidos al comienzo
│   ├── js/data.js              # Categorías y fichas de los diez videos
│   ├── js/app.js               # Pestañas, abanico, reproductor, habilidades y menú
│   ├── fonts/                  # Tipografía
│   ├── images/                 # Retrato, favicon e imagen para redes
│   ├── posters/                # Portadas de cada video
│   └── videos/                 # Diez MP4 optimizados
├── docs/                       # Análisis audiovisual, inventario y referencias
├── media/originales/           # Archivos fuente, ignorados por Git
├── scripts/                    # Verificación, servidor, build y preparación de medios
├── .github/workflows/pages.yml # Publicación automática en GitHub Pages
├── .nojekyll
├── robots.txt
└── sitemap.xml
```

`dist/` se genera para publicar y `.tools/` contiene herramientas temporales. Ambas carpetas están excluidas de Git.

## Publicar en GitHub Pages

El repositorio es `https://github.com/Julieth3357t/PORTAFOLIO-WEB.git`, rama `main`.

1. En GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions** (solo la primera vez).
2. Verificar y subir desde esta carpeta:

   ```powershell
   npm.cmd run build
   git status
   git add .
   git commit -m "Actualizar portafolio"
   git push origin main
   ```

3. En la pestaña **Actions**, esperar a que termine **Publicar Nabi Films en GitHub Pages**. El workflow verifica los archivos, genera `dist/` y publica solo su contenido.

Todas las rutas son relativas (`./assets/...`), así que funcionan dentro de la subcarpeta `/PORTAFOLIO-WEB/`. GitHub Pages distingue mayúsculas y minúsculas en los nombres de archivo, y Windows no. Por eso el verificador compara cada ruta con el nombre exacto en disco.

Los videos pesan unos **101 MiB** en total y el mayor ocupa unos 17 MiB. Están por debajo de los límites de GitHub (100 MiB por archivo) y de GitHub Pages (1 GB por sitio).

## Editar el contenido

- **Textos de inicio, habilidades y contacto:** `index.html`. Al cambiar un nivel de habilidad, actualizar `data-level`, la cantidad de segmentos `class="on"` y el texto «Nivel N de 5»; el verificador los compara.
- **Videos y categorías:** `assets/js/data.js`. Cada pieza lleva `category` con `boda`, `entrevista` o `proyectos`. El orden de la lista define la vista «Todos». Las piezas `horizontal` ocupan dos columnas.
- **Agregar un video:** copiar el MP4 a `assets/videos/` y la portada JPG a `assets/posters/` con el mismo nombre, en minúsculas y sin espacios. Añadir la ficha en `data.js`, actualizar los contadores de las pestañas en `index.html` y registrar el origen en `scripts/media-manifest.json`. El verificador espera diez videos: ajustar esa cifra en `scripts/check.mjs` si cambia la selección.
- **Colores:** variables al inicio de `assets/css/styles.css` (`--red`, `--red-deep`, `--black`…).
- **Forma del abanico:** variables de `.fan` en `assets/css/styles.css`. `--card-w` es el ancho de la tarjeta; `--pivot` la distancia al eje de giro; `--step` los grados entre tarjetas; `--range` cuántas tarjetas se ven a cada lado; `--crop` cuánto se recorta el centro de la rueda. Hay valores para móvil, tableta (761 px) y escritorio (1081 px). El texto curvo del centro está en `index.html`, dentro de `.fan-hub`.

## Verificar

```powershell
npm.cmd run check
npm.cmd run build
node scripts/serve.mjs --dist
```

El chequeo revisa el encabezado y la biografía, los niveles de habilidad, las tres categorías y sus contadores, los enlaces de contacto, las rutas (incluidas mayúsculas y minúsculas), las anclas, la sintaxis de JavaScript y el tamaño de los medios.

## Regenerar los medios web (opcional)

Las versiones optimizadas ya están incluidas; no hace falta FFmpeg para publicar. Para volver a procesar los originales, instalar FFmpeg y definir `FFMPEG_PATH`:

```powershell
$env:FFMPEG_PATH = 'ffmpeg'
npm.cmd run media
npm.cmd run build
```

La correspondencia entre archivos originales y nombres web está en `scripts/media-manifest.json`.
