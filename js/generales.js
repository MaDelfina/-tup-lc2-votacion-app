const tipoEleccion = 2;
const tipoRecuento = 1;
const circuitoId = ""; //tiene que estan asi por defecto
const mesaId = ""; //tiene que estan asi por defecto

let seleccionAnio = document.getElementById('seleccionAnio'); //select del año
let seleccionCargo = document.getElementById('seleccionCargo'); //select del cargo
let seleccionDistrito = document.getElementById('seleccionDistrito'); //select del distrito
let seleccionSeccion = document.getElementById('seleccionSeccion'); //select de seccion
let añoElegido;
let cargoElegido;
let distritoElegido;
let idDistritoElegido;
let valorOculto
let idSeccionElegida;
let seccionElegida;
let dataFiltrar;
let errorFiltrar;
let titulo = document.getElementById('titulo');
let subtitulo = document.getElementById('subtitulo');

//COMBOS
function borrarDatos() {
    //se eliminan valores de todos los select menos el de año
    for (let i = seleccionCargo.options.length - 1; i > 0; i--) { //recorre el select desde el último hasta la posición 1, no toca la 0 que seria la de "cargo"
        seleccionCargo.value = 'cargo'
        seleccionCargo.remove(i);
    }
    for (let i = seleccionDistrito.options.length - 1; i > 0; i--) {
        seleccionDistrito.value = "distrito"
        seleccionDistrito.remove(i);
    }
    for (let i = seleccionSeccion.options.length - 1; i > 0; i--) {
        seleccionSeccion.value = "seccion"
        seleccionSeccion.remove(i);
    }
}

seleccionAnio.onchange = function () {
    if (seleccionAnio.value !== 'año') { //llama a la función borrar datos
        borrarDatos()
    }
    añoElegido = seleccionAnio.value
    consultarCargo()
        .then(function (datosFiltros) {
            console.log(datosFiltros) /* recorro el forEach y lleno el combo, con la respuesta de la promesa del async*/
            datosFiltros.forEach(function (eleccion) {
                if (eleccion.IdEleccion == tipoEleccion) {
                    eleccion.Cargos.forEach((cargo) => {
                        // Crea una opción para cada cargo y agrega al combo de cargos
                        const option = document.createElement("option");
                        option.value = cargo.IdCargo;
                        option.textContent = cargo.Cargo.toUpperCase();;
                        seleccionCargo.appendChild(option);
                    });
                }
            });
        })
        .catch(function (error) {
            mensajeRojo.style.display = "block";
            textoRojo.innerHTML = error.message;
        });
};

seleccionCargo.onchange = function () {
    if (seleccionCargo.value !== 'cargo') { //se elminan valores de los select siguientes
        cargoElegido = seleccionCargo.options[seleccionCargo.selectedIndex].text;
        for (let i = seleccionDistrito.options.length - 1; i > 0; i--) {
            seleccionDistrito.value = "distrito"
            seleccionDistrito.remove(i);
        }
        for (let i = seleccionSeccion.options.length - 1; i > 0; i--) {
            seleccionSeccion.value = "seccion"
            seleccionSeccion.remove(i);
        }
    }
    datosFiltros.forEach(function (eleccion) {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
                if (cargo.IdCargo == seleccionCargo.value) {
                    cargo.Distritos.forEach((distrito) => {
                        // Crea una opción para cada distrito y agrega al combo de distritos
                        const option = document.createElement("option");
                        option.value = distrito.IdDistrito;
                        option.textContent = distrito.Distrito.toUpperCase();;
                        seleccionDistrito.appendChild(option);
                    });
                }
            });
        }
    });
}


seleccionDistrito.onchange = function () {
    if (seleccionDistrito.value !== 'distrito') {
        distritoElegido = seleccionDistrito.options[seleccionDistrito.selectedIndex].text; 
        for (let i = seleccionSeccion.options.length - 1; i > 0; i--) {
            seleccionSeccion.value = "seccion"
            seleccionSeccion.remove(i);
        }
    }
    datosFiltros.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {//se verifica si el IdEleccion del objeto eleccion coincide con el valor almacenado en la variable tipoEleccion. Esto se utiliza para filtrar las elecciones que coinciden con el tipo de elección deseado
            eleccion.Cargos.forEach((cargo) => {
                if (cargo.IdCargo == seleccionCargo.value) {
                    cargo.Distritos.forEach((distrito) => {
                        idDistritoElegido = seleccionDistrito.value
                        if (distrito.IdDistrito == seleccionDistrito.value) {
                            distrito.SeccionesProvinciales.forEach((seccionProvincial) => {
                                valorOculto = seccionProvincial.IDSeccionProvincial;
                                document.getElementById("hdSeccionProvincial").value = valorOculto;
                                console.log("seccionProvincial.IdSeccionProvincial:", seccionProvincial.IDSeccionProvincial);
                                if (valorOculto === seccionProvincial.IDSeccionProvincial) {
                                    seccionProvincial.Secciones.forEach((seccion) => {
                                        const option = document.createElement("option");
                                        option.value = seccion.IdSeccion;
                                        option.textContent = seccion.Seccion.toUpperCase();
                                        seleccionSeccion.appendChild(option);
                                    });
                                }
                            });
                        }
                    });
                }
            });

        }
    })
}

seleccionSeccion.onchange = function () {
    idSeccionElegida = seleccionSeccion.value
    seccionElegida = seleccionSeccion.options[seleccionSeccion.selectedIndex].text; 
}

//BOTON FILTRAR
filtrar.onclick = async function () {
    let anioEleccion, categoriaId, distritoId, seccionProvincialId, seccionId;

    // Verificar que campos faltan llenar
    let camposFaltantes = [];

    if (seleccionAnio.value === "año") {
        camposFaltantes.push("Año"); //con el push agrego el elemento al array, siempre que "año" no esté seleccionado. 
    }

    if (seleccionCargo.value === "cargo") {
        camposFaltantes.push("Cargo");
    }

    if (seleccionDistrito.value === "distrito") {
        camposFaltantes.push("Distrito");
    }

    if (seleccionSeccion.value === "seccion") {
        camposFaltantes.push("Sección");
    }

    if (camposFaltantes.length > 0) {
        // Mostrar mensaje amarillo
        mensajeAmarillo.style.display = "block";
        textoAmarillo.innerText = `Por favor complete los campos: ${camposFaltantes.join(',')}.`; //${} permite agregar variables -- camposFaltantes.join(,) va a mostrar los componentes de la variable array separados por una coma

    } else {
        mensajeAmarillo.style.display = "none";
        anioEleccion = añoElegido;
        categoriaId = 2;
        distritoId = idDistritoElegido
        seccionProvincialId = "";
        seccionId = idSeccionElegida;
        console.log(anioEleccion + distritoId + seccionId)

        fetch(`https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`)
            .then(response => {
                console.log(response)
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al obtener los datos del servidor. ');
                }
            })
            .then(data => {
                //imprimo JSON en consola
                dataFiltrar = data
                console.log(dataFiltrar);
                titulo.innerHTML = `Elecciones ${añoElegido} | Generales`;
                subtitulo.innerHTML = `${añoElegido} > Generales > ${cargoElegido} > ${distritoElegido} > ${seccionElegida}`;
                let mesasEscrutadas = document.getElementById("porcentaje-mesas-escrutadas");
                let electores = document.getElementById("porcentaje-electores");
                let participacionEscrutado= document.getElementById ("porcentaje-part-escrutado");
                let distrito = document.getElementById("titulo-provincias");
                let svgDistrito = document.getElementById("svg-provincias");

                if (dataFiltrar.estadoRecuento.mesasTotalizadas === 0) { //no hay datos en la consulta, mostrar mensaje amarillo
                    mensajeAmarillo.style.display = "block";
                    textoAmarillo.innerText = "No se encontró información para la consulta realizada.";
                    mesasEscrutadas.innerHTML = "-";
                    electores.innerHTML = "-";
                    participacionEscrutado.innerHTML = "-";   
                } else {
                    mesasEscrutadas.innerHTML = dataFiltrar.estadoRecuento.mesasTotalizadas;
                    electores.innerHTML = dataFiltrar.estadoRecuento.cantidadElectores;
                    participacionEscrutado.innerHTML =  dataFiltrar.estadoRecuento.participacionPorcentaje + "%";
                    distrito.innerHTML = distritoElegido;
                    svgDistrito.innerHTML = mapas[distritoElegido];

                }
            })
            .catch(error => {
                errorFiltrar = error
                mensajeRojo.style.display = "block";
                textoRojo.innerHTML = error.message
            });
    }
}
