let mensajeAmarillo = document.getElementById("mensaje-amarillo-informes");
let textoAmarillo = document.getElementById("texto-amarillo-informes");
let mensajeVerde = document.getElementById("mensaje-verde-informes");
let textoVerde = document.getElementById("texto-verde-informes");
let mensajeRojo = document.getElementById("mensaje-rojo-informes");
let textoRojo = document.getElementById("texto-rojo-informes");
let arrayDatosString = localStorage.getItem('INFORMES');

document.addEventListener("DOMContentLoaded", function () {
    mostrarMensajes();
})

function mostrarMensajes (){
        // Se verifica si la cadena arrayDatosString tiene algún valor
        if (arrayDatosString) {
           //si tiene datos se bloquean todos los mensajes
           mensajeAmarillo.style.display="none";
           mensajeRojo.style.display="none";
           mensajeVerde.style.display="none";
        } else {
            // Si el localStorage está vacío, muestra mensaje amarillo
            mensajeAmarillo.style.display="block";
            mensajeRojo.style.display="none";
            mensajeVerde.style.display="none";
            textoAmarillo.innerHTML = "No hay informes guardados para mostrar."
        }
    }

functio