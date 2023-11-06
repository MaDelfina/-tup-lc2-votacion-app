const tipoEleccion = 2;
const tipoRecuento = 1;

let seleccionAnio = document.getElementById('seleccionAnio'); //select del año
let seleccionCargo = document.getElementById('seleccionCargo'); //select del cargo
let seleccionDistrito = document.getElementById('seleccionDistrito'); //select del distrito
let seleccionSeccion = document.getElementById('seleccionSeccion'); //select de seccion
let filtrar = document.getElementById('filtrar'); //boton filtrar
let datosFiltros = []; //Inicializa datosFiltros como un arreglo vacío

async function consultaAnio() {
    if (seleccionAnio.value === "") {
        alert('No seleccionó ningún año.');
        return false;
    } else {
        const url = 'https://resultados.mininterior.gob.ar/api/menu/periodos';
        try {
            const respuesta = await fetch(url);

            if (respuesta.ok) {
                const data = await respuesta.json(); //almacenar y transportar información
                console.log(data);
               
                //se llena el combo del año recorriendo la respuesta del json
                data.forEach(anio => {
                    const option = document.createElement("option");
                    option.value = anio; //valor del combo
                    option.textContent = anio.toString(); //Convertir a cadena para que el texto se pueda ver en el combo
                    seleccionAnio.appendChild(option); //Se agregan las opciones en el select
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
        try {
            const respuesta = fetch('https://resultados.mininterior.gob.ar/api/menu?año=' + seleccionAnio.value);
    
            if (respuesta.ok) {
                datosFiltros = await respuesta.json();
                console.log(datosFiltros);

                seleccionCargo.innerHTML = ''; //borra todas las opciones existentes dentro del elemento <select> con el id seleccionCargo
    
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

function consultarDistrito() {
    const cargoSeleccionado = seleccionCargo.value; // Obtener el valor seleccionado en el combo de cargo
    if (cargoSeleccionado === "") {
        alert('No seleccionó ningún cargo.');
        return false;
    } else {
        /*datosFiltros.forEach((eleccion) => { ... }): Este es un bucle forEach que itera a través de los elementos en el arreglo datosFiltros. Cada elemento se refiere a un objeto que representa una elección. */
        datosFiltros.forEach((eleccion) => {
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
}

function consultarSeccion() {
    datosFiltros.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion)//se verifica si el IdEleccion del objeto eleccion coincide con el valor almacenado en la variable tipoEleccion. Esto se utiliza para filtrar las elecciones que coinciden con el tipo de elección deseado
         {
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

/*consultaAnio():Esta función utiliza async/await para realizar una solicitud HTTP para obtener los años disponibles y llenar un combo. Esto es apropiado porque implica una operación asincrónica.
consultaCargo():

Utiliza async/await para realizar una solicitud HTTP y obtener los datos relacionados con los cargos disponibles. Esto también es adecuado debido a la operación asincrónica involucrada.
consultarDistrito():

Esta función realiza operaciones de filtrado local en función de la selección del usuario en el combo de cargo. No implica operaciones asincrónicas ni llamadas a la red, por lo que no es necesario utilizar async/await.
consultarSeccion():

Similar a consultarDistrito, esta función realiza operaciones de filtrado local en función de las selecciones del usuario en los combos de cargo y distrito, por lo que no requiere async/await.*/