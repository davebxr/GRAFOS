//Visualización SVG e interfaz de usuario
//Edgar David Acosta Bernal y Cristian Felipe Ortiz Cucunuba
//Depende de grafo.js


//Calcula coordenadas para repartir los nodos en anillo
function calcularPosicionesEnCirculo(ids, cx, cy, radio) {
    const posiciones = {};
    for (let i = 0; i < ids.length; i++) { //Ángulo para cada nodo
        const angulo = (2 * Math.PI * i / ids.length) - Math.PI / 2;
        posiciones[ids[i]] = {
            x: cx + radio * Math.cos(angulo), y: cy + radio * Math.sin(angulo) //Coordenadas polares a cartesianas
        };
    }
    return posiciones;
}


//Dibuja el grafo completo en SVG dentro del contenedor #contenedorGrafo, usando las posiciones calculadas para cada nodo. Las aristas se dibujan primero para quedar detrás de los nodos, y cada una tiene una etiqueta con su peso (distancia). Los nodos muestran su ID y nombre debajo.
function renderizarGrafo() {
    const contenedor = document.getElementById("contenedorGrafo");
    contenedor.innerHTML = "";

    const ids = Object.keys(mapaUrbano.listaDeVertices);
    if (ids.length === 0) {
        contenedor.innerHTML = "<p class='sin-nodos'>Sin nodos todavía.</p>";
        return;
    }

    const ANCHO = 660, ALTO = 460, R_NODO = 26;
    const cx = ANCHO / 2, cy = ALTO / 2 - 10;
    const radio = Math.min(ANCHO, ALTO) * 0.30;
    const posiciones = calcularPosicionesEnCirculo(ids, cx, cy, radio);

    //Elemento SVG raíz
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("viewBox", "0 0 " + ANCHO + " " + ALTO);

    //Punta de flecha reutilizable definida en defs
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "flecha");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "9"); marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "6"); marker.setAttribute("markerHeight", "6");
    marker.setAttribute("orient", "auto-start-reverse");
    const punta = document.createElementNS("http://www.w3.org/2000/svg", "path");
    punta.setAttribute("d", "M 0 1 L 9 5 L 0 9 Z");
    punta.setAttribute("fill", "#7c3aed");
    marker.appendChild(punta);
    defs.appendChild(marker);
    svg.appendChild(defs);

    //Aristas, estas se dibujan primero para quedar detrás de los nodos
    for (let idOrigen in mapaUrbano.listaDeVertices) {
        const arcos = mapaUrbano.obtenerTodosLosArcos(idOrigen);
        const pOrigen = posiciones[idOrigen];

        for (let arco of arcos) {
            const pDestino = posiciones[arco.idDestino];
            if (!pDestino) continue;

            const dx = pDestino.x - pOrigen.x;
            const dy = pDestino.y - pOrigen.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            //Acorta la línea al borde del círculo (no al centro)
            const m = R_NODO + 4;
            const x1 = pOrigen.x  + (dx / dist) * m;
            const y1 = pOrigen.y  + (dy / dist) * m;
            const x2 = pDestino.x - (dx / dist) * m;
            const y2 = pDestino.y - (dy / dist) * m;

            const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
            linea.setAttribute("x1", x1); linea.setAttribute("y1", y1);
            linea.setAttribute("x2", x2); linea.setAttribute("y2", y2);
            linea.setAttribute("stroke", "#9333ea");
            linea.setAttribute("stroke-width", "2");
            linea.setAttribute("marker-end", "url(#flecha)");
            svg.appendChild(linea);

            //Etiqueta de peso centrada en la línea
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;

            const fondo = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            fondo.setAttribute("x", mx - 22); fondo.setAttribute("y", my - 9);
            fondo.setAttribute("width", "44"); fondo.setAttribute("height", "17");
            fondo.setAttribute("rx", "8");
            fondo.setAttribute("fill", "#ede9fe"); fondo.setAttribute("stroke", "#7c3aed");
            fondo.setAttribute("stroke-width", "1");
            svg.appendChild(fondo);

            const labelPeso = document.createElementNS("http://www.w3.org/2000/svg", "text");
            labelPeso.setAttribute("x", mx); labelPeso.setAttribute("y", my + 4);
            labelPeso.setAttribute("text-anchor", "middle");
            labelPeso.setAttribute("font-size", "10");
            labelPeso.setAttribute("font-family", "Segoe UI, sans-serif");
            labelPeso.setAttribute("font-weight", "bold");
            labelPeso.setAttribute("fill", "#4c1d95");
            labelPeso.textContent = arco.distanciaEnMetros + "m";
            svg.appendChild(labelPeso);
        }
    }

    //Nodos
    for (let id of ids) {
        const pos  = posiciones[id];
        const nodo = mapaUrbano.listaDeVertices[id];

        const circulo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circulo.setAttribute("cx", pos.x); circulo.setAttribute("cy", pos.y);
        circulo.setAttribute("r", R_NODO);
        circulo.setAttribute("fill", "#7c3aed"); circulo.setAttribute("stroke", "#4c1d95");
        circulo.setAttribute("stroke-width", "2");
        svg.appendChild(circulo);

        const textoId = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textoId.setAttribute("x", pos.x); textoId.setAttribute("y", pos.y + 5);
        textoId.setAttribute("text-anchor", "middle");
        textoId.setAttribute("font-size", "16"); textoId.setAttribute("font-weight", "bold");
        textoId.setAttribute("font-family", "Segoe UI, sans-serif");
        textoId.setAttribute("fill", "#ffffff");
        textoId.textContent = id;
        svg.appendChild(textoId);

        //Nombre del lugar debajo del círculo, dividido en dos líneas si es muy largo
        const palabras = nodo.nombre.split(" ");
        const mitad = Math.ceil(palabras.length / 2);

        if (palabras.length <= 2) {
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", pos.x); label.setAttribute("y", pos.y + R_NODO + 14);
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("font-size", "10"); label.setAttribute("font-weight", "600");
            label.setAttribute("font-family", "Segoe UI, sans-serif");
            label.setAttribute("fill", "#4c1d95");
            label.textContent = nodo.nombre;
            svg.appendChild(label);
        } else {
            //Primera mitad en línea 1
            const l1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            l1.setAttribute("x", pos.x); l1.setAttribute("y", pos.y + R_NODO + 13);
            l1.setAttribute("text-anchor", "middle"); l1.setAttribute("font-size", "10");
            l1.setAttribute("font-weight", "600"); l1.setAttribute("fill", "#4c1d95");
            l1.setAttribute("font-family", "Segoe UI, sans-serif");
            l1.textContent = palabras.slice(0, mitad).join(" ");
            svg.appendChild(l1);
            //Segunda mitad en línea 2
            const l2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
            l2.setAttribute("x", pos.x); l2.setAttribute("y", pos.y + R_NODO + 24);
            l2.setAttribute("text-anchor", "middle"); l2.setAttribute("font-size", "10");
            l2.setAttribute("font-weight", "600"); l2.setAttribute("fill", "#4c1d95");
            l2.setAttribute("font-family", "Segoe UI, sans-serif");
            l2.textContent = palabras.slice(mitad).join(" ");
            svg.appendChild(l2);
        }
    }

    contenedor.appendChild(svg);
}


//Muestra la lista de adyacencia en el área de texto #zonaListaAdyacencia
function mostrarGrafoUI() {
    document.getElementById("zonaListaAdyacencia").textContent = mapaUrbano.mostrarGrafo();
    mostrarMensaje("Lista de adyacencia actualizada.", "info");
}


//Lee el formulario y agrega un nodo al grafo
function agregarNodoUI() {
    const id = document.getElementById("campoIdNodo").value.trim();
    const nombre = document.getElementById("campoNombreNodo").value.trim();
    if (id === "" || nombre === "") { mostrarMensaje("Escribe el ID y el nombre del lugar.", "error"); return; }
    mapaUrbano.agregarNodo(id, nombre);
    mostrarMensaje("Lugar agregado: " + nombre, "exito");
    renderizarGrafo();
    document.getElementById("campoIdNodo").value = "";
    document.getElementById("campoNombreNodo").value = "";
}


//Lee el formulario y agrega una arista al grafo
function agregarArcoUI() {
    const idOrigen = document.getElementById("campoIdOrigen").value.trim();
    const idDestino = document.getElementById("campoIdDestino").value.trim();
    const distancia = parseInt(document.getElementById("campoDistancia").value);
    if (idOrigen === "" || idDestino === "" || isNaN(distancia)) {
        mostrarMensaje("Completa todos los campos de la ruta.", "error"); return;
    }
    //Compara el contador de arcos antes y después para confirmar inserción
    const arcoAntes = mapaUrbano.obtenerTodosLosArcos(idOrigen).length;
    mapaUrbano.agregarArco(idOrigen, idDestino, distancia);
    const arcoDespues = mapaUrbano.obtenerTodosLosArcos(idOrigen).length;
    if (arcoDespues > arcoAntes) {
        mostrarMensaje("Ruta agregada: " + idOrigen + " → " + idDestino + " (" + distancia + " m)", "exito");
        renderizarGrafo();
        document.getElementById("campoIdOrigen").value = "";
        document.getElementById("campoIdDestino").value = "";
        document.getElementById("campoDistancia").value = "";
    }
}


//Muestra un mensaje de estado que desaparece en 3 segundos
function mostrarMensaje(texto, tipo) {
    const div = document.getElementById("zonaMensajes");
    div.textContent = texto;
    setTimeout(function() { div.textContent = ""; }, 3000);
}


//Al cargar la página, dibuja el grafo inicial con los datos de grafo.js
window.addEventListener("load", function() {
    renderizarGrafo();
});
