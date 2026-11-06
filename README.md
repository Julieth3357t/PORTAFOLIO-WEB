# Nabi Films — Portafolio audiovisual

Web estática en español con diez proyectos, filtros por categoría, fichas con reproductor de video y contacto directo por WhatsApp, Instagram y correo. Diseño oscuro con acentos rojos, basado en el retrato y las referencias entregadas.

## Ver el portafolio

Con Node.js 20 o superior, desde esta carpeta:

```powershell
npm.cmd run dev
```

Abrir **http://127.0.0.1:4173/PORTAFOLIO-WEB/**. En macOS/Linux se puede usar `npm` en lugar de `npm.cmd`. El servidor reproduce la subcarpeta que usará GitHub Pages y permite adelantar los videos mediante solicitudes por rangos. Se detiene con `Ctrl+C`.

La web usa HTML, CSS y JavaScript sin dependencias de ejecución, servicios de pago ni claves. También se puede abrir `index.html` directamente para una vista básica.

## Carpetas

```text
PORTAFOLIO-WEB/
├── index.html                  # Página principal y datos de contacto
├── assets/
│   ├── css/styles.css          # Estilos adaptables
│   ├── js/data.js              # Catálogo y textos de los diez proyectos
│   ├── js/app.js               # Filtros, reproductor y menú
│   ├── images/                # Retrato, favicon e imagen social
│   ├── posters/               # Portadas extraídas de cada video
│   └── videos/                # Diez MP4 optimizados, listos para subir
├── docs/
│   ├── analisis-audiovisual.md # Lectura visual y conclusiones editoriales
│   ├── inventario-medios.json # Correspondencia y datos técnicos
│   └── referencias/           # Referencias visuales originales
├── media/originales/          # Archivos fuente conservados, ignorados por Git
├── scripts/                   # Verificación, servidor y preparación
├── .github/workflows/pages.yml
├── .gitignore
├── .nojekyll
├── robots.txt
└── sitemap.xml
```

`dist/` se genera para publicar. `.tools/` contiene herramientas temporales de preparación. Ambas carpetas están excluidas de Git.

## Subir al repositorio y activar GitHub Pages

El remoto existente es `https://github.com/Julieth3357t/PORTAFOLIO-WEB.git` y la rama actual es `main`.

1. En el repositorio de GitHub, entrar en **Settings → Pages → Build and deployment → Source** y elegir **GitHub Actions**. Es la configuración indicada en la [documentación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
2. Comprobar los archivos y subirlos desde esta carpeta:

   ```powershell
   npm.cmd run build
   git status
   git add .
   git commit -m "Preparar portafolio de Nabi Films para GitHub Pages"
   git push origin main
   ```

3. En **Actions**, esperar a que termine **Publicar Nabi Films en GitHub Pages**. El workflow verifica los recursos, genera `dist/` y publica únicamente su contenido. Si se habilitó Pages después del push, abrir el workflow y ejecutar **Run workflow**.
4. Tras un despliegue exitoso, la dirección esperada es **https://julieth3357t.github.io/PORTAFOLIO-WEB/**. El estado de la publicación se puede consultar en la pestaña **Actions** del repositorio.

No subir manualmente `media/originales/`, `.tools/` ni `dist/`. `git add .` respeta el `.gitignore` incluido. Los originales no estaban en el historial de Git al iniciar esta preparación.

Los videos web pesan aproximadamente **105,5 MB en total**, y el más grande ocupa **18,3 MB**. Todos quedan por debajo de los 25 MiB admitidos para subir un archivo desde el navegador y de los 100 MiB que admite Git normal. Ver [límites de archivos de GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github). El sitio está por debajo del límite publicado de 1 GB de [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## Editar el contenido

- **Proyectos:** cambiar títulos, categorías, descripciones y textos alternativos en `assets/js/data.js`.
- **Identidad, contacto y texto principal:** editar `index.html`. Se usó la grafía **Jhulieth** del nombre del retrato; conviene confirmar esa escritura profesional. Los contactos son los facilitados por la usuaria.
- **Apariencia:** editar `assets/css/styles.css`; los colores están definidos al comienzo.
- **Agregar o quitar proyectos:** actualizar el catálogo, sus archivos de video/portada, los contadores y la alternativa sin JavaScript en `index.html`, y el inventario de medios. El verificador actual espera los diez videos entregados; ajustar esa validación cuando cambie la selección.
- **Cambiar de repositorio o dominio:** las rutas de recursos son relativas. Actualizar además la URL canónica, los metadatos sociales y los datos estructurados de `index.html`, más `robots.txt`, `sitemap.xml` y el prefijo de previsualización en `scripts/serve.mjs`.

## Verificar y generar la publicación

```powershell
npm.cmd run check
npm.cmd run build
node scripts/serve.mjs --dist
```

El chequeo revisa recursos, anclas, nombres de archivos, categorías, sintaxis de JavaScript, datos de contacto, tamaño de medios y exclusión de originales. La generación reemplaza únicamente `dist/` y copia los archivos públicos.

La revisión visual automatizada de escritorio/móvil quedó pendiente: la herramienta de navegador no pudo determinar la URL de Chrome. Antes de publicar conviene abrir la vista local, revisar el diseño en el teléfono y reproducir las piezas. La revisión técnica de las diez versiones web y de las rutas se documenta en `docs/inventario-medios.json`.

## Regenerar los medios web (opcional)

Las versiones optimizadas ya están incluidas. **No hace falta instalar FFmpeg ni regenerar los videos para subir o publicar el sitio.**

Para volver a procesar los originales, instalar FFmpeg y definir `FFMPEG_PATH`, o usar la copia local disponible en `.tools/`. Ejemplo con FFmpeg instalado en el sistema:

```powershell
$env:FFMPEG_PATH = 'ffmpeg'
npm.cmd run media
npm.cmd run build
```

La correspondencia entre nombres originales, nombres web y segundos elegidos para las portadas está en `scripts/media-manifest.json`. La preparación conserva la duración, usa MP4/H.264 con audio AAC, escala el lado mayor a un máximo de 1280 px y prepara el inicio progresivo (`faststart`). Guarda los originales sin sobrescribirlos.

El análisis visual inicial puede repetirse con `scripts/analyze-media.mjs` cuando estén disponibles sus herramientas locales; sus hojas de contacto son material de trabajo y quedan dentro de `.tools/`.
