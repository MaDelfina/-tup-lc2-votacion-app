var datosFiltros = []

let mensajeAmarillo = document.getElementById("mensaje-amarillo");
let textoAmarillo = document.getElementById("texto-amarillo");
let mensajeVerde = document.getElementById("mensaje-verde");
let textoVerde = document.getElementById("texto-verde");
let mensajeRojo = document.getElementById("mensaje-rojo");
let textoRojo = document.getElementById("texto-rojo");
let mensajeAmarilloTitulo = document.getElementById("mensaje-amarillo-titulo");
let mensajeRojoTitulo = document.getElementById("mensaje-rojo-titulo");
let textoRojoTitulo = document.getElementById("texto-rojo-titu");
let filtrar = document.getElementById("barra-menu-filtrar"); //boton filtrar
let sectionContenido = document.getElementById("sec-contenido") //section que contiene mapas y cuadritos.

//OCULTAR MENSAJES NI BIEN ABRO LA PAGINA. 

document.addEventListener("DOMContentLoaded", function () {
    ocultarMensajes();
    ocultarContenido();
}); //esta forma de crear un evento la saque de internet, me pareció muy buena. se utiliza para escuchar eventos en elementos del DOM
//en este caso los mensajes se ocultaran tan pronto como la página se inicie sin esperar a que se cargue por completo (lo que window.onload haría)

function ocultarMensajes() {
    mensajeVerde.style.display = "none";
    mensajeRojo.style.display = "none";
    mensajeRojoTitulo.style.display="none";
    mensajeAmarilloTitulo.style.display="none";
}

function ocultarContenido()
{
    sectionContenido.style.display = "none"
}

//COMBOS
async function consultaAnio() {
    const url = 'https://resultados.mininterior.gob.ar/api/menu/periodos'
    const respuesta = await fetch(url);
    if (respuesta.ok) {
        const data = await respuesta.json(); //almacenar y transportar información
        return data
    } else {
        throw new Error('Error al obtener los datos del servidor. ');
    }
}

window.onload = function () {
    consultaAnio()
        .then(function (data) { /* recorro el forEach y lleno el combo, con la respuesta de la promesa del async*/
            data.forEach(anio => {
                const option = document.createElement("option");
                option.value = anio;
                option.textContent = anio.toString();
                seleccionAnio.appendChild(option);
            });
        })
        .catch(function (error) {
            mensajeRojo.style.display = "block";
            textoRojo.innerHTML = error.message;
        });
};

async function consultarCargo() {
    const respuesta = await fetch('https://resultados.mininterior.gob.ar/api/menu?año=' + seleccionAnio.value);
    if (respuesta.ok) {
        datosFiltros = await respuesta.json();
        return datosFiltros
    } else {
        throw new Error('Error al obtener los datos del servidor. ');
    }
}

//BOTON FILTRAR

filtrar.addEventListener("mouseover", function () { //función para que el cursor cambie al pasar por el botón filtrar. 
    filtrar.style.cursor = "pointer";
});