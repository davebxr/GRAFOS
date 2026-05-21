# Mapa de Rutas de Facatativá

Proyecto desarrollado para la asignatura de Programación I de la Universidad de Cundinamarca, enfocado en la construcción de un grafo ponderado usando listas enlazadas de adyacencia en JavaScript.

El sistema representa diferentes lugares importantes de Facatativá como nodos y las conexiones entre ellos como aristas dirigidas con peso (distancia en metros). Además, permite visualizar el grafo dinámicamente en el navegador mediante SVG.

# Integrantes

- Edgar David Acosta Bernal
- Cristian Felipe Ortiz Cucunuba

# Descripción del problema

El proyecto simula un sistema de rutas urbanas de Facatativá.

Cada lugar importante de la ciudad se representa mediante un nodo del grafo, mientras que cada conexión entre lugares se representa mediante una arista dirigida con un peso asociado.

El objetivo principal fue implementar el grafo utilizando listas enlazadas dinámicas, evitando completamente el uso de matrices rígidas de adyacencia.

Además de la estructura de datos, el proyecto incluye una visualización web que permite:

- Ver el grafo en pantalla
- Agregar nuevos lugares
- Crear nuevas rutas
- Mostrar la lista de adyacencia

# Objetivos del proyecto

- Implementar un grafo ponderado en JavaScript
- Utilizar listas enlazadas de adyacencia
- Construir una visualización dinámica usando SVG
- Aplicar conceptos de nodos, aristas y recorridos
- Separar la lógica del grafo de la interfaz gráfica

# Estructura del proyecto

GRAFOS
│
├── index.html
├── styles.css
├── grafo.js
└── control.js


| Archivo | Función |
|---|---|
| index.html | Interfaz principal |
| styles.css | Diseño visual y estilos |
| grafo.js | Estructura del grafo y clases |
| control.js | Visualización SVG y conexión con la interfaz |

# Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- SVG

# Estructura de datos utilizada

El proyecto utiliza una lista de adyacencia enlazada, donde:

- Cada vértice es un objeto Nodo
- Cada conexión es un objeto Arista
- Las aristas se enlazan mediante referencias

Esta estructura permite agregar nodos y rutas dinámicamente sin depender de tamaños fijos

# Clase Arista

Representa una conexión entre dos lugares.

```js
class Arista {
    constructor(idDestino, distanciaEnMetros) {
        this.idDestino = idDestino;
        this.distanciaEnMetros = distanciaEnMetros;
        this.siguienteArco = null;
    }
}
```

## Atributos

| Atributo | Descripción |
|---|---|
| idDestino | Nodo al que apunta la ruta |
| distanciaEnMetros | Peso de la arista |
| siguienteArco | Referencia al siguiente arco |

---

# Clase Nodo

Representa un lugar dentro del mapa urbano.

```js
class Nodo {
    constructor(identificador, nombre) {
        this.identificador = identificador;
        this.nombre = nombre;
        this.primerArco = null;
    }
}
```

## Atributos

| Atributo | Descripción |
|---|---|
| `identificador` | ID único del nodo |
| `nombre` | Nombre del lugar |
| `primerArco` | Primer arco enlazado |

---

# Clase Grafo

Administra todos los nodos y conexiones del sistema.

```js
listaDeVertices = {
  "A": Nodo → Arista("B", 450) → Arista("C", 1200),
  "B": Nodo → Arista("D", 600)
}
```

Esto demuestra que el proyecto trabaja con listas enlazadas y no con matrices.


# Métodos principales

## agregarNodo(id, nombre)

Agrega un nuevo lugar al mapa.

```js
mapaUrbano.agregarNodo("A", "Parque Principal");
```

---

## agregarArco(idOrigen, idDestino, distancia)

Crea una conexión dirigida entre dos nodos.

```js
mapaUrbano.agregarArco("A", "B", 450);
```

### Validaciones realizadas

- Verifica que el nodo origen exista.
- Verifica que el nodo destino exista.
- La distancia debe ser mayor a cero.
- No permite rutas duplicadas.

---

## mostrarGrafo()

Muestra la lista de adyacencia completa.

Ejemplo:

```txt
A → B [450m] → C [1200m]
B → D [600m]
```

---

# Visualización del grafo

La visualización fue desarrollada usando SVG y JavaScript puro.

Cada nodo se dibuja como:

- Un círculo.
- Una etiqueta de texto.
- Un identificador.

Cada arista se representa mediante:

- Líneas dirigidas.
- Flechas.
- Etiquetas con el peso.

# Capturas del proyecto

## Vista principal del grafo

<img width="1098" height="741" alt="image" src="https://github.com/user-attachments/assets/71176f60-5095-46ba-a732-dba33aefa542" />

> Visualización principal del sistema de rutas urbanas de Facatativá. En la imagen se observan los nodos, aristas dirigidas y pesos correspondientes a las distancias entre lugares.


## Formulario para agregar nodos y rutas

<img width="246" height="490" alt="image" src="https://github.com/user-attachments/assets/0f08c07c-0cb5-4810-bfc4-0f06ff0066c7" />

> Interfaz utilizada para agregar nuevos lugares y rutas dinámicamente dentro del grafo.

## Lista de adyacencia

<img width="213" height="165" alt="image" src="https://github.com/user-attachments/assets/50065f71-a4a5-4ffb-b3e7-1ea07558b290" />

> Representación textual de la estructura del grafo mediante listas enlazadas de adyacencia.


# Lugares iniciales del proyecto

| ID | Lugar |
|---|---|
| A | Parque Principal |
| B | Paradero |
| C | Universidad de Cundinamarca |
| D | Hospital San Rafael |
| E | Alcaldía Municipal |


# Rutas iniciales

| Origen | Destino | Distancia |
|---|---|---|
| A | B | 450 m |
| A | C | 1200 m |
| B | C | 800 m |
| B | D | 600 m |
| C | E | 300 m |
| D | E | 500 m |
| E | A | 950 m |

#  Casos de prueba realizados

| Caso | Resultado esperado |
|---|---|
| Nodo repetido | Se muestra error |
| Ruta duplicada | No se agrega |
| Nodo inexistente | Se muestra advertencia |
| Distancia inválida | Error |
| Grafo vacío | Mensaje “Sin nodos todavía” |

#  Cómo ejecutar el proyecto

1. Descargar o clonar el repositorio
2. Abrir el archivo index.html
3. El grafo aparecerá automáticamente
4. Usar el panel lateral para agregar nodos y rutas
5. Probar la visualización y la lista de adyacencia

# Referencias

- Cormen, T. et al. *Introduction to Algorithms*, MIT Press.
- MDN Web Docs – SVG y JavaScript.
- Documentación oficial de JavaScript:
  https://developer.mozilla.org/es/docs/Web/JavaScript
- SVG en HTML:
  https://developer.mozilla.org/es/docs/Web/SVG

# Conclusiones

Durante el desarrollo del proyecto se logró comprender cómo funcionan internamente los grafos usando listas enlazadas y referencias entre objetos.

También se fortalecieron conceptos relacionados con:

- Estructuras de datos dinámicas.
- Manipulación del DOM.
- Renderizado SVG.
- Organización del código en módulos.
- Validación de datos y manejo de errores.

El proyecto cumple con los requerimientos solicitados en la actividad, incluyendo la representación dinámica del grafo, la visualización web y el uso correcto de listas de adyacencia enlazadas.
