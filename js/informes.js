let mensajeAmarillo = document.getElementById("mensaje-amarillo-informes");
let textoAmarillo = document.getElementById("texto-amarillo-informes");
let mensajeVerde = document.getElementById("mensaje-verde-informes");
let textoVerde = document.getElementById("texto-verde-informes");
let mensajeRojo = document.getElementById("mensaje-rojo-informes");
let textoRojo = document.getElementById("texto-rojo-informes");
let arrayDatosString = localStorage.getItem('INFORMES');
let dataFiltrar;


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
        verificarLocal();
    } else {
        // Si el localStorage está vacío, muestra mensaje amarillo
        mensajeAmarillo.style.display="block";
        mensajeRojo.style.display="none";
        mensajeVerde.style.display="none";
        textoAmarillo.innerHTML = "No hay informes guardados para mostrar."
    }
}

async function verificarLocal() {
    let arrayDatosString = localStorage.getItem('INFORMES');
    let arrayDatos = arrayDatosString ? arrayDatosString.split(',') : []; //Verifica si la cadena existe y la divide en un array llamado arrayDatos usando la coma como separador. Si la cadena no existe, se asigna un array vacío
    let distrito = document.getElementById("titulo-provincias");
    let svgDistrito = document.getElementById("svg-provincias");
    let titulo = document.getElementById('titulo');
    let subtitulo = document.getElementById('subtitulo')
    
    //Verificar si hay elementos en arrayDatos
    if (arrayDatos.length > 0) {
        for (let i = 0; i < arrayDatos.length; i++) {

            let registro = arrayDatos[i];
            let datosSeparados = registro.split('|');

            let añoElegido = datosSeparados[0];
            let tipoRecuento = datosSeparados[1];
            let tipoEleccion = datosSeparados[2];
            let categoriaId = datosSeparados[3];
            let distritoElegido = datosSeparados[4];
            let seccionProvinciaElegida = datosSeparados[5];
            let idSeccionElegida = datosSeparados[6];
            let circuitoId = datosSeparados[7];
            let mesaId = datosSeparados[8];

            fetch(`https://elecciones-lc2.bruselario.com/api/resultados/getResultados/?anioEleccion=${añoElegido}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoElegido}&seccionProvincialId=${seccionProvinciaElegida}&seccionId=${idSeccionElegida}&circuitoId=${circuitoId}&mesaId=${mesaId}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Error al obtener los datos del servidor. ');
                    }
                })
                .then(data => {
                    dataFiltrar = data
                    console.log(dataFiltrar);

                    //MAPA
                    distrito.innerHTML = distritoElegido;
                    svgDistrito.innerHTML = mapas[distritoElegido]; //me muestra el numero en el que se encuentra el mapa

                    //TITULO Y SUBTITULO
                    titulo.innerHTML = `Elecciones ${añoElegido} | Paso`; //esto funcina
                    subtitulo.innerHTML = `${añoElegido} > Paso > ${tipoEleccion} > ${distritoElegido} > ${idSeccionElegida}`; //me muestra los numero en vez de los valores

                })
                .catch(error => {
                    console.error('Error al realizar la consulta a la API:', error);
                });
        }
    }
}