# Portafolio audiovisual de Julieth / Nicol Moya Quispe

Web estática en español, en rojo y negro, para GitHub Pages: presentación, habilidades técnicas, galería de catorce videos con reproductor propio y contacto directo por WhatsApp, Instagram y correo.

Dirección publicada: **https://julieth3357t.github.io/PORTAFOLIO-WEB/**

## Qué incluye

- **Intro (primera visita):** cuenta regresiva de película 3·2·1 que se abre en iris sobre el título. Dura menos de 2 segundos, aparece una vez por sesión y se salta con cualquier toque, tecla o desplazamiento.
- **Inicio (`#inicio`):** título de apertura a pantalla completa. Detrás corre un reel en rojo y negro hecho con los videos del portafolio; encima, grano de película, visor de cámara con código de tiempo, bandas de cinemascope y el retrato. Se ve «Portafolio», el nombre «Julieth / Nicol Moya Quispe», los accesos a WhatsApp, Instagram y correo y la biografía. Al desplazar hay parallax.
- **Habilidades (`#habilidades`):** el título, el panel y las filas aparecen al llegar. Los niveles cuentan hasta su valor mientras el cabezal recorre la pista, y el panel se inclina con el mouse.
- **Habilidades técnicas (`#habilidades`):** CapCut Pro (nivel 5), Figma (4), Photoshop (3) e Illustrator (3), en una escala del 1 al 5.
- **Trabajos (`#trabajos`):** pestañas para **Videos de Boda**, **Videos de Proyectos** y **Proyectos Universitarios**, además de «Todos». Cada categoría se muestra en un **abanico**: una rueda roja que gira con las tarjetas y se maneja deslizando el dedo, con las flechas, con el teclado o con el trackpad. Al tocar una tarjeta lateral, esta pasa al centro; al tocar la central, se reproduce. «Ver todos» despliega la cuadrícula completa. Los videos se reproducen dentro de la página, sin abrir otras pestañas, con controles propios en rojo y negro: reproducir, barra de progreso, tiempo, volumen, pantalla completa y anterior/siguiente.
- **Final (`#contacto`):** créditos de cierre. Una franja «Bodas ✳ Testimoniales ✳ Proyectos de diseño ✳ Videos» avanza con el scroll; el bloque rojo tiene una luz que sigue al mouse y botones magnéticos; los créditos suben hasta «Fin», y «Rebobinar al inicio» vuelve arriba con efecto VHS.
- **Contacto:** WhatsApp `+591 75541660` (enlace `wa.me` con mensaje inicial), Instagram [@nabi\_\_films](https://www.instagram.com/nabi__films/) y correo `julieth3357t@gmail.com` (`mailto:`).

> **Instagram:** el usuario correcto lleva **dos** guiones bajos: `@nabi__films`. La cuenta `@nabi_films`, con uno solo, pertenece a otra persona. El verificador impide publicar ese enlace por error.

## Ver el portafolio en la computadora

Con Node.js 20 o superior, desde esta carpeta:

```powershell
npm.cmd run dev
```

Abrir **http://127.0.0.1:4173/PORTAFOLIO-WEB/**. En macOS/Linux se puede usar `npm` en lugar de `npm.cmd`. El servidor reproduce la subcarpeta de GitHub Pages y permite adelantar los videos. Se detiene con `Ctrl+C`.

La web usa HTML, CSS y JavaScript, sin servicios externos ni claves. Desde `assets/` se sirven la tipografía Bricolage Grotesque (licencia SIL OFL) y GSAP 3.13 con ScrollTrigger (`assets/vendor/gsap/`, licencia estándar gratuita de GSAP). Los efectos están en `assets/js/motion.js`. Sin GSAP, o con «reducir movimiento» activado en el dispositivo, todo el contenido sigue visible y funcional.

## Carpetas

```text
PORTAFOLIO-WEB/
├── index.html                  # Página: inicio, habilidades, trabajos, contacto y reproductor
├── assets/
│   ├── css/styles.css          # Estilos; colores definidos al comienzo
│   ├── js/data.js              # Categorías y fichas de los catorce videos
│   ├── js/app.js               # Pestañas, abanico, reproductor, habilidades y menú
│   ├── fonts/                  # Tipografía
│   ├── images/                 # Retrato, favicon e imagen para redes
│   ├── posters/                # Portadas de cada video
│   └── videos/                 # Catorce MP4 optimizados y reel de portada
├── docs/                       # Análisis audiovisual, inventario y referencias
├── media/originales/           # Archivos fuente, ignorados por Git
├── scripts/                    # Verificación, servidor, build y preparación de medios
├── .github/workflows/pages.yml # Publicación automática en GitHub Pages
├── .nojekyll
├── robots.txt
└── sitemap.xml
```

`dist/` se genera para publicar y `.tools/` contiene herramientas temporales. Ambas carpetas están excluidas de Git.

Los cuatro originales nuevos están junto a los anteriores en `media/originales/`. Las copias idénticas que llegaron en la raíz se conservaron en `media/originales/copias-recibidas/`; tampoco se suben a GitHub.

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

`npm run build` agrega a cada CSS y JS una huella de su contenido (`styles.css?v=…`). Así el navegador nunca mezcla un HTML nuevo con estilos guardados en caché, que fue lo que descuadró el inicio en una publicación anterior.

Todas las rutas son relativas (`./assets/...`), así que funcionan dentro de la subcarpeta `/PORTAFOLIO-WEB/`. GitHub Pages distingue mayúsculas y minúsculas en los nombres de archivo, y Windows no. Por eso el verificador compara cada ruta con el nombre exacto en disco.

Los catorce videos pesan unos **149,4 MiB** en total y el mayor ocupa unos 17,4 MiB. Con el reel, las portadas y el resto del sitio, la publicación sigue por debajo del límite de GitHub Pages de 1 GB; todos los videos individuales están por debajo de los 100 MiB admitidos por GitHub.

## Editar el contenido

- **Textos de inicio, habilidades y contacto:** `index.html`. Al cambiar un nivel de habilidad, actualizar `data-level`, la cantidad de segmentos `class="on"` y el texto «Nivel N de 5»; el verificador los compara.
- **Videos y categorías:** `assets/js/data.js`. Cada pieza lleva `category` con `boda` (Videos de Boda), `entrevista` (Videos de Proyectos) o `proyectos` (Proyectos Universitarios); los nombres visibles están en `PORTFOLIO_CATEGORIES`. El orden de la lista define la vista «Todos». Las piezas `horizontal` ocupan dos columnas.
- **Agregar un video:** copiar el MP4 a `assets/videos/` y la portada JPG a `assets/posters/` con el mismo nombre, en minúsculas y sin espacios. Añadir la ficha en `data.js`, actualizar los contadores de las pestañas y los enlaces alternativos de `index.html`, y registrar el origen en `scripts/media-manifest.json`. El verificador comprueba que el catálogo y el manifiesto coincidan.
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

Para regenerar solo algunas piezas, pasar sus identificadores al script, por ejemplo `node scripts/prepare-media.mjs boda-eidy-carlos distrito-10-version-1`. Las demás versiones web se mantienen sin cambios.

El reel del inicio (`assets/videos/reel.mp4`, unos 0,9 MiB, y su portada `assets/images/reel-poster.jpg`) se regenera con `node scripts/make-reel.mjs`. Ahí se eligen los fragmentos; no incluye la pieza sensible ni el montaje con escenas de terceros.
