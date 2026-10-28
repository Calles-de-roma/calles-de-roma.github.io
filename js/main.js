/* =========================================================
   Calles de Roma · Restaurante F.S.
   ---------------------------------------------------------
   DATOS DEL NEGOCIO: cambia aquí y se actualiza toda la web.
   ========================================================= */
const CONFIG = {
  telefono: "+34 677 94 46 84",         // móvil de reservas (llamadas)
  whatsapp: "34677944684",               // solo números con prefijo, p. ej. "34600000000". Vacío = sin WhatsApp
  email: "callesderomacaracol@gmail.com",
  direccion: "C.C. El Caracol · C. de Marceliano Isábal, 3 · 50004 Zaragoza",
  mapa: "Centro Comercial El Caracol, Calle de Marceliano Isábal 3, 50004 Zaragoza", // lo que se busca en Google Maps
  // Datos legales (aviso legal y privacidad). Mientras estén vacíos se ve el aviso «pendiente».
  titular: "Frumosu Sorin",              // nombre y apellidos o razón social
  nif: "Z3417668B",                      // NIF / NIE / CIF
  domicilio: "C. de Marceliano Isábal, 3 (C.C. El Caracol), 50004 Zaragoza", // domicilio completo
  registro: "",                          // solo si es una sociedad (ahora autónomo: fila quitada de aviso-legal y privacidad)
  instagram: "#",
  facebook: "#",
  tripadvisor: "#",
  apertura: 7,                           // 07:00
  cierre: 22                             // 22:00
};

document.documentElement.classList.remove("sin-js");

/* ---------- Rellenar datos ---------- */
document.querySelectorAll("[data-dato]").forEach((el) => {
  const clave = el.dataset.dato;
  const valor = CONFIG[clave];
  if (!valor) {
    if (clave === "whatsapp") (el.closest("li") || el).hidden = true;
    return;
  }
  el.classList.remove("pendiente");
  if (clave === "telefono") {
    el.textContent = valor;
    el.href = "tel:" + valor.replace(/\s+/g, "");
  } else if (clave === "whatsapp") {
    el.href = "https://wa.me/" + valor + "?text=" + encodeURIComponent("Hola, les escribo desde la web de Calles de Roma.");
    el.target = "_blank";
    el.rel = "noopener";
  } else if (clave === "email") {
    el.textContent = valor;
    el.href = "mailto:" + valor;
  } else if (el.tagName === "A") {
    el.href = valor;
    if (valor !== "#") { el.target = "_blank"; el.rel = "noopener"; }
  } else {
    el.textContent = valor;
  }
});

const comoLlegar = document.getElementById("como-llegar");
if (comoLlegar) comoLlegar.href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(CONFIG.mapa);

document.querySelectorAll("[data-anio]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- Navegación ---------- */
const nav = document.getElementById("nav");
const toggle = nav.querySelector(".nav__toggle");

const alHacerScroll = () => nav.classList.toggle("solida", window.scrollY > 40);
alHacerScroll();
window.addEventListener("scroll", alHacerScroll, { passive: true });

const cerrarMenu = () => {
  nav.classList.remove("abierta");
  toggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
};
toggle.addEventListener("click", () => {
  const abierta = nav.classList.toggle("abierta");
  toggle.setAttribute("aria-expanded", String(abierta));
  document.body.style.overflow = abierta ? "hidden" : "";
});
nav.querySelectorAll(".nav__enlaces a").forEach((a) => a.addEventListener("click", cerrarMenu));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });

// Resaltar la sección visible en el menú
const enlacesAncla = [...nav.querySelectorAll('.nav__enlaces a[href^="#"]:not(.boton)')];
const seccionesNav = enlacesAncla.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if (seccionesNav.length) {
  const obsNav = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (!en.isIntersecting) return;
      enlacesAncla.forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  seccionesNav.forEach((s) => obsNav.observe(s));
}

/* ---------- Aparición al hacer scroll ---------- */
const revelables = document.querySelectorAll(".revelar");
if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revelables.forEach((el) => obs.observe(el));
} else {
  revelables.forEach((el) => el.classList.add("visible"));
}

/* ---------- Pestañas de la carta ---------- */
const pestanas = [...document.querySelectorAll(".pestana")];
const activarPestana = (p, enfocar) => {
  pestanas.forEach((otra) => {
    const sel = otra === p;
    otra.setAttribute("aria-selected", String(sel));
    otra.tabIndex = sel ? 0 : -1;
    document.getElementById(otra.getAttribute("aria-controls")).hidden = !sel;
  });
  if (enfocar) p.focus();
};
pestanas.forEach((p, i) => {
  p.addEventListener("click", () => activarPestana(p));
  p.addEventListener("keydown", (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    activarPestana(pestanas[(i + dir + pestanas.length) % pestanas.length], true);
  });
});

/* ---------- Abierto / cerrado ---------- */
const estado = document.getElementById("estado");
if (estado) {
  const actualizarEstado = () => {
    const ahora = new Date();
    const h = ahora.getHours() + ahora.getMinutes() / 60;
    const abierto = h >= CONFIG.apertura && h < CONFIG.cierre;
    estado.classList.toggle("abierto", abierto);
    estado.classList.toggle("cerrado", !abierto);
    estado.querySelector("span").textContent = abierto
      ? "Abierto ahora · cierra a las " + String(CONFIG.cierre).padStart(2, "0") + ":00"
      : "Cerrado · abrimos a las " + String(CONFIG.apertura).padStart(2, "0") + ":00";
  };
  actualizarEstado();
  setInterval(actualizarEstado, 60000);
}

/* ---------- Formulario de reserva ---------- */
const form = document.getElementById("form-reserva");
if (form) {
  const fecha = form.querySelector("#r-fecha");
  const hoyISO = () => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  };
  fecha.min = hoyISO();
  fecha.value = hoyISO();

  const gruposHora = [...form.querySelectorAll(".opciones--hora")];
  const sinHoras = document.getElementById("sin-horas");

  // Muestra solo las horas del turno elegido y desactiva las que ya han pasado hoy
  const actualizarHoras = () => {
    const turno = form.querySelector('input[name="turno"]:checked').value;
    const esHoy = fecha.value === hoyISO();
    const ahora = new Date();
    const minAhora = ahora.getHours() * 60 + ahora.getMinutes();
    let libres = 0;

    gruposHora.forEach((g) => {
      const activo = g.dataset.turno === turno;
      g.hidden = !activo;
      g.querySelectorAll("input").forEach((inp) => {
        const [h, m] = inp.value.split(":").map(Number);
        const pasada = esHoy && h * 60 + m <= minAhora + 30; // al menos 30 min de margen
        inp.disabled = !activo || pasada;
        if (inp.disabled) inp.checked = false;
        if (activo && !pasada) libres++;
      });
    });
    sinHoras.hidden = libres > 0;
  };
  form.querySelectorAll('input[name="turno"]').forEach((r) => r.addEventListener("change", actualizarHoras));
  fecha.addEventListener("change", actualizarHoras);
  actualizarHoras();

  // Contador de comensales
  const personas = form.querySelector("#r-personas");
  const personasTexto = document.getElementById("personas-texto");
  const fijarPersonas = (n) => {
    n = Math.min(+personas.max, Math.max(+personas.min, Number(n) || 1));
    personas.value = n;
    personasTexto.textContent = n === 1 ? "persona" : "personas";
  };
  form.querySelectorAll(".contador__btn").forEach((b) =>
    b.addEventListener("click", () => fijarPersonas(+personas.value + +b.dataset.paso))
  );
  personas.addEventListener("change", () => fijarPersonas(personas.value));

  const ok = document.getElementById("form-ok");
  const avisar = (texto) => { ok.hidden = false; ok.textContent = texto; };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    if (!d.nombre.trim()) { avisar("Por favor, díganos su nombre."); form.querySelector("#r-nombre").focus(); return; }
    if (!d.fecha || d.fecha < hoyISO()) { avisar("Por favor, elija una fecha a partir de hoy."); fecha.focus(); return; }
    if (!d.hora) {
      avisar("Por favor, elija una hora.");
      const libre = form.querySelector(".opciones--hora:not([hidden]) input:not(:disabled)");
      (libre || form.querySelector('input[name="turno"]')).focus();
      return;
    }

    const fechaBonita = new Date(d.fecha + "T12:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
    const n = Number(d.personas);

    const texto =
      `Hola, me gustaría reservar mesa en Calles de Roma.
` +
      `Nombre: ${d.nombre.trim()}
` +
      `Para: ${d.turno === "Comer" ? "comer" : "el tardeo"}
` +
      `Zona: ${d.zona === "Di Trevi" ? "Di Trevi (zona reservada)" : "comedor"}
` +
      `Día: ${fechaBonita}
` +
      `Hora: ${d.hora}
` +
      `Somos: ${n} ${n === 1 ? "persona" : "personas"}` +
      (d.notas.trim() ? `
Comentarios: ${d.notas.trim()}` : "");

    // La reserva se envía por WhatsApp si hay número; si no, por correo.
    let via;
    if (CONFIG.whatsapp) {
      via = "WhatsApp";
      window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
    } else {
      via = "su correo";
      window.location.href = "mailto:" + CONFIG.email +
        "?subject=" + encodeURIComponent("Reserva · " + fechaBonita + " · " + d.hora) +
        "&body=" + encodeURIComponent(texto);
    }

    avisar(`Gracias, ${d.nombre.trim()}. Hemos preparado su reserva en ${via}: solo tiene que pulsar «Enviar» y le confirmaremos lo antes posible.`);
  });
}

/* ---------- Visor de fotos (galería y cartas impresas) ---------- */
const visor = document.getElementById("visor");
const ampliables = [...document.querySelectorAll(".galeria__item, [data-visor]")];
if (visor && typeof visor.showModal === "function" && ampliables.length) {
  const visorImg = visor.querySelector("img");
  const visorPie = visor.querySelector("figcaption");
  const flechas = visor.querySelectorAll(".visor__ant, .visor__sig");
  const grupoDe = (el) => el.dataset.visor || "galeria";
  let lista = [];
  let actual = 0;

  const mostrarFoto = (i) => {
    actual = (i + lista.length) % lista.length;
    const enlace = lista[actual];
    const miniatura = enlace.querySelector("img");
    visorImg.src = enlace.getAttribute("href");
    visorImg.alt = miniatura ? miniatura.alt : enlace.dataset.titulo || "";
    visorPie.textContent = enlace.dataset.titulo || "";
  };

  ampliables.forEach((enlace) =>
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      // Solo se navega entre las fotos del mismo grupo
      lista = ampliables.filter((otro) => grupoDe(otro) === grupoDe(enlace));
      flechas.forEach((f) => (f.hidden = lista.length < 2));
      mostrarFoto(lista.indexOf(enlace));
      visor.showModal();
      document.body.style.overflow = "hidden";
    })
  );
  visor.addEventListener("close", () => { document.body.style.overflow = ""; });
  visor.querySelector(".visor__cerrar").addEventListener("click", () => visor.close());
  visor.querySelector(".visor__ant").addEventListener("click", () => mostrarFoto(actual - 1));
  visor.querySelector(".visor__sig").addEventListener("click", () => mostrarFoto(actual + 1));
  visor.addEventListener("keydown", (e) => {
    if (lista.length < 2) return;
    if (e.key === "ArrowLeft") mostrarFoto(actual - 1);
    if (e.key === "ArrowRight") mostrarFoto(actual + 1);
  });
  // Cerrar al pulsar fuera de la foto
  visor.addEventListener("click", (e) => {
    if (e.target === visor || e.target.tagName === "FIGURE") visor.close();
  });
}

/* ---------- Botones que reservan directamente en una zona (Di Trevi) ---------- */
document.querySelectorAll("[data-zona]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const radio = document.querySelector(`input[name="zona"][value="${btn.dataset.zona}"]`);
    if (radio) radio.checked = true;
  })
);

/* ---------- Especialidades: carrusel con flechas ---------- */
const carrusel = document.querySelector(".carrusel");
if (carrusel) {
  const pista = carrusel.querySelector(".especialidades");
  const tarjetas = [...pista.querySelectorAll(".especialidad")];

  // Las flechas quedan a media altura de las fotos
  const colocarFlechas = () => {
    const foto = pista.querySelector(".especialidad__foto");
    if (foto) carrusel.style.setProperty("--flecha-y", foto.offsetHeight / 2 + 8 + "px");
  };
  colocarFlechas();
  window.addEventListener("resize", colocarFlechas);

  const paso = () => tarjetas[1].offsetLeft - tarjetas[0].offsetLeft;
  const mover = (dir) => {
    const max = pista.scrollWidth - pista.clientWidth;
    let destino = pista.scrollLeft + dir * paso();
    // Al llegar al final vuelve al principio (y al revés)
    if (dir > 0 && pista.scrollLeft >= max - 4) destino = 0;
    if (dir < 0 && pista.scrollLeft <= 4) destino = max;
    pista.scrollTo({ left: destino });
  };

  carrusel.querySelectorAll(".carrusel__btn").forEach((btn) => {
    const dir = btn.classList.contains("carrusel__btn--sig") ? 1 : -1;
    btn.addEventListener("click", () => {
      mover(dir);
      // Se queda dorada un momento al pulsarla (también en el móvil)
      btn.classList.add("pulsado");
      clearTimeout(btn._t);
      btn._t = setTimeout(() => btn.classList.remove("pulsado"), 350);
    });
  });

  pista.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); mover(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); mover(-1); }
  });
}

/* ---------- Cookies: aviso y consentimiento ----------
   La única cookie de terceros es la de Google Maps: el mapa no se carga
   hasta que el visitante acepta. La elección se guarda en este navegador. */
const CLAVE_COOKIES = "cr-cookies"; // "si" | "no"
const leerConsentimiento = () => { try { return localStorage.getItem(CLAVE_COOKIES); } catch (e) { return null; } };
const guardarConsentimiento = (valor) => { try { localStorage.setItem(CLAVE_COOKIES, valor); } catch (e) {} };

const mapa = document.getElementById("mapa");
const mapaAviso = document.getElementById("mapa-aviso");
const aplicarConsentimiento = () => {
  const acepta = leerConsentimiento() === "si";
  if (mapa) {
    const url = "https://maps.google.com/maps?q=" + encodeURIComponent(CONFIG.mapa) + "&z=15&output=embed";
    if (acepta && mapa.getAttribute("src") !== url) mapa.src = url;
    if (!acepta) mapa.removeAttribute("src");
    mapa.hidden = !acepta;
  }
  if (mapaAviso) mapaAviso.hidden = acepta;
};

const avisoCookies = document.createElement("div");
avisoCookies.className = "aviso-cookies";
avisoCookies.setAttribute("role", "region");
avisoCookies.setAttribute("aria-label", "Aviso de cookies");
avisoCookies.innerHTML =
  '<p><strong>Cookies</strong>Esta web solo usa cookies de terceros para mostrar el mapa de Google. ' +
  'Puede aceptarlas o rechazarlas: el resto de la web funciona igual. <a href="cookies.html">Más información</a></p>' +
  '<div class="aviso-cookies__botones">' +
  '<button type="button" class="boton" data-cookies="no">Rechazar</button>' +
  '<button type="button" class="boton boton--lleno" data-cookies="si">Aceptar</button>' +
  "</div>";
avisoCookies.hidden = true;
document.body.appendChild(avisoCookies);

const mostrarAvisoCookies = () => { avisoCookies.hidden = false; };
const elegirCookies = (valor) => {
  guardarConsentimiento(valor);
  avisoCookies.hidden = true;
  aplicarConsentimiento();
};
avisoCookies.querySelectorAll("[data-cookies]").forEach((btn) =>
  btn.addEventListener("click", () => elegirCookies(btn.dataset.cookies))
);
// «Ver el mapa» en la sección de ubicación cuenta como aceptar
document.querySelectorAll("[data-aceptar-cookies]").forEach((btn) =>
  btn.addEventListener("click", () => elegirCookies("si"))
);
// Enlace «Configurar cookies» del pie: vuelve a mostrar el aviso
document.querySelectorAll("[data-configurar-cookies]").forEach((btn) =>
  btn.addEventListener("click", (e) => { e.preventDefault(); mostrarAvisoCookies(); })
);

aplicarConsentimiento();
if (!leerConsentimiento()) mostrarAvisoCookies();
