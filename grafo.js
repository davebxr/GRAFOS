//Estructura de datos del grafo dirigido ponderado
//Edgar David Acosta Bernal y Cristian Felipe Ortiz Cucunuba

//Representa una arista como nodo de lista enlazada
class Arista {
    constructor(idDestino, distanciaEnMetros) {
        this.idDestino = idDestino;
        this.distanciaEnMetros = distanciaEnMetros;
        this.siguienteArco = null; //enlace al siguiente arco
    }
}

//Representa un lugar del mapa
class Nodo {
    constructor(identificador, nombre) {
        this.identificador = identificador;
        this.nombre = nombre;
        this.primerArco = null; // cabeza de la lista enlazada de aristas
    }
}

//Administra el grafo mediante un diccionario de nodos
class Grafo {
    constructor() {
        this.listaDeVertices = {}; //Id del nodo
    }

    //Crea un vértice si el Id no existe
    agregarNodo(identificador, nombre) {
        if (this.listaDeVertices[identificador]) {
            mostrarMensaje("Ya existe el lugar: " + identificador, "error");
            return;
        }
        this.listaDeVertices[identificador] = new Nodo(identificador, nombre);
    }

    //Inserta una arista al inicio de la lista enlazada del nodo origen 
    agregarArco(idOrigen, idDestino, distanciaEnMetros) {
        const nodoOrigen = this.listaDeVertices[idOrigen];
        if (!nodoOrigen) { mostrarMensaje("No existe el origen: " + idOrigen, "error"); return; }
        if (!this.listaDeVertices[idDestino]) { mostrarMensaje("No existe el destino: " + idDestino, "error"); return; }
        if (distanciaEnMetros <= 0) { mostrarMensaje("La distancia debe ser mayor a cero.", "error"); return; }

        //Verifica duplicados recorriendo la lista
        let actual = nodoOrigen.primerArco;
        while (actual !== null) {
            if (actual.idDestino === idDestino) {
                mostrarMensaje("Ruta duplicada: " + idOrigen + " → " + idDestino, "error");
                return;
            }
            actual = actual.siguienteArco;
        }

        //Inserta al inicio: nuevo → anterior primero
        const nuevoArco = new Arista(idDestino, distanciaEnMetros);
        nuevoArco.siguienteArco = nodoOrigen.primerArco;
        nodoOrigen.primerArco = nuevoArco;
    }

    //Devuelve todas las aristas de un nodo como array
    obtenerTodosLosArcos(identificadorNodo) {
        const resultado = [];
        const nodo = this.listaDeVertices[identificadorNodo];
        if (!nodo) return resultado;
        let actual = nodo.primerArco;
        while (actual !== null) {
            resultado.push(actual);
            actual = actual.siguienteArco;
        }
        return resultado;
    }

    //Genera texto con la lista de adyacencia completa
    mostrarGrafo() {
        let texto = "";
        for (let id in this.listaDeVertices) {
            const nodo  = this.listaDeVertices[id];
            const arcos = this.obtenerTodosLosArcos(id);
            texto += id + " – " + nodo.nombre + ": ";
            if (arcos.length === 0) {
                texto += "(sin rutas)\n";
            } else {
                for (let arco of arcos) {
                    texto += "→ " + arco.idDestino + " [" + arco.distanciaEnMetros + "m] ";
                }
                texto += "\n";
            }
        }
        return texto;
    }
}

//Datos iniciales
const mapaUrbano = new Grafo();

mapaUrbano.agregarNodo("A", "Parque Principal");
mapaUrbano.agregarNodo("B", "Paradero");
mapaUrbano.agregarNodo("C", "Universidad de Cundinamarca");
mapaUrbano.agregarNodo("D", "Hospital San Rafael");
mapaUrbano.agregarNodo("E", "Alcaldía Municipal");

mapaUrbano.agregarArco("A", "B", 450);
mapaUrbano.agregarArco("A", "C", 1200);
mapaUrbano.agregarArco("B", "C", 800);
mapaUrbano.agregarArco("B", "D", 600);
mapaUrbano.agregarArco("C", "E", 300);
mapaUrbano.agregarArco("D", "E", 500);
mapaUrbano.agregarArco("E", "A", 950); //E regresa al origen A

//consola
console.log("Lista de adyacencia:");
console.log(mapaUrbano.mostrarGrafo());
