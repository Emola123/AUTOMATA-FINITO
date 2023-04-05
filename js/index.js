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

const darkMode = document.getElementById('clickDarkMode');
darkMode.addEventListener('change', (event)=>{
    document.body.classList.toggle('dark');
});

const menu = document.querySelector(".Menu");
const checkbox = document.querySelector(".clickDarkMode");
checkbox.addEventListener("change", function() {
  
});
if (checkbox.checked) {
    menu.classList.add("dark-mode");
  } else {
    menu.classList.remove("dark-mode");
}
  



