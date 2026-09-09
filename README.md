# Web oficial · C.D. Iliplense

Sitio web estático del club de fútbol de Niebla (Huelva). Sin dependencias de compilación: se abre directamente en el navegador o se publica en GitHub Pages, Netlify o cualquier hosting estático.

## Estructura

```
index.html            Página única con todas las secciones
css/styles.css        Estilos propios (complementan Tailwind vía CDN)
js/data.js            ← DATOS DEL CLUB: lo único que hay que editar
js/app.js             Lógica: pinta las secciones, filtros, contador, formulario
assets/img/           Escudo, fotos de jugadores, galería y logos de patrocinadores
```

## Cómo actualizar la web (sin saber programar)

Todo el contenido vive en **`js/data.js`**. Ábrelo con cualquier editor de texto y modifica lo que necesites:

| Qué quiero cambiar | Dónde |
|---|---|
| Nombre, lema, campo, teléfono, redes | bloque `club` |
| Añadir un resultado o un partido | lista `partidos` (pon `goles: [2, 1]` cuando se juegue; `goles: null` si está pendiente) |
| Clasificación | lista `clasificacion` (los puntos y la diferencia se calculan solos) |
| Altas y bajas de jugadores | lista `plantilla` (`posicion`: `POR`, `DEF`, `CEN` o `DEL`) |
| Nueva noticia o crónica | lista `noticias` (`tipo`: `cronica`, `club` o `pueblo`) |
| Fotos de la jornada | lista `galeria` (sube la foto a `assets/img/galeria/` y pon la ruta en `src`) |
| Patrocinadores | lista `patrocinadores` (logo en `assets/img/patrocinadores/`) |

La web detecta automáticamente el **último resultado** y el **próximo partido** comparando las fechas con el día de hoy, y muestra una cuenta atrás.

### Escudo
Sustituye `assets/img/escudo.svg` por el escudo real (PNG con fondo transparente recomendado) y actualiza la ruta en `club.escudo`.

### Formulario de contacto
Al no haber servidor, el formulario abre el cliente de correo del visitante con los datos ya rellenos (`mailto:` a `club.contacto.email`). Si el club quiere recibir los envíos sin depender del correo del visitante, se puede conectar a un servicio gratuito tipo Formspree cambiando el `action` del formulario.

## Ver en local

```bash
# Con Python
python3 -m http.server 8080
# y abrir http://localhost:8080
```

## Publicar en GitHub Pages

Settings → Pages → Source: rama `main`, carpeta `/ (root)`. En unos minutos la web estará en `https://<usuario>.github.io/<repositorio>/`.

## Accesibilidad y rendimiento

- HTML semántico con landmarks, enlace "saltar al contenido", `aria-pressed` en filtros, `aria-live` en contadores, foco visible.
- Respeta `prefers-reduced-motion` y el modo oscuro del sistema (con interruptor manual).
- Tablas con desplazamiento horizontal en móvil; tarjetas con efecto hover; carga diferida de imágenes.
