const tipoEleccion = 1;
const tipoRecuento = 1;
let seleccionAnio = document.getElementById('seleccionAnio'); //select del año
let seleccionCargo = document.getElementById('seleccionCargo'); //select del cargo
let seleccionDistrito = document.getElementById('seleccionDistrito'); //select del distrito
let seleccionSeccion = document.getElementById('seleccionSeccion'); //select de seccion
let filtrar = document.getElementById('filtrar'); //boton filtrar

async function consultaAnio() {
    if (seleccionAnio.value === "") {
        alert('No seleccionó ningún año.');
        return false;
    } else {
        const url = 'https://resultados.mininterior.gob.ar/api/menu/periodos';
        try {
            const respuesta = await fetch(url);

            if (respuesta.ok) {
                const data = await respuesta.json();
                console.log(data);
               
                //Se recorre la respuesta del json para llenar el combo de años con los años
                data.forEach(anio => {
                    const option = document.createElement("option");
                    option.value = anio; //valor del combo
                    option.textContent = anio.toString();  // Convertir a cadena para que el texto se pueda ver en el combo
                    seleccionAnio.appendChild(option); // Se agregan las opciones en el select
                });
            } else {
                alert("Error.");
            }
        } catch (error) {
            alert("Error");
        }
    }
}

async function consultaCargo(){
    if (seleccionAnio.value === "") {
        alert('No seleccionó ningún año.');
        return false;
    } else {
        const url = 'https://resultados.mininterior.gob.ar/api/menu?año=' + seleccionAnio.value;
        try {
            const respuesta = await fetch(url);
    
            if (respuesta.ok) {
                const datosFiltros = await respuesta.json();
                console.log(datosFiltros);
    
                // Filtra los datos por el tipo de elección que estamos consultando
                datosFiltros.forEach((eleccion) => {
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
            } else {
                alert("Error en la consulta de cargos.");
            }
        } catch (error) {
            alert("Error en la consulta de cargos.");
        }
    }
}

async function consultarDistrito() {
    if (seleccionCargo.value === "") {
        alert('No seleccionó ningún cargo.');
        return false;
    } else {
        datosFiltros.forEach((eleccion) => {
            if (eleccion.IdEleccion == tipoEleccion) {
                eleccion.Cargos.forEach((cargo) => {
                    if (cargo.IdCargo == seleccionCargo) {
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
}

async function consultarSeccion(datosFiltros, seleccionDistrito){
    datosFiltros.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
                if (cargo.IdCargo == seleccionCargo.value) {
                    cargo.Distritos.forEach((distrito) => {
                        if (distrito.IdDistrito == seleccionDistrito) {
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

seleccionDistrito.addEventListener("change", () => {
    const seleccionadoDistrito = seleccionDistrito.value;
    cargarSecciones(datosFiltros, seleccionadoDistrito);
});

filtrar.addEventListener('click', async () => {
    // Obtener valores de los elementos de selección
    const anioEleccion = seleccionAnio.value;
    const distritoId = seleccionDistrito.value;
    const seccionProvincialId = document.getElementById('hdSeccionProvincial').value; // Obtener el valor del campo oculto

    // Realizar la validación de campos faltantes
    if (!anioEleccion || !distritoId || !seccionProvincialId) {
        alert('Por favor, complete todos los campos obligatorios en amarillo.');
        return;
    } else {
        // Realizar la consulta al servicio con fetch
        const url = 'https://resultados.mininterior.gob.ar/api/resultados/getResultados' +
            `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=2` +
            `&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seleccionSeccion.value}` +
            '&circuitoId=&mesaId=';
    
        try {
            const respuesta = await fetch(url);
    
            if (respuesta.ok) {
                const datosRespuesta = await respuesta.json();
                console.log(datosRespuesta);
            } else {
                alert('Error en la consulta. Detalle del error: '); //FALTA DETALLE EN AMARILLO
            }
        } catch (error) {
            alert('Error en la consulta. Detalle del error: '); //FALTA DETALLE EN ROJO
        }
    }
});