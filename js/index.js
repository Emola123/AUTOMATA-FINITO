const containerLoader = document.getElementById('load');
const loaderCircle = document.getElementById('circle');
const textLoader = document.getElementById('textLoad');

const activarForm = document.getElementById('insertarPalabra')
const cuboIcon = document.getElementById('cuboIcon')
const form = document.getElementById('form')

const activarHistorial = document.getElementById('historial')

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

activarHistorial.addEventListener('click',()=>{
    cuboIcon.classList.add('oculto')
    form.classList.add('oculto')
})

