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
  valor.textContent = rango.value;
}


loadTranslation('es');

const items = document.querySelectorAll('.items');
const dropdownContent = document.querySelector('.dropdown-content');

 
function loadTranslation(lang) {
    fetch(`idiomas/${lang}.txt`)
      .then(response => response.text())
      .then(data => {
        const translations = data.split('\n');
        translations.forEach(translation => {
        const [key, value] = translation.trim().split(/\s*=\s*/);
        const element = document.getElementById(key);
        const elements = [element];
          elements.forEach(element => {
            element.textContent = value;
          });
        }); 
    })
    .catch(error => console.error(error));
}
  


function highlightLanguage(item) {
    items.forEach(item => {
        item.classList.remove('active');
    });
    item.classList.add('active');
}

items.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const lang = this.dataset.lang;
        loadTranslation(lang);
        highlightLanguage(this);
    });
});


document.getElementById('idioma').addEventListener('click', function() {
    dropdownContent.classList.toggle('show');
});

//Modo oscuro 
const dropbtn = document.querySelector(".dropbtn");
const darkMode = document.getElementById('clickDarkMode');
const menu = document.querySelector('.Menu');
const idioma = document.querySelector('.containerAutomata');
darkMode.addEventListener('change', ()=>{
    menu.classList.toggle('dark');
    idioma.classList.toggle('darkBody');
    dropbtn.classList.toggle('idiomaDark');
});

