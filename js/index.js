const containerLoader = document.getElementById('load');
const loaderCircle = document.getElementById('circle');
const textLoader = document.getElementById('textLoad');

const activarForm = document.getElementById('insertarPalabra')
const cuboIcon = document.getElementById('cuboIcon')
const form = document.getElementById('form')

window.addEventListener('load',()=>{
    setTimeout(()=>{
        containerLoader.classList.remove('load');
        containerLoader.classList.add('oculto');
    },2000)
})

activarForm.addEventListener('click',()=>{
    cuboIcon.classList.add('oculto')
    form.classList.remove('oculto')
})

document.addEventListener("DOMContentLoaded", function() {
    var rango = document.getElementById("formRango");
    var valor = document.getElementById("valorRango");
    valor.innerHTML = rango.value;
});

function mostrarValorRango() {
    var rango = document.getElementById("formRango");
    var valor = document.getElementById("valorRango");
    valor.innerHTML = rango.value;
  }