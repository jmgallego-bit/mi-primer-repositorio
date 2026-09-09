/* =========================================================================
   DATOS DEL CLUB — C.D. ILIPLENSE
   -------------------------------------------------------------------------
   Este es el ÚNICO fichero que hay que editar para actualizar la web.
   No es necesario tocar index.html ni app.js.

   Reglas rápidas:
   - Las fechas van en formato ISO: "2026-09-13T18:00:00" (año-mes-díaThora).
   - Las imágenes van en assets/img/. Si no hay foto, deja "" y se mostrará
     un placeholder con las iniciales.
   - Posiciones válidas en la plantilla: "POR", "DEF", "CEN", "DEL".
   - Resultado de un partido: "goles" con [nuestros, rivales]. Si todavía no
     se ha jugado, deja goles: null.
   ========================================================================= */

window.CLUB_DATA = {

  /* ---------- 1. DATOS GENERALES ---------- */
  club: {
    nombre: "C.D. Iliplense",
    nombreCorto: "Iliplense",
    lema: "Orgullo de Niebla desde 1968",
    localidad: "Niebla (Huelva)",
    fundacion: 1968,
    escudo: "assets/img/escudo.svg",
    campo: {
      nombre: "Campo Municipal de Deportes de Niebla",
      direccion: "Niebla, 21840 Huelva",
      // Consulta de Google Maps que se incrusta en la sección de contacto.
      mapaQuery: "Campo de futbol municipal, Niebla, Huelva"
    },
    contacto: {
      email: "info@cdiliplense.es",
      telefono: "+34 600 000 000",
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
      twitter: "https://x.com/"
    },
    temporada: "2026/27",
    competicion: "Primera Andaluza Sénior · Grupo 1 (Huelva)"
  },

  /* ---------- 2. PARTIDOS (resultados y calendario) ----------
     Ordena cronológicamente. La web detecta sola el último jugado y
     el siguiente por jugar comparando con la fecha de hoy.              */
  partidos: [
    { jornada: 1, fecha: "2026-08-30T19:00:00", local: "C.D. Iliplense",   visitante: "Bollullos C.F.",     goles: [2, 1], lugar: "Niebla",       cronica: 1 },
    { jornada: 2, fecha: "2026-09-06T18:30:00", local: "Atco. Onubense",   visitante: "C.D. Iliplense",     goles: [1, 1], lugar: "Huelva",       cronica: 2 },
    { jornada: 3, fecha: "2026-09-13T18:00:00", local: "C.D. Iliplense",   visitante: "U.D. Punta Umbría",  goles: null,   lugar: "Niebla" },
    { jornada: 4, fecha: "2026-09-20T17:30:00", local: "C.D. La Palma",    visitante: "C.D. Iliplense",     goles: null,   lugar: "La Palma del Condado" },
    { jornada: 5, fecha: "2026-09-27T18:00:00", local: "C.D. Iliplense",   visitante: "Moguer C.F.",        goles: null,   lugar: "Niebla" },
    { jornada: 6, fecha: "2026-10-04T17:00:00", local: "Isla Cristina F.C.", visitante: "C.D. Iliplense",   goles: null,   lugar: "Isla Cristina" }
  ],

  /* ---------- 3. CLASIFICACIÓN ----------
     PJ, PG, PE, PP, GF, GC. Los puntos y la diferencia se calculan solos.
     "forma": últimos 5 resultados, del más antiguo al más reciente (G/E/P). */
  clasificacion: [
    { equipo: "U.D. Punta Umbría",   pj: 2, pg: 2, pe: 0, pp: 0, gf: 5, gc: 1, forma: ["G", "G"] },
    { equipo: "C.D. Iliplense",      pj: 2, pg: 1, pe: 1, pp: 0, gf: 3, gc: 2, forma: ["G", "E"] },
    { equipo: "Moguer C.F.",         pj: 2, pg: 1, pe: 1, pp: 0, gf: 2, gc: 1, forma: ["E", "G"] },
    { equipo: "Isla Cristina F.C.",  pj: 2, pg: 1, pe: 0, pp: 1, gf: 3, gc: 3, forma: ["P", "G"] },
    { equipo: "C.D. La Palma",       pj: 2, pg: 1, pe: 0, pp: 1, gf: 2, gc: 2, forma: ["G", "P"] },
    { equipo: "Atco. Onubense",      pj: 2, pg: 0, pe: 2, pp: 0, gf: 2, gc: 2, forma: ["E", "E"] },
    { equipo: "Bollullos C.F.",      pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 3, forma: ["P", "E"] },
    { equipo: "San Juan C.F.",       pj: 2, pg: 0, pe: 0, pp: 2, gf: 0, gc: 5, forma: ["P", "P"] }
  ],

  /* ---------- 4. PLANTILLA ----------
     posicion: "POR" | "DEF" | "CEN" | "DEL"                                */
  plantilla: [
    { dorsal: 1,  nombre: "Álvaro Romero",    posicion: "POR", edad: 27, foto: "" },
    { dorsal: 13, nombre: "Dani Cortés",      posicion: "POR", edad: 21, foto: "" },
    { dorsal: 2,  nombre: "Fran Delgado",     posicion: "DEF", edad: 24, foto: "" },
    { dorsal: 3,  nombre: "Manu Beltrán",     posicion: "DEF", edad: 29, foto: "" },
    { dorsal: 4,  nombre: "Rafa Pérez",       posicion: "DEF", edad: 31, foto: "", capitan: true },
    { dorsal: 5,  nombre: "Kike Domínguez",   posicion: "DEF", edad: 22, foto: "" },
    { dorsal: 15, nombre: "Javi Garrido",     posicion: "DEF", edad: 20, foto: "" },
    { dorsal: 6,  nombre: "Pablo Caro",       posicion: "CEN", edad: 26, foto: "" },
    { dorsal: 8,  nombre: "Adrián Vázquez",   posicion: "CEN", edad: 25, foto: "" },
    { dorsal: 10, nombre: "Sergio Marín",     posicion: "CEN", edad: 28, foto: "" },
    { dorsal: 14, nombre: "Nico Salguero",    posicion: "CEN", edad: 19, foto: "" },
    { dorsal: 16, nombre: "Iván Prieto",      posicion: "CEN", edad: 23, foto: "" },
    { dorsal: 7,  nombre: "Curro Bermúdez",   posicion: "DEL", edad: 24, foto: "" },
    { dorsal: 9,  nombre: "Antonio Moreno",   posicion: "DEL", edad: 30, foto: "" },
    { dorsal: 11, nombre: "Lucas Vidal",      posicion: "DEL", edad: 22, foto: "" },
    { dorsal: 19, nombre: "Mario Cárdenas",   posicion: "DEL", edad: 18, foto: "" }
  ],

  cuerpoTecnico: [
    { nombre: "José Antonio Ruiz", cargo: "Entrenador" },
    { nombre: "Miguel Ángel Toscano", cargo: "Segundo entrenador" },
    { nombre: "Laura Gómez", cargo: "Fisioterapeuta" }
  ],

  /* ---------- 5. NOTICIAS ----------
     tipo: "cronica" | "club" | "pueblo". id enlaza con "cronica" en partidos. */
  noticias: [
    {
      id: 2,
      tipo: "cronica",
      fecha: "2026-09-06",
      titulo: "Empate con sabor a poco en Huelva",
      resumen: "El Iliplense se adelantó con un gol de Antonio Moreno, pero el Atlético Onubense igualó en el tramo final. Un punto que mantiene al equipo invicto.",
      imagen: ""
    },
    {
      id: 1,
      tipo: "cronica",
      fecha: "2026-08-30",
      titulo: "Victoria en el estreno liguero ante el Bollullos",
      resumen: "Doblete de Curro Bermúdez para arrancar la temporada con tres puntos en casa. El Campo Municipal registró una gran entrada.",
      imagen: ""
    },
    {
      id: 3,
      tipo: "club",
      fecha: "2026-08-20",
      titulo: "Campaña de socios 2026/27: ¡hazte del Iliplense!",
      resumen: "Abierto el plazo para renovar o darse de alta como socio. Carnet familiar, juvenil y de honor. Toda la información en la sección de contacto.",
      imagen: ""
    },
    {
      id: 4,
      tipo: "pueblo",
      fecha: "2026-08-15",
      titulo: "El club, presente en las fiestas patronales de Niebla",
      resumen: "La plantilla participó en el torneo de peñas y en la ofrenda floral. Gracias a todos los vecinos por el apoyo.",
      imagen: ""
    }
  ],

  /* ---------- 6. GALERÍA ----------
     Sube las fotos a assets/img/galeria/ y pon aquí la ruta.              */
  galeria: [
    { src: "", alt: "Celebración del primer gol de la temporada", jornada: "J1 · vs Bollullos" },
    { src: "", alt: "Afición en la grada del Campo Municipal", jornada: "J1 · vs Bollullos" },
    { src: "", alt: "Once inicial ante el Atlético Onubense", jornada: "J2 · vs Atco. Onubense" },
    { src: "", alt: "Calentamiento previo al partido", jornada: "J2 · vs Atco. Onubense" },
    { src: "", alt: "Entrenamiento de pretemporada", jornada: "Pretemporada" },
    { src: "", alt: "Presentación de la plantilla 2026/27", jornada: "Presentación" }
  ],

  /* ---------- 7. PATROCINADORES ----------
     logo: ruta a la imagen. Si está vacío se muestra el nombre.           */
  patrocinadores: [
    { nombre: "Bar Casa Manolo",          logo: "", web: "" },
    { nombre: "Ferretería El Condado",    logo: "", web: "" },
    { nombre: "Panadería Hnos. Pérez",    logo: "", web: "" },
    { nombre: "Talleres Niebla Motor",    logo: "", web: "" },
    { nombre: "Farmacia Plaza Mayor",     logo: "", web: "" },
    { nombre: "Excmo. Ayuntamiento de Niebla", logo: "", web: "" },
    { nombre: "Cooperativa Vinícola",     logo: "", web: "" },
    { nombre: "Supermercado La Muralla",  logo: "", web: "" }
  ]
};
