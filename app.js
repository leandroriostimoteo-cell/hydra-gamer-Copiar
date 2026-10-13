
// ==========================================
// HYDRA GAMER | FUNCIONES DE LA TIENDA
// ==========================================

// WhatsApp de HYDRA GAMER, Perú.
const WHATSAPP = "51993882709";

// Almacenamiento local seguro frente a errores de acceso.
// No guardamos contraseñas.
function leerLocal(clave, alternativa) {
    try {
        const dato = localStorage.getItem(clave);
        return dato === null ? alternativa : JSON.parse(dato);
    } catch {
        return alternativa;
    }
}

function guardarLocal(clave, dato) {
    try {
        localStorage.setItem(clave, JSON.stringify(dato));
        return true;
    } catch {
        return false;
    }
}

function abrirWhatsApp(mensaje) {
    const url = "https://wa.me/" + WHATSAPP +
        "?text=" + encodeURIComponent(mensaje);

    window.open(url, "_blank", "noopener,noreferrer");
}

function dinero(cantidad) {
    return "S/ " + cantidad.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ==========================================
// CATÁLOGO
// Los precios son referenciales.
// ==========================================

const productos = [
    {
        id: "pc-gamer",
        nombre: "PC Gamer",
        categoria: "pc",
        precio: 2499,
        imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80",
        detalle: "Equipo para gaming y trabajo.",
        etiqueta: "GAMING"
    },
    {
        id: "teclado-rgb",
        nombre: "Teclado RGB",
        categoria: "perifericos",
        precio: 149,
        imagen: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=700&q=80",
        detalle: "Teclado para tu setup gamer.",
        etiqueta: "RGB"
    },
    {
        id: "mouse-gamer",
        nombre: "Mouse Gamer",
        categoria: "perifericos",
        precio: 89,
        imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80",
        detalle: "Control y precisión para jugar.",
        etiqueta: "GAMING"
    },
    {
        id: "memoria-ram",
        nombre: "Memoria RAM",
        categoria: "componentes",
        precio: 189,
        imagen: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=700&q=80",
        detalle: "Consulta capacidad y compatibilidad.",
        etiqueta: "HARDWARE"
    },
    {
        id: "monitor-gamer",
        nombre: "Monitor Gamer",
        categoria: "perifericos",
        precio: 699,
        imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80",
        detalle: "Pantalla para tu estación de juego.",
        etiqueta: "DISPLAY"
    },
    {
        id: "ssd",
        nombre: "SSD de almacenamiento",
        categoria: "componentes",
        precio: 229,
        imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=700&q=80",
        detalle: "Almacenamiento para tu computadora.",
        etiqueta: "STORAGE"
    }
];

const catalogo = document.getElementById("catalogo");
const buscador = document.getElementById("buscador");
const filtro = document.getElementById("filtro");
const orden = document.getElementById("orden");
const contador = document.getElementById("contador");

function normalizar(texto) {
    return texto.toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function mostrarProductos() {
    const texto = normalizar(buscador.value.trim());
    const categoria = filtro.value;
    const tipoOrden = orden.value;

    let encontrados = productos.filter(producto => {
        const coincideTexto = normalizar(
            producto.nombre + " " + producto.detalle + " " +
            producto.categoria
        ).includes(texto);

        const coincideCategoria =
            categoria === "todos" ||
            producto.categoria === categoria;

        return coincideTexto && coincideCategoria;
    });

    if (tipoOrden === "menor") {
        encontrados.sort((a, b) => a.precio - b.precio);
    } else if (tipoOrden === "mayor") {
        encontrados.sort((a, b) => b.precio - a.precio);
    } else if (tipoOrden === "nombre") {
        encontrados.sort((a, b) =>
            a.nombre.localeCompare(b.nombre, "es")
        );
    }

    catalogo.replaceChildren();
    contador.textContent =
        encontrados.length + " producto(s) encontrado(s).";

    if (encontrados.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "carrito-vacio";
        aviso.textContent =
            "No encontramos productos. Prueba otra búsqueda.";
        catalogo.appendChild(aviso);
        return;
    }

    encontrados.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";

        const contenedorImagen = document.createElement("div");
        contenedorImagen.className = "imagen-producto";

        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.loading = "lazy";
        imagen.onerror = function () {
            this.alt = "Imagen no disponible: " + producto.nombre;
            this.style.opacity = "0";
        };

        const etiqueta = document.createElement("span");
        etiqueta.className = "etiqueta-producto";
        etiqueta.textContent = producto.etiqueta;

        contenedorImagen.append(imagen, etiqueta);

        const contenido = document.createElement("div");
        contenido.className = "producto-contenido";

        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;

        const detalle = document.createElement("p");
        detalle.textContent = producto.detalle;

        const precio = document.createElement("strong");
        precio.className = "precio";
        precio.textContent = dinero(producto.precio);

        const acciones = document.createElement("div");
        acciones.className = "producto-acciones";

        const botonAgregar = document.createElement("button");
        botonAgregar.type = "button";
        botonAgregar.className = "boton boton-principal";
        botonAgregar.textContent = "🛒 AGREGAR AL CARRITO";
        botonAgregar.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
        });

        const botonConsultar = document.createElement("button");
        botonConsultar.type = "button";
        botonConsultar.className = "boton boton-secundario";
        botonConsultar.textContent = "CONSULTAR POR WHATSAPP";

        botonConsultar.addEventListener("click", () => {
            abrirWhatsApp(
                "Hola HYDRA GAMER. Quiero consultar por " +
                producto.nombre + ". Precio referencial: " +
                dinero(producto.precio) +
                ". ¿Hay disponibilidad y cuál es el precio final?"
            );
        });

        acciones.append(botonAgregar, botonConsultar);
        contenido.append(titulo, detalle, precio, acciones);
        tarjeta.append(contenedorImagen, contenido);
        catalogo.appendChild(tarjeta);
    });
}

buscador.addEventListener("input", mostrarProductos);
filtro.addEventListener("change", mostrarProductos);
orden.addEventListener("change", mostrarProductos);

// ==========================================
// CARRITO DE COMPRAS
// ==========================================

let carrito = leerLocal("hydra_gamer_carrito_v1", []);

if (!Array.isArray(carrito)) {
    carrito = [];
}

function guardarCarrito() {
    guardarLocal("hydra_gamer_carrito_v1", carrito);
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    const existente = carrito.find(item => item.id === id);

    if (existente) {
        if (existente.cantidad >= 99) {
            alert("Has alcanzado el máximo de unidades.");
            return;
        }
        existente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarCarrito();

    const boton = document.getElementById("abrirCarrito");
    boton.title = producto.nombre + " agregado al carrito";
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(p => p.id === id);
    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
    } else if (item.cantidad > 99) {
        item.cantidad = 99;
    }

    guardarCarrito();
    actualizarCarrito();
}

function quitarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
}

function obtenerItemsValidos() {
    return carrito.map(item => {
        const producto = productos.find(p => p.id === item.id);

        if (!producto) return null;

        const cantidad = Number.isInteger(item.cantidad)
            ? Math.min(99, Math.max(1, item.cantidad))
            : 1;

        return {
            ...producto,
            cantidad
        };
    }).filter(Boolean);
}

function actualizarCarrito() {
    const lista = document.getElementById("listaCarrito");
    const totalElemento = document.getElementById("totalCarrito");
    const contadorElemento = document.getElementById("cantidadCarrito");

    const items = obtenerItemsValidos();

    carrito = items.map(item => ({
        id: item.id,
        cantidad: item.cantidad
    }));

    guardarCarrito();

    const cantidadTotal = items.reduce(
        (total, item) => total + item.cantidad, 0
    );

    const total = items.reduce(
        (suma, item) => suma + item.precio * item.cantidad, 0
    );

    contadorElemento.textContent = cantidadTotal;
    totalElemento.textContent = dinero(total);
    lista.replaceChildren();

    if (items.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "carrito-vacio";
        vacio.textContent =
            "Tu carrito está vacío. ¡Explora la tienda!";
        lista.appendChild(vacio);
        return;
    }

    items.forEach(item => {
        const fila = document.createElement("article");
        fila.className = "item-carrito";

        const datos = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent = item.nombre;

        const precio = document.createElement("p");
        precio.textContent = dinero(item.precio) + " por unidad";

        const controles = document.createElement("div");
        controles.className = "controles-cantidad";

        const menos = document.createElement("button");
        menos.type = "button";
        menos.textContent = "−";
        menos.setAttribute("aria-label", "Reducir cantidad");
        menos.addEventListener("click", () =>
            cambiarCantidad(item.id, -1)
        );

        const cantidad = document.createElement("span");
        cantidad.textContent = item.cantidad;

        const mas = document.createElement("button");
        mas.type = "button";
        mas.textContent = "+";
        mas.setAttribute("aria-label", "Aumentar cantidad");
        mas.addEventListener("click", () =>
            cambiarCantidad(item.id, 1)
        );

        controles.append(menos, cantidad, mas);
        datos.append(titulo, precio, controles);

        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "quitar-producto";
        quitar.textContent = "×";
        quitar.setAttribute("aria-label", "Quitar producto");
        quitar.addEventListener("click", () =>
            quitarDelCarrito(item.id)
        );

        fila.append(datos, quitar);
        lista.appendChild(fila);
    });
}

document.getElementById("abrirCarrito")
    .addEventListener("click", () => abrirModal("fondoCarrito"));

document.getElementById("vaciarCarrito")
    .addEventListener("click", vaciarCarrito);

document.getElementById("finalizarCompra")
    .addEventListener("click", () => {
        const items = obtenerItemsValidos();

        if (items.length === 0) {
            alert("Agrega al menos un producto antes de continuar.");
            return;
        }

        const lineas = items.map(item =>
            "- " + item.nombre +
            " x" + item.cantidad +
            ": " + dinero(item.precio * item.cantidad)
        );

        const total = items.reduce(
            (suma, item) => suma + item.precio * item.cantidad, 0
        );

        const mensaje =
            "Hola HYDRA GAMER. Quiero consultar este pedido:\n\n" +
            lineas.join("\n") +
            "\n\nSubtotal referencial: " + dinero(total) +
            "\n¿Podrían confirmar disponibilidad, precio final y entrega?";

        abrirWhatsApp(mensaje);
    });

// ==========================================
// MODALES: CARRITO Y LOGIN
// ==========================================

function abrirModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove("oculto");
    document.body.classList.add("modal-abierto");

    const primerCampo = modal.querySelector(
        "input, button, select, textarea"
    );

    if (primerCampo) primerCampo.focus();
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add("oculto");

    const quedanAbiertos = Array.from(
        document.querySelectorAll(".fondo-modal")
    ).some(elemento => !elemento.classList.contains("oculto"));

    if (!quedanAbiertos) {
        document.body.classList.remove("modal-abierto");
    }
}

document.querySelectorAll("[data-cerrar]").forEach(boton => {
    boton.addEventListener("click", () => {
        cerrarModal(boton.dataset.cerrar);
    });
});

document.querySelectorAll(".fondo-modal").forEach(fondo => {
    fondo.addEventListener("click", evento => {
        if (evento.target === fondo) {
            cerrarModal(fondo.id);
        }
    });
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        document.querySelectorAll(".fondo-modal").forEach(modal => {
            if (!modal.classList.contains("oculto")) {
                cerrarModal(modal.id);
            }
        });

        document.getElementById("ventanaBot")
            .classList.add("oculto");
    }
});

// ==========================================
// LOGIN DE DEMOSTRACIÓN
// No verifica identidad ni crea cuentas.
// Nunca se guarda la contraseña.
// ==========================================

const CLAVE_SESION = "hydra_gamer_demo_email";
let emailDemo = "";

try {
    emailDemo = sessionStorage.getItem(CLAVE_SESION) || "";
} catch {
    emailDemo = "";
}

const fondoLogin = document.getElementById("fondoLogin");
const formLogin = document.getElementById("formLogin");
const estadoLogin = document.getElementById("estadoLogin");
const textoLogin = document.getElementById("textoLogin");
const cerrarSesion = document.getElementById("cerrarSesion");

function actualizarLogin() {
    textoLogin.textContent = emailDemo ? "Mi sesión" : "Ingresar";
    cerrarSesion.classList.toggle("oculto", !emailDemo);
}

document.getElementById("abrirLogin").addEventListener("click", () => {
    abrirModal("fondoLogin");

    if (emailDemo) {
        estadoLogin.textContent =
            "Sesión de demostración: " + emailDemo;
    }
});

formLogin.addEventListener("submit", evento => {
    evento.preventDefault();

    const email = document.getElementById("emailLogin")
        .value.trim();

    const password = document.getElementById("passwordLogin")
        .value;

    if (!formLogin.reportValidity()) return;

    // Esta validación solo demuestra el funcionamiento de la interfaz.
    // No es autenticación real y no almacena la contraseña.
    if (!email || password.length < 6) {
        estadoLogin.textContent =
            "Introduce un correo válido y al menos 6 caracteres.";
        return;
    }

    emailDemo = email;

    try {
        sessionStorage.setItem(CLAVE_SESION, emailDemo);
    } catch {
        // La sesión de demostración puede continuar solo en memoria.
    }

    document.getElementById("passwordLogin").value = "";

    estadoLogin.textContent =
        "Modo demostración activo. No se verificó tu identidad.";

    actualizarLogin();
});

cerrarSesion.addEventListener("click", () => {
    emailDemo = "";

    try {
        sessionStorage.removeItem(CLAVE_SESION);
    } catch {
        // Sin almacenamiento de sesión.
    }

    formLogin.reset();
    estadoLogin.textContent = "Sesión de demostración cerrada.";
    actualizarLogin();
});

actualizarLogin();

// ==========================================
// CONTACTO POR WHATSAPP
// ==========================================

document.getElementById("formContacto")
    .addEventListener("submit", evento => {
        evento.preventDefault();

        const nombre = document.getElementById("nombre")
            .value.trim();

        const servicio = document.getElementById("servicio").value;

        const detalle = document.getElementById("detalle")
            .value.trim();

        if (!nombre || !servicio || !detalle) return;

        const mensaje =
            "Hola HYDRA GAMER.\n" +
            "Nombre: " + nombre + "\n" +
            "Servicio: " + servicio + "\n" +
            "Consulta: " + detalle;

        document.getElementById("estadoFormulario").textContent =
            "Se abrirá WhatsApp. Revisa el mensaje y pulsa Enviar.";

        abrirWhatsApp(mensaje);
    });

// CONSULTAS DE SERVICIOS
document.querySelectorAll(".consultar-servicio")
    .forEach(boton => {
        boton.addEventListener("click", () => {
            const servicio = boton.dataset.servicio;

            abrirWhatsApp(
                "Hola HYDRA GAMER. Quiero consultar el servicio: " +
                servicio + ". ¿Podrían informarme sobre el precio y la disponibilidad?"
            );
        });
    });

// ==========================================
// MENÚ PARA CELULARES
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const navegacion = document.getElementById("navegacion");

menuToggle.addEventListener("click", () => {
    const abierto = navegacion.classList.toggle("abierto");

    menuToggle.setAttribute("aria-expanded", String(abierto));
    menuToggle.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
    );

    menuToggle.textContent = abierto ? "×" : "☰";
});

navegacion.querySelectorAll("a").forEach(enlace => {
    enlace.addEventListener("click", () => {
        navegacion.classList.remove("abierto");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
        menuToggle.textContent = "☰";
    });
});

// ==========================================
// HYDRABOT: RESPUESTAS AUTOMÁTICAS
// No necesita una API externa.
// ==========================================

const ventanaBot = document.getElementById("ventanaBot");
const mensajes = document.getElementById("mensajes");
const entradaBot = document.getElementById("entradaBot");

document.getElementById("abrirBot").addEventListener("click", () => {
    ventanaBot.classList.toggle("oculto");

    if (!ventanaBot.classList.contains("oculto")) {
        entradaBot.focus();
    }
});

document.getElementById("cerrarBot").addEventListener("click", () => {
    ventanaBot.classList.add("oculto");
});

function agregarMensaje(texto, tipo) {
    const mensaje = document.createElement("div");
    mensaje.className = "mensaje " + tipo;
    mensaje.textContent = texto;

    mensajes.appendChild(mensaje);
    mensajes.scrollTop = mensajes.scrollHeight;
}

function responderBot(preguntaOriginal) {
    const pregunta = normalizar(preguntaOriginal);

    if (/\b(hola|buenas|saludos|hey)\b/.test(pregunta)) {
        return "¡Hola! 💚 Bienvenido a HYDRA GAMER. ¿Buscas productos o servicios técnicos?";
    }

    if (pregunta.includes("carrito")) {
        return "Puedes agregar productos desde la tienda, revisar las cantidades y continuar tu consulta por WhatsApp.";
    }

    if (pregunta.includes("precio") ||
        pregunta.includes("cuanto") ||
        pregunta.includes("costo")) {
        return "Los precios publicados son referenciales. Pulsa «Consultar por WhatsApp» para confirmar el precio final y la disponibilidad.";
    }

    if (pregunta.includes("pc gamer") ||
        pregunta.includes("computadora")) {
        return "Tenemos una PC Gamer de demostración en el catálogo. Consulta sus especificaciones, disponibilidad y precio por WhatsApp.";
    }

    if (pregunta.includes("teclado") ||
        pregunta.includes("mouse") ||
        pregunta.includes("monitor") ||
        pregunta.includes("ram") ||
        pregunta.includes("ssd")) {
        return "¡Revisa nuestra tienda! 🎮 Puedes buscar por nombre, filtrar categorías y ordenar por precio.";
    }

    if (pregunta.includes("windows")) {
        return "Ofrecemos consultas sobre instalación y configuración de Windows. Escríbenos por WhatsApp para conocer el servicio y sus condiciones.";
    }

    if (pregunta.includes("mantenimiento") ||
        pregunta.includes("limpieza")) {
        return "El mantenimiento de PC aparece desde S/ 50 como precio referencial. Consulta qué incluye el servicio antes de contratarlo.";
    }

    if (pregunta.includes("ensamblaje")) {
        return "Podemos orientarte sobre el ensamblaje gamer. Cuéntanos qué componentes tienes y qué presupuesto manejas por WhatsApp.";
    }

    if (pregunta.includes("diagnostico") ||
        pregunta.includes("reparacion") ||
        pregunta.includes("falla")) {
        return "El diagnóstico técnico aparece desde S/ 25 como precio referencial. Consulta disponibilidad y alcance del diagnóstico.";
    }

    if (pregunta.includes("contacto") ||
        pregunta.includes("whatsapp")) {
        return "Puedes comunicarte con HYDRA GAMER usando los botones de WhatsApp de la página.";
    }

    if (pregunta.includes("horario") ||
        pregunta.includes("direccion") ||
        pregunta.includes("ubicacion")) {
        return "Todavía no tenemos un horario o dirección configurados en esta página. Escríbenos por WhatsApp para consultar.";
    }

    return "Puedo orientarte sobre productos, precios, carrito y servicios técnicos. 💻 Prueba con «precio», «mantenimiento» o «mouse gamer».";
}

document.getElementById("formBot").addEventListener("submit", evento => {
    evento.preventDefault();

    const pregunta = entradaBot.value.trim();

    if (!pregunta) return;

    agregarMensaje(pregunta, "usuario");
    agregarMensaje(responderBot(pregunta), "bot");

    entradaBot.value = "";
    entradaBot.focus();
});

// ==========================================
// INICIALIZACIÓN
// ==========================================

mostrarProductos();
actualizarCarrito();