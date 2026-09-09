/* =========================================================================
   C.D. Iliplense — Lógica de la web
   Lee window.CLUB_DATA (js/data.js) y pinta todas las secciones.
   No hace falta editar este fichero para actualizar contenidos.
   ========================================================================= */
(function () {
  'use strict';

  const D = window.CLUB_DATA;
  if (!D) { console.error('No se ha cargado js/data.js'); return; }

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const NOMBRE = D.club.nombre;
  const esNuestro = (equipo) => equipo === NOMBRE;

  const fmtFecha = (iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) =>
    new Date(iso).toLocaleDateString('es-ES', opts);
  const fmtHora = (iso) => new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const iniciales = (nombre) => nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

  /* ------------------------------------------------------------------
     0. Datos generales del club repartidos por la página
     ------------------------------------------------------------------ */
  function pintarClub() {
    const c = D.club;
    $$('[data-club-nombre]').forEach((el) => (el.textContent = c.nombre));
    $$('[data-club-localidad]').forEach((el) => (el.textContent = c.localidad));
    $$('[data-club-lema]').forEach((el) => (el.textContent = c.lema));
    $$('[data-club-temporada]').forEach((el) => (el.textContent = c.temporada));
    $$('[data-club-competicion]').forEach((el) => (el.textContent = c.competicion));
    $$('[data-club-fundacion]').forEach((el) => (el.textContent = c.fundacion));
    $$('[data-club-escudo]').forEach((el) => (el.src = c.escudo));
    $$('[data-campo-nombre]').forEach((el) => (el.textContent = c.campo.nombre));
    $$('[data-campo-direccion]').forEach((el) => (el.textContent = c.campo.direccion));
    $$('[data-contacto-email]').forEach((el) => { el.textContent = c.contacto.email; el.href = 'mailto:' + c.contacto.email; });
    $$('[data-contacto-telefono]').forEach((el) => { el.textContent = c.contacto.telefono; el.href = 'tel:' + c.contacto.telefono.replace(/\s+/g, ''); });
    $('#anio').textContent = new Date().getFullYear();

    const q = encodeURIComponent(c.campo.mapaQuery);
    $('#mapa').src = `https://www.google.com/maps?q=${q}&output=embed`;
    $('#mapa-link').href = `https://www.google.com/maps/search/?api=1&query=${q}`;

    const redes = [
      ['instagram', 'Instagram', 'M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-3a1 1 0 100 2 1 1 0 000-2z'],
      ['facebook', 'Facebook', 'M14 8h3V4h-3c-2.76 0-5 2.24-5 5v2H6v4h3v7h4v-7h3l1-4h-4V9c0-.55.45-1 1-1z'],
      ['twitter', 'X (Twitter)', 'M17.5 3h3l-7.1 8.1L21.7 21h-6.3l-4.6-6-5.3 6H2.5l7.6-8.7L2.1 3h6.4l4.2 5.5L17.5 3zm-1.1 16h1.7L7.6 4.9H5.8L16.4 19z']
    ];
    $('#redes-sociales').innerHTML = redes
      .filter(([k]) => c.contacto[k])
      .map(([k, label, path]) => `
        <a href="${esc(c.contacto[k])}" target="_blank" rel="noopener" aria-label="${label}" class="icon-btn bg-club-800 text-white hover:bg-club-500">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${path}"/></svg>
        </a>`).join('');
  }

  /* ------------------------------------------------------------------
     1. Hero: último resultado y próximo partido (con cuenta atrás)
     ------------------------------------------------------------------ */
  function partidosOrdenados() {
    return [...D.partidos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }
  function ultimoJugado() {
    return partidosOrdenados().filter((p) => Array.isArray(p.goles)).pop() || null;
  }
  function proximo() {
    const ahora = Date.now();
    return partidosOrdenados().find((p) => !Array.isArray(p.goles) && new Date(p.fecha).getTime() > ahora - 3 * 3600e3)
      || partidosOrdenados().find((p) => !Array.isArray(p.goles)) || null;
  }
  // Devuelve resultado desde nuestra perspectiva: 'G' | 'E' | 'P'
  function signo(p) {
    if (!Array.isArray(p.goles)) return null;
    const [gl, gv] = p.goles;
    const nuestros = esNuestro(p.local) ? gl : gv;
    const rivales  = esNuestro(p.local) ? gv : gl;
    return nuestros > rivales ? 'G' : nuestros < rivales ? 'P' : 'E';
  }

  function pintarHero() {
    const u = ultimoJugado();
    const box = $('#ultimo-resultado');
    if (!u) {
      box.innerHTML = '<p class="text-club-100">Todavía no se ha disputado ningún partido esta temporada.</p>';
    } else {
      const s = signo(u);
      const etiqueta = { G: 'Victoria', E: 'Empate', P: 'Derrota' }[s];
      const color = { G: 'bg-green-500', E: 'bg-slate-400', P: 'bg-red-500' }[s];
      box.innerHTML = `
        <div class="flex items-center justify-between gap-3 text-xs text-club-200">
          <span>Jornada ${u.jornada} · ${esc(fmtFecha(u.fecha))}</span>
          <span class="rounded-full ${color} px-2.5 py-0.5 font-bold text-white">${etiqueta}</span>
        </div>
        <div class="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <p class="text-right font-semibold leading-tight ${esNuestro(u.local) ? 'text-white' : 'text-club-100'}">${esc(u.local)}</p>
          <p class="score">${u.goles[0]}<span class="opacity-50 mx-1">–</span>${u.goles[1]}</p>
          <p class="text-left font-semibold leading-tight ${esNuestro(u.visitante) ? 'text-white' : 'text-club-100'}">${esc(u.visitante)}</p>
        </div>
        ${u.cronica ? `<a href="#noticia-${u.cronica}" class="mt-3 inline-block text-sm font-semibold text-amber-300 hover:underline">Leer la crónica →</a>` : ''}`;
    }

    const p = proximo();
    const pbox = $('#proximo-encuentro');
    if (!p) {
      pbox.innerHTML = '<p class="text-club-100">No hay partidos programados. ¡Pronto publicaremos el calendario!</p>';
      return;
    }
    pbox.innerHTML = `
      <div class="text-xs text-club-200">Jornada ${p.jornada} · ${esc(fmtFecha(p.fecha, { weekday: 'long', day: 'numeric', month: 'long' }))} · ${esc(fmtHora(p.fecha))} h</div>
      <div class="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <p class="text-right font-semibold leading-tight ${esNuestro(p.local) ? 'text-white' : 'text-club-100'}">${esc(p.local)}</p>
        <p class="score text-amber-300">VS</p>
        <p class="text-left font-semibold leading-tight ${esNuestro(p.visitante) ? 'text-white' : 'text-club-100'}">${esc(p.visitante)}</p>
      </div>
      <p class="mt-2 text-center text-sm text-club-100">📍 ${esc(p.lugar)} ${esNuestro(p.local) ? '· <strong>¡Jugamos en casa!</strong>' : ''}</p>
      <div id="countdown" class="mt-4 flex justify-center gap-2" role="timer" aria-label="Cuenta atrás para el próximo partido"></div>
      <a href="#contacto" class="btn-accent mt-5 w-full justify-center">Ven a animar al equipo</a>`;

    const cd = $('#countdown');
    const objetivo = new Date(p.fecha).getTime();
    const tick = () => {
      let diff = Math.max(0, objetivo - Date.now());
      if (diff === 0) { cd.innerHTML = '<p class="font-display text-2xl text-amber-300 uppercase tracking-wider">¡Hoy es el día!</p>'; return; }
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5);  diff -= h * 36e5;
      const m = Math.floor(diff / 6e4);   diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      cd.innerHTML = [[d, 'días'], [h, 'horas'], [m, 'min'], [s, 'seg']]
        .map(([v, l]) => `<div class="countdown-box"><b>${String(v).padStart(2, '0')}</b><span>${l}</span></div>`).join('');
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------
     2. Clasificación + resultados + calendario
     ------------------------------------------------------------------ */
  function pintarClasificacion() {
    const filas = D.clasificacion
      .map((e) => ({ ...e, pts: e.pg * 3 + e.pe, dif: e.gf - e.gc }))
      .sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.gf - a.gf || a.equipo.localeCompare(b.equipo));
    const n = filas.length;
    const tbody = $('#tabla-clasificacion tbody');
    tbody.innerHTML = filas.map((e, i) => {
      const pos = i + 1;
      const badge = pos === 1 ? 'pos-promo' : pos > n - 2 ? 'pos-desc' : '';
      const forma = (e.forma || []).slice(-5).map((r) => `<span class="form-dot form-${r}" title="${{ G: 'Victoria', E: 'Empate', P: 'Derrota' }[r]}">${r}</span>`).join(' ');
      return `
        <tr class="${esNuestro(e.equipo) ? 'row-own' : ''} hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
          <td class="td text-center"><span class="pos-badge ${badge}">${pos}</span></td>
          <th scope="row" class="td text-left font-semibold">${esc(e.equipo)}${esNuestro(e.equipo) ? ' <span class="sr-only">(nuestro equipo)</span>' : ''}</th>
          <td class="td text-center font-display text-base">${e.pts}</td>
          <td class="td text-center">${e.pj}</td>
          <td class="td text-center text-green-700 dark:text-green-400">${e.pg}</td>
          <td class="td text-center">${e.pe}</td>
          <td class="td text-center text-red-700 dark:text-red-400">${e.pp}</td>
          <td class="td text-center">${e.gf}</td>
          <td class="td text-center">${e.gc}</td>
          <td class="td text-center">${e.dif > 0 ? '+' : ''}${e.dif}</td>
          <td class="td text-center"><span class="inline-flex gap-1">${forma}</span></td>
        </tr>`;
    }).join('');
  }

  function filaPartido(p) {
    const jugado = Array.isArray(p.goles);
    return `
      <li class="card match-row reveal">
        <div class="text-xs text-slate-500 dark:text-slate-400 w-14 shrink-0">
          <div class="font-bold">J${p.jornada}</div>
          <div>${esc(fmtFecha(p.fecha, { day: '2-digit', month: '2-digit' }))}</div>
        </div>
        <div class="team text-right ${esNuestro(p.local) ? 'own' : ''}">${esc(p.local)}</div>
        <div class="result ${jugado ? '' : 'pending'}">${jugado ? `${p.goles[0]}-${p.goles[1]}` : esc(fmtHora(p.fecha))}</div>
        <div class="team ${esNuestro(p.visitante) ? 'own' : ''}">${esc(p.visitante)}</div>
      </li>`;
  }
  function pintarPartidos() {
    const todos = partidosOrdenados();
    const jugados = todos.filter((p) => Array.isArray(p.goles)).slice(-4).reverse();
    const pendientes = todos.filter((p) => !Array.isArray(p.goles)).slice(0, 4);
    $('#lista-resultados').innerHTML = jugados.length ? jugados.map(filaPartido).join('') : '<li class="text-sm text-slate-500">Sin resultados todavía.</li>';
    $('#lista-calendario').innerHTML = pendientes.length ? pendientes.map(filaPartido).join('') : '<li class="text-sm text-slate-500">Calendario pendiente de publicar.</li>';
  }

  /* ------------------------------------------------------------------
     3. Plantilla con filtros y buscador
     ------------------------------------------------------------------ */
  const POSICIONES = { POR: 'Porteros', DEF: 'Defensas', CEN: 'Centrocampistas', DEL: 'Delanteros' };
  const POS_SINGULAR = { POR: 'Portero', DEF: 'Defensa', CEN: 'Centrocampista', DEL: 'Delantero' };

  function tarjetaJugador(j) {
    const foto = j.foto
      ? `<img src="${esc(j.foto)}" alt="" class="player-photo" loading="lazy">`
      : `<div class="player-photo" aria-hidden="true">${esc(iniciales(j.nombre))}</div>`;
    return `
      <article class="player-card reveal" tabindex="0" aria-label="${esc(j.nombre)}, dorsal ${j.dorsal}, ${POS_SINGULAR[j.posicion]}">
        <div class="relative">
          ${foto}
          <span class="player-number" aria-hidden="true">${j.dorsal}</span>
          ${j.capitan ? '<span class="player-tag">CAPITÁN</span>' : ''}
        </div>
        <div class="p-4">
          <h4 class="font-bold text-lg leading-tight">${esc(j.nombre)}</h4>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>${POS_SINGULAR[j.posicion]}</span>
            ${j.edad ? `<span>${j.edad} años</span>` : ''}
          </p>
        </div>
      </article>`;
  }

  function pintarPlantilla() {
    const grid = $('#plantilla-grid');
    grid.innerHTML = Object.entries(POSICIONES).map(([k, titulo]) => {
      const js = D.plantilla.filter((j) => j.posicion === k).sort((a, b) => a.dorsal - b.dorsal);
      if (!js.length) return '';
      return `
        <section class="pos-group" data-pos="${k}" aria-labelledby="pos-${k}">
          <h3 id="pos-${k}" class="subsection-title flex items-center gap-3">
            ${titulo}
            <span class="text-sm font-sans font-semibold text-slate-500 dark:text-slate-400 normal-case tracking-normal" data-count>${js.length}</span>
          </h3>
          <div class="mt-4 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            ${js.map(tarjetaJugador).join('')}
          </div>
        </section>`;
    }).join('');

    $('#cuerpo-tecnico').innerHTML = (D.cuerpoTecnico || []).map((t) => `
      <li class="card p-4 flex items-center gap-4 reveal">
        <span class="h-12 w-12 shrink-0 rounded-full bg-club-800 text-white flex items-center justify-center font-display text-lg" aria-hidden="true">${esc(iniciales(t.nombre))}</span>
        <div><p class="font-bold">${esc(t.nombre)}</p><p class="text-sm text-slate-500 dark:text-slate-400">${esc(t.cargo)}</p></div>
      </li>`).join('');

    // Filtros y buscador
    let posActiva = 'ALL';
    let texto = '';
    const contador = $('#plantilla-contador');
    const aplicar = () => {
      const q = texto.trim().toLowerCase();
      let visibles = 0;
      $$('.pos-group', grid).forEach((grupo) => {
        const okPos = posActiva === 'ALL' || grupo.dataset.pos === posActiva;
        let n = 0;
        $$('.player-card', grupo).forEach((card) => {
          const label = card.getAttribute('aria-label').toLowerCase();
          const ok = okPos && (!q || label.includes(q));
          card.classList.toggle('hidden', !ok);
          if (ok) n++;
        });
        grupo.classList.toggle('hidden', n === 0);
        $('[data-count]', grupo).textContent = n;
        visibles += n;
      });
      contador.textContent = `${visibles} jugador${visibles === 1 ? '' : 'es'} mostrado${visibles === 1 ? '' : 's'}.`;
      let vacio = $('#plantilla-vacio');
      if (!visibles) {
        if (!vacio) {
          vacio = document.createElement('p');
          vacio.id = 'plantilla-vacio';
          vacio.className = 'text-center text-slate-500 dark:text-slate-400 py-8';
          grid.appendChild(vacio);
        }
        vacio.textContent = 'No hay jugadores que coincidan con la búsqueda.';
      } else if (vacio) vacio.remove();
    };
    $$('#filtros-posicion .chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        posActiva = btn.dataset.pos;
        $$('#filtros-posicion .chip').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        aplicar();
      });
    });
    $('#buscar-jugador').addEventListener('input', (e) => { texto = e.target.value; aplicar(); });
  }

  /* ------------------------------------------------------------------
     4. Noticias y galería
     ------------------------------------------------------------------ */
  function pintarNoticias() {
    const grid = $('#noticias-grid');
    const tipoLabel = { cronica: 'Crónica', club: 'Club', pueblo: 'Pueblo' };
    const noticias = [...D.noticias].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    grid.innerHTML = noticias.map((n) => `
      <article id="noticia-${n.id}" class="card news-card reveal scroll-mt-24" data-tipo="${n.tipo}">
        <div class="news-cover">${n.imagen ? `<img src="${esc(n.imagen)}" alt="" loading="lazy">` : esc(tipoLabel[n.tipo] || 'Noticia')}</div>
        <div class="p-5 flex flex-col flex-1">
          <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span class="badge badge-${n.tipo}">${tipoLabel[n.tipo] || n.tipo}</span>
            <time datetime="${n.fecha}">${esc(fmtFecha(n.fecha, { day: 'numeric', month: 'long', year: 'numeric' }))}</time>
          </div>
          <h3 class="mt-3 font-bold text-lg leading-snug">${esc(n.titulo)}</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 flex-1">${esc(n.resumen)}</p>
        </div>
      </article>`).join('');

    $$('#filtros-noticias .chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tipo = btn.dataset.tipo;
        $$('#filtros-noticias .chip').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        $$('.news-card', grid).forEach((c) => c.classList.toggle('hidden', tipo !== 'ALL' && c.dataset.tipo !== tipo));
      });
    });
  }

  function pintarGaleria() {
    const grid = $('#galeria-grid');
    grid.innerHTML = D.galeria.map((g, i) => `
      <button type="button" class="gallery-item reveal" data-index="${i}" aria-label="Ampliar foto: ${esc(g.alt)}">
        ${g.src ? `<img src="${esc(g.src)}" alt="" loading="lazy">` : `<span class="placeholder" aria-hidden="true"><svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.6-4.6a2 2 0 012.8 0L16 16m-2-2l1.6-1.6a2 2 0 012.8 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></span>`}
        <span class="caption">${esc(g.jornada)}</span>
      </button>`).join('');

    const dlg = $('#lightbox');
    const media = $('#lightbox-media');
    const cap = $('#lightbox-caption');
    let actual = 0;
    const mostrar = (i) => {
      actual = (i + D.galeria.length) % D.galeria.length;
      const g = D.galeria[actual];
      media.innerHTML = g.src ? `<img src="${esc(g.src)}" alt="${esc(g.alt)}">` : `<div class="placeholder"><p class="text-center px-6">${esc(g.alt)}</p></div>`;
      cap.textContent = `${g.jornada} · ${g.alt} (${actual + 1}/${D.galeria.length})`;
    };
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.gallery-item');
      if (!btn) return;
      mostrar(Number(btn.dataset.index));
      if (typeof dlg.showModal === 'function') dlg.showModal();
    });
    $('#lightbox-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') mostrar(actual + 1);
      if (e.key === 'ArrowLeft') mostrar(actual - 1);
    });
  }

  /* ------------------------------------------------------------------
     5. Patrocinadores y formulario
     ------------------------------------------------------------------ */
  function pintarPatrocinadores() {
    $('#patrocinadores-grid').innerHTML = D.patrocinadores.map((p) => {
      const inner = p.logo ? `<img src="${esc(p.logo)}" alt="${esc(p.nombre)}" loading="lazy">` : `<span>${esc(p.nombre)}</span>`;
      return `<li class="reveal">${p.web
        ? `<a href="${esc(p.web)}" target="_blank" rel="noopener sponsored" class="sponsor focus-ring">${inner}</a>`
        : `<div class="sponsor">${inner}</div>`}</li>`;
    }).join('');
  }

  function iniciarFormulario() {
    const form = $('#form-contacto');
    const estado = $('#form-estado');
    const campoPos = $('#campo-posicion');
    const toggleTipo = () => campoPos.classList.toggle('hidden', form.tipo.value !== 'jugador');
    $$('input[name="tipo"]', form).forEach((r) => r.addEventListener('change', toggleTipo));
    toggleTipo();

    const setError = (input, msg) => {
      const p = $(`#${input.id}-error`);
      if (p) p.textContent = msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      const nombre = form.nombre, email = form.email, priv = form.privacidad;
      setError(nombre, ''); setError(email, ''); setError(priv, '');
      if (nombre.value.trim().length < 3) { setError(nombre, 'Indica tu nombre completo.'); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { setError(email, 'Introduce un correo válido.'); ok = false; }
      if (!priv.checked) { setError(priv, 'Debes aceptar la política de privacidad.'); ok = false; }
      if (!ok) {
        estado.className = 'text-sm font-medium text-red-600';
        estado.textContent = 'Revisa los campos marcados.';
        (form.querySelector('[aria-invalid="true"]') || nombre).focus();
        return;
      }
      // Sin backend: se abre el cliente de correo con los datos ya rellenos.
      const tipoTxt = { socio: 'Alta de socio', jugador: 'Inscripción de jugador', consulta: 'Consulta' }[form.tipo.value];
      const cuerpo = [
        `Tipo: ${tipoTxt}`,
        `Nombre: ${nombre.value.trim()}`,
        `Email: ${email.value.trim()}`,
        `Teléfono: ${form.telefono.value.trim() || '-'}`,
        form.tipo.value === 'jugador' ? `Posición: ${form.posicion.value || '-'}` : null,
        '', form.mensaje.value.trim()
      ].filter((l) => l !== null).join('\n');
      window.location.href = `mailto:${D.club.contacto.email}?subject=${encodeURIComponent(`[Web] ${tipoTxt} - ${nombre.value.trim()}`)}&body=${encodeURIComponent(cuerpo)}`;
      estado.className = 'text-sm font-medium text-green-700 dark:text-green-400';
      estado.textContent = '¡Gracias! Se ha abierto tu correo con la solicitud lista para enviar.';
      form.reset();
      toggleTipo();
    });
  }

  /* ------------------------------------------------------------------
     6. Navegación, modo oscuro, animaciones
     ------------------------------------------------------------------ */
  function iniciarNavegacion() {
    const btn = $('#menu-toggle');
    const menu = $('#nav-mobile');
    const icon = $('#menu-icon');
    const setOpen = (open) => {
      menu.hidden = !open;
      menu.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      icon.setAttribute('d', open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16');
    };
    btn.addEventListener('click', () => setOpen(menu.hidden));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setOpen(false); });

    // Marca la sección visible en el menú
    const enlaces = $$('.nav-link[href^="#"]');
    const secciones = enlaces.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          enlaces.forEach((a) => {
            const activo = a.getAttribute('href') === '#' + en.target.id;
            if (activo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      secciones.forEach((s) => obs.observe(s));
    }
  }

  function iniciarTema() {
    const btn = $('#theme-toggle');
    const root = document.documentElement;
    const sync = () => btn.setAttribute('aria-pressed', String(root.classList.contains('dark')));
    btn.addEventListener('click', () => {
      root.classList.toggle('dark');
      try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
      sync();
    });
    sync();
  }

  function iniciarReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach((i) => i.classList.add('is-visible')); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); } });
    }, { threshold: 0.1 });
    items.forEach((i) => obs.observe(i));
  }

  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    pintarClub();
    pintarHero();
    pintarClasificacion();
    pintarPartidos();
    pintarPlantilla();
    pintarNoticias();
    pintarGaleria();
    pintarPatrocinadores();
    iniciarFormulario();
    iniciarNavegacion();
    iniciarTema();
    iniciarReveal();
  });
})();
