const botonForm = document.getElementById('formSubmit')
const formText = document.getElementById('formText')

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
    "undoManager.isEnabled": true
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
    var inputWord = document.getElementById("formText").value;
    var currentNode = diagram.findNodeForKey("0");
      
    diagram.links.each(function(link) {
        link.path.stroke = "black";
      });
    
    for (var i = 0; i < inputWord.length; i++) {
      var nextNode = null;
      var currentChar = inputWord.charAt(i);
      
      diagram.links.each(function(link) {
        if (link.fromNode.data.key === currentNode.data.key && link.data.text === currentChar) {
          nextNode = diagram.findNodeForKey(link.toNode.data.key);
        }
      });
      
      if (nextNode === null) {
      mostrarModal(false);
        return;
      }
      
      var link = null;
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
    link.path.stroke = "red";
    currentNode.findMainElement().stroke = "red";
    currentNode.findMainElement().fill = "gray";
      
      currentNode = nextNode;
    }

    
    
    if (currentNode.data.isAccept) {
      mostrarModal(true);
    } else {
      mostrarModal(false);
    }

    // Cambiar el color del borde del nodo actual
    currentNode.findMainElement().stroke = "red";
    currentNode.findMainElement().fill = "yellow";
  }

function mostrarModal(Aceptado){
  modal.classList.remove('oculto')
  modal.classList.add('containerModal')
  mostrarResultado(Aceptado);
}

function mostrarResultado(Aceptado){
  if(Aceptado){
    textModal.textContent = 'Palabra Aceptada'
    aceptadoModal.classList.remove('oculto')
    aceptadoModal.classList.add('aceptada')
    guardarEstado(true)
  }else{
    textModal.textContent = 'Palabra no Aceptada'
    noAceptadoModal.classList.remove('oculto')
    noAceptadoModal.classList.add('noAceptada')
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


const Palabras={
    'Palabra':'',
    'Estado':''
}

formText.addEventListener('input',(valor)=>guardarPalabra(valor))

function guardarPalabra(valor){
    const palabra = valor.target.value;
    Palabras.Palabra=palabra;
}
function guardarEstado(Estado){
    if(Estado){
      Palabras.Estado='Aceptado';
    }else{
      Palabras.Estado='No Aceptado';
    }
    console.log(JSON.stringify(Palabras))
}