const getPuntitos = () => {
        const contenedor_loader = document.querySelector('.contenedorloader')
        contenedor_loader.style.opacity = 0;
        contenedor_loader.style.visibility = 'visible';
}

const button = document.getElementById("btnLoad");
const result = button.addEventListener("click", getPuntitos);

