const tipoEleccion = 1;
const tipoRecuento = 1;
const circuitoId = ""; //tiene que estan asi por defecto
const mesaId = ""; //tiene que estan asi por defecto

let seleccionAnio = document.getElementById('seleccionAnio'); //select del año
let seleccionCargo = document.getElementById('seleccionCargo'); //select del cargo
let seleccionDistrito = document.getElementById('seleccionDistrito'); //select del distrito
let seleccionSeccion = document.getElementById('seleccionSeccion'); //select de seccion
let mensajeAmarillo = document.getElementById('mensajeAmarillo'); //mensaje en amarillo
let mensajeRojo = document.getElementById('mensajeRojo'); //mensaje en rojo
let filtrar = document.getElementById('botonFiltrar'); //boton filtrar

function borrarDatos() {
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
    if (seleccionAnio.value !== 'año') {
        borrarDatos()
    }
    consultarCargo()
        .then(function (datosFiltros) { /* recorro el forEach y lleno el combo, con la respuesta de la promesa del async*/
            datosFiltros.forEach(function (eleccion) {
                if (eleccion.IdEleccion == tipoEleccion) {
                    eleccion.Cargos.forEach((cargo) => {
                        // Crea una opción para cada cargo y agrega al combo de cargos
                        const option = document.createElement("option");
                        option.value = cargo.IdCargo;
                        option.textContent = cargo.Cargo;
                        seleccionCargo.appendChild(option);
                    });
                }
            });
        })
        .catch(function (error) {
            alert(error.message);
        });
};

seleccionCargo.onclick = function () { //lo hice para que salte el alert cuando haga click en cargo
    if (seleccionAnio.value === 'año') {
        alert('Debe seleccionar las opciones anteriores para acceder a este campo');
    }
}

seleccionCargo.onchange = function () {
    const cargoSeleccionado = seleccionCargo.value;
    if (seleccionCargo.value !== 'cargo') {
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
                if (cargo.IdCargo == cargoSeleccionado) {
                    cargo.Distritos.forEach((distrito) => {
                        // Crea una opción para cada distrito y agrega al combo de distritos
                        const option = document.createElement("option");
                        option.value = distrito.IdDistrito;
                        option.textContent = distrito.Distrito;
                        seleccionDistrito.appendChild(option);
                    });
                }
            });
        }
    });
}

seleccionDistrito.onclick = function () {
    if (seleccionAnio.value === 'año' || seleccionCargo.value === 'cargo') {
        alert('Debe seleccionar las opciones anteriores para acceder a este campo');
    }
}

seleccionDistrito.onchange = function () {
    if (seleccionDistrito.value !== 'distrito') { //se eliminan valores del select
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
                        if (distrito.IdDistrito == seleccionDistrito.value) {
                            distrito.SeccionesProvinciales.forEach((seccion) => {
                                // Crea una opción para cada sección y agrega al combo de secciones
                                const option = document.createElement("option");
                                option.value = seccion.IdSeccion;
                                option.textContent = seccion.Seccion;
                                seleccionSeccion.appendChild(option);
                            });
                        }
                    });
                }
            });
        }
    });
}

seleccionSeccion.onclick = function () {
    if (seleccionAnio.value === 'año' || seleccionCargo.value === 'cargo' || seleccionDistrito.value === 'distrito') {
        alert('Debe seleccionar las opciones anteriores para acceder a este campo');
    }
}

botonFiltrar.onclick = function () {
    // Verificar que todos los campos de selección estén completos
    if (
        seleccionAnio.value === "año" ||
        seleccionCargo.value === "cargo" ||
        seleccionDistrito.value === "distrito" ||
        seleccionSeccion.value === "seccion"
    ) {
        // Mostrar mensaje amarillo
        mensajeAmarillo.style.display = "block";
        return;
    }

    // Recuperar los valores del filtro
    const anioEleccion = seleccionAnio.value;
    const tipoRecuento = tipoRecuento;
    const tipoEleccion = tipoEleccion;
    const categoriaId = seleccionCargo.value;
    const distritoId = seleccionDistrito.value;
    const seccionProvincialId = seleccionSeccion.value;
    const seccionId = seleccionSeccion.value;

    // Realizar la consulta al servicio
    const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // Mostrar el JSON de la respuesta en consola
            console.log(data);
        })
        .catch((error) => {
            // Mostrar mensaje rojo
            mensajeRojo.style.display = "block";
            mensajeRojo.innerHTML = error;
        });
};