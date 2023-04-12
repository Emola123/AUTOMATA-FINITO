const botonForm = document.getElementById('formSubmit')
const formText = document.getElementById('formText')

const botonHistorial = document.getElementById('history')
const formulario = document.getElementById('form')
const historialContenedor = document.getElementById('historialContainer')

const modal = document.getElementById('modal')
const textModal = document.getElementById('textModal')
const aceptadoModal = document.getElementById('aceptadoModal')
const noAceptadoModal = document.getElementById('noAceptadoModal')
const botonModal = document.getElementById('botonModal')

let diagram;

window.onload = function init() {
  
        // Definir los datos del autómata
    var nodeDataArray = [
        { key: "0", text: "q0", loc: new go.Point(-100, 0)},
        { key: "1", text: "q1", loc: new go.Point(50, -50), isAccept: true},
        { key: "2", text: "q2", loc: new go.Point(200, -60), isAccept: true},
        { key: "3", text: "q3", loc: new go.Point(100, 200)},
        { key: "4", text: "q4", loc: new go.Point(250, 50), isAccept: true},
        { key: "5", text: "q5", loc: new go.Point(350, -50), isAccept: true},
        { key: "6", text: "q6", loc: new go.Point(350, 250), isAccept: true},
        { key: "7", text: "q7", loc: new go.Point(500, -50)},
        { key: "8", text: "q8", loc: new go.Point(650, -50), isAccept: true}
    ];
    
    var linkDataArray = [
        { from: "0", to: "1", text: "b" },
        { from: "1", to: "2", text: "b" },
        { from: "2", to: "5", text: "a" },
        { from: "5", to: "7", text: "b" },
        { from: "7", to: "8", text: "a" },
        { from: "8", to: "7", text: "b" },
        { from: "2", to: "4", text: "b" },
        { from: "4", to: "4", text: "b" },
        { from: "1", to: "3", text: "a" },
        { from: "4", to: "3", text: "a" },
        { from: "3", to: "6", text: "a" },
        { from: "6", to: "3", text: "a" },
        { from: "6", to: "4", text: "b" }
    ];
    
    
    // Crear el diagrama con GoJS
    var $ = go.GraphObject.make;
    
    
    
    diagram = $(go.Diagram, "myDiagramDiv", {
    "undoManager.isEnabled": true,
    allowMove: false,
    allowHorizontalScroll: false,
    allowVerticalScroll: false
    });
    
    // Definir los nodos y las conexiones
    diagram.nodeTemplate =
    $(go.Node, "Auto", 
      { width: 50, height: 50},
      new go.Binding("location", "loc"),
      $(go.Shape, "Ellipse", { fill: "white", stroke: "black", strokeWidth: 2 }),
      $(go.Panel, "Auto",
        { visible: false },
        new go.Binding("visible", "isAccept"),
        $(go.Shape, "Circle", { fill: "null", width: 40, height: 40, strokeWidth: 2})
      ),
      $(go.TextBlock, { margin: 5 }, new go.Binding("text", "text"))
    );
  
    
    diagram.linkTemplate =
    $(go.Link,
    { curve: go.Link.Bezier, curviness: 10 },
    
      $(go.Shape, { strokeWidth: 2},
      new go.Binding("stroke", "", function(link) {
        if (link.fromNode.data.key === "0" && link.toNode.data.key === "1") {
          return "";
        }
        return "black";
      }).ofObject(),),
      $(go.Shape, { toArrow: "OpenTriangle", fill: null }),
      $(go.TextBlock, { segmentOffset: new go.Point(0, -10) }, new go.Binding("text", "text"),
      { position: new go.Point(6, 6), font: "13pt sans-serif" }, new go.Binding("text", "loc"))
    );
    
    
    // Agregar los datos al diagrama
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    diagram.isReadOnly = true;
    
    
}

botonForm.addEventListener('click',(evento)=>recorrerAutomata(evento))

function recorrerAutomata(evento) {
  evento.preventDefault();
  let timeoutDelayLinks = 0;
  let timeoutDelay = 0;
  let inputWord = document.getElementById("formText").value;
  let currentNode = diagram.findNodeForKey("0");
  let i = 0;
  
  // Colocamos los nodos al color por defecto
  diagram.nodes.each(function(node) {
      node.findMainElement().stroke = "black";
      node.findMainElement().fill = "white";
    });

  // Colocamos los enlaces al color por defecto
  diagram.links.each(function(link) {
    link.path.stroke = "black";
    link.path.strokeDashArray = [];
  });

  function procesarSiguienteCaracter() {
      if (i < inputWord.length) {
        let nextNode = null;
        let currentChar = inputWord.charAt(i);

        diagram.links.each(function(link) {
          if (link.fromNode.data.key === currentNode.data.key && link.data.text === currentChar) {
            nextNode = diagram.findNodeForKey(link.toNode.data.key);
          }
        });

        if (nextNode === null) {
            currentNode.findMainElement().stroke = "black";
            currentNode.findMainElement().fill = "red";
            setTimeout(function() {
              mostrarModal(false);
            }, 1000);
            return;
        }

        let link = null;
        diagram.links.each(function(l) {
            if (l.fromNode === currentNode && l.toNode === nextNode) {
                link = l;
                return false;
            }
        });
      
        if (link === null) {
            mostrarModal(false);
            return;
        }

        // Colorear el nodo actual y el enlace
        currentNode.findMainElement().stroke = "green";
        currentNode.findMainElement().fill = "gray";

        setTimeout(function() {
            link.path.stroke = "green";
            link.path.strokeDashArray = [4, 2];
          }, timeoutDelayLinks);
        
        // Actualizar nodo actual y contador
        let previousNode = currentNode;
        currentNode = nextNode;
        i++;
        
      // Colorear enlace anterior rojo al pasar al siguiente nodo
      setTimeout(function() {
          previousNode.findMainElement().stroke = "red";
          link.path.stroke = "red";
          procesarSiguienteCaracter();
        }, timeoutDelay);
      } else {
          // Verificar si el nodo actual es un estado de aceptación
          if (currentNode.data.isAccept) {
              currentNode.findMainElement().stroke = "red";
              currentNode.findMainElement().fill = "yellow";
              setTimeout(function() {
                mostrarModal(true);
              }, 1000);
          } else {
              currentNode.findMainElement().stroke = "black";
              currentNode.findMainElement().fill = "red";
              setTimeout(function() {
                mostrarModal(false);
              }, 1000);
          }
      }
  }

  function actualizarVelocidad() {
      let speed = document.getElementById("formRango").value;
      timeoutDelay = 5000 - (speed * 45);
      timeoutDelayLinks = 4000 - (speed * 45);
    }
  
    actualizarVelocidad();
  
    document.getElementById("formRango").addEventListener("input", function() {
      actualizarVelocidad();
    });

  procesarSiguienteCaracter();
}

function mostrarModal(Aceptado){
  modal.classList.remove('oculto')
  modal.classList.add('containerModal')
  mostrarResultado(Aceptado);
}

function mostrarResultado(Aceptado){
  if(Aceptado){
    const text1 = document.getElementById("textModal");
    text1.style.display = "block";
    const text2 = document.getElementById("textModal2");
    text2.style.display = "none";
    const frase = text1.textContent;
    aceptadoModal.classList.remove('oculto')
    aceptadoModal.classList.add('aceptada')
    const mensaje = new SpeechSynthesisUtterance(frase);
    mensaje.pitch = -1;
    setTimeout(() => {
      speechSynthesis.speak(mensaje);
    }, 500);
    guardarEstado(true)
  }else{
    const text1 = document.getElementById("textModal");
    text1.style.display = "none";
    const text2 = document.getElementById("textModal2");
    text2.style.display = "block";
    const frase = text2.textContent;
    noAceptadoModal.classList.remove('oculto')
    noAceptadoModal.classList.add('noAceptada')
    const mensaje = new SpeechSynthesisUtterance(frase);
    mensaje.pitch = -1;
    setTimeout(() => {
      speechSynthesis.speak(mensaje);
    }, 500);
    guardarEstado(false)
  }
}
  
botonModal.addEventListener('click',()=>{
  modal.classList.add('oculto')
  modal.classList.remove('containerModal')

  aceptadoModal.classList.remove('aceptado')
  noAceptadoModal.classList.remove('noAceptada')

  aceptadoModal.classList.add('oculto')
  noAceptadoModal.classList.add('oculto')
})


const Palabra={
    'Palabra':'',
    'Estado':''
}

formText.addEventListener('input',(valor)=>guardarPalabra(valor))

function guardarPalabra(valor){
    const palabra = valor.target.value;
    Palabra.Palabra=palabra;
}
function guardarEstado(Estado){
    if(Estado){
      Palabra.Estado='Aceptada';
    }else{
      Palabra.Estado='No Aceptada';
    }
    console.log(JSON.stringify(Palabra))
    enviarDatos()
}

function enviarDatos(){
  fetch('https://desingkuro.pythonanywhere.com/Palabras_recibidas', {
    method: 'POST',
    body: JSON.stringify(Palabra),
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => response.text())
  .then(data => console.log(data))
}

botonHistorial.addEventListener('click',()=>{
  ocultarForm();
  mostrarDivHistorial();
  obtenerDatos();
})

function ocultarForm(){
  formulario.classList.add('oculto')
}

function mostrarDivHistorial(){
  const cuboIcon = document.getElementById('cuboIcon')
  cuboIcon.classList.add('oculto');
  historialContenedor.classList.remove('oculto')
  historialContenedor.classList.add('containerHistorial')
};

function obtenerDatos() {
  let table = document.getElementById("tabla-datos");
  let rowCount = table.rows.length;
  for (var i = rowCount - 1; i > 0; i--) {
      table.deleteRow(i);
  }

  const diccionario = {
    "Aceptada": {
      "es": "Aceptada",
      "en": "Accepted",
      "fr": "Accepté"
    },
    "No Aceptada": {
      "es": "No Aceptada",
      "en": "Not Accepted",
      "fr": "Non accepté"
    }
  };
  
  fetch('https://desingkuro.pythonanywhere.com/Palabras')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const tabla = document.getElementById("tabla-datos");
        let contadorColumna = 0;
        let idiomaDestino = "es"; // valor predeterminado
        // Agregar controlador de eventos a los enlaces de idioma
        document.querySelectorAll(".dropdown-content a").forEach((enlace) => {
            enlace.addEventListener("click", (event) => {
                event.preventDefault();
                idiomaDestino = enlace.getAttribute("data-lang");
                // Actualizar la tabla con los nuevos datos traducidos
                actualizarTabla(data, tabla, idiomaDestino);
            });
        });
        // Construir la tabla inicialmente
        actualizarTabla(data, tabla, idiomaDestino);
    });

function actualizarTabla(data, tabla, idiomaDestino) {
  const rowCount = tabla.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
    tabla.deleteRow(i);
  }
    // Iterar sobre el array de datos y agregar cada fila a la tabla
    data.forEach((fila) => {
        const nuevaFila = tabla.insertRow();
        fila.forEach((palabra, index) => {
            const nuevaCelda = nuevaFila.insertCell();
            let nuevoTexto;
            if (index === 2) {
                const traduccion = diccionario[palabra][idiomaDestino];
                nuevoTexto = document.createTextNode(traduccion || palabra);
            } else {
                nuevoTexto = document.createTextNode(palabra);
            }
            nuevaCelda.appendChild(nuevoTexto);
        });
    });
}


  
}


