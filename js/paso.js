const tipoEleccion = 1;
const tipoRecuento = 1;
const circuitoId = ""; //tiene que estan asi por defecto
const mesaId = ""; //tiene que estan asi por defecto

let seleccionAnio = document.getElementById('seleccionAnio'); //select del año
let seleccionCargo = document.getElementById('seleccionCargo'); //select del cargo
let seleccionDistrito = document.getElementById('seleccionDistrito'); //select del distrito
let seleccionSeccion = document.getElementById('seleccionSeccion'); //select de seccion
let añoElegido;
let cargoElegido;
let categoriaId;
let distritoElegido;
let idDistritoElegido;
let valorOculto;
let idSeccionElegida;
let seccionElegida;
let dataFiltrar;
let subtituloPaso = document.getElementById('subtitulo');
let informes = document.getElementById("boton-informe") //botón de informes
let tituloPaso = document.getElementById('titulo');

//COMBOS
seleccionAnio.onchange = function () {
    if (seleccionAnio.value !== 'año') { //llama a la función borrar datos
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
    añoElegido = seleccionAnio.value;
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
        categoriaId = seleccionCargo.value;
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
        idDistritoElegido = seleccionDistrito.value
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
                            distrito.SeccionesProvinciales.forEach((seccionProvincial) => {
                                valorOculto = seccionProvincial.IDSeccionProvincial;
                                document.getElementById("hdSeccionProvincial").value = valorOculto;
                                if (valorOculto == seccionProvincial.IDSeccionProvincial) {
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
    console.log("id de la sección: " + idSeccionElegida)
    console.log("sección elegida:" + seccionElegida)
}

//BOTON FILTRAR
let seccionProvincialId

filtrar.onclick = async function () {
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
        mensajeAmarilloTitulo.style.display = "none"
        mensajeAmarillo.style.display = "block";
        textoAmarillo.innerText = `Por favor complete los campos: ${camposFaltantes.join(',')}.`; //${} permite agregar variables -- camposFaltantes.join(,) va a mostrar los componentes de la variable array separados por una coma
        sectionContenido.style.display = "none";
        tituloPaso.style.display = "none";
        subtituloPaso.style.display = "none";
        mostrarTitulo();
        fijarFooter();

    } else {
        footer.style.position = "relative";
        mensajeAmarillo.style.display = "none";
        tituloInicio.style.display = "none";
        tituloPaso.style.display = "block";
        subtituloPaso.style.display = "block";
        seccionProvincialId = "" //lo vacío antes hice un if para tomar el valor del id de sección provincial cuando no fuera "null", pero cuando le pase como parametro un número y no vació me devolvía todo 0 asi que va siempre ""

        console.log("año eleccion:" + añoElegido + "distrito id:" + idDistritoElegido + "seccion id:" + idSeccionElegida + "seccion provincial id:" + seccionProvincialId + "id cargo" + categoriaId)

        fetch(`https://elecciones-lc2.bruselario.com/api/resultados/getResultados/?anioEleccion=${añoElegido}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${idDistritoElegido}&seccionProvincialId=${seccionProvincialId}&seccionId=${idSeccionElegida}&circuitoId=${circuitoId}&mesaId=${mesaId}`)

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
                sectionContenido.style.display = "block";
                tituloPaso.innerHTML = `Elecciones ${añoElegido} | Paso`;
                subtituloPaso.innerHTML = `${añoElegido} > Paso > ${cargoElegido} > ${distritoElegido} > ${seccionElegida}`;

                informes.addEventListener("mouseover", function () { //función para que el cursor cambie al pasar por el botón filtrar. 
                    informes.style.cursor = "pointer";
                });

                let mesasEscrutadas = document.getElementById("porcentaje-mesas-escrutadas");
                let electores = document.getElementById("porcentaje-electores");
                let participacionEscrutado = document.getElementById("porcentaje-part-escrutado");
                let distrito = document.getElementById("titulo-provincias");
                let svgDistrito = document.getElementById("svg-provincias");

                if (dataFiltrar.estadoRecuento.mesasTotalizadas === 0) { //no hay datos en la consulta, mostrar mensaje amarillo
                    mensajeAmarilloTitulo.style.display = "block";
                    mensajeAmarilloTitulo.style.margin = "40px 40%"
                    sectionContenido.style.display = "none";
                    fijarFooter()
                    return

                } else {
                    mesasEscrutadas.innerHTML = dataFiltrar.estadoRecuento.mesasTotalizadas;
                    electores.innerHTML = dataFiltrar.estadoRecuento.cantidadElectores;
                    participacionEscrutado.innerHTML = dataFiltrar.estadoRecuento.participacionPorcentaje + "%";

                    //PRIMER RECUADRO

                    //ordeno los partidos que me devuelve el json de mas votados a menos votados
                    //sort es una función que se encarga de eso, a y b, luego vemos con chat como funciona bien, es facil. 
                    dataFiltrar.valoresTotalizadosPositivos.sort((partidoA, partidoB) => partidoB.votos - partidoA.votos);

                    //cambio los id de los partidos del jason por numeros del 1 a n (cantidad de partidos que devuelva la api en la consulta)
                    for (let i = 0; i < dataFiltrar.valoresTotalizadosPositivos.length; i++) { //valoresTotalizadosPositivos.lenght me devuelve la cantiadad de elementos contenidos en el array, por ende la cantidad de partidos. 
                        dataFiltrar.valoresTotalizadosPositivos[i].idAgrupacion = (i + 1).toString(); //accedo a cada posición del array y a cada valor de id agrupación y reemplazo el valor del id por número del 1 a la cantidad de elementos que contenga. 
                    }
                    console.log(dataFiltrar);

                    let contenedorPrincipal = document.getElementById("recuadro-agrupaciones");
                    contenedorPrincipal.innerHTML = "";
                    // Crear y agregar los divs dinámicamente
                    dataFiltrar.valoresTotalizadosPositivos.forEach(agrupacion => {
                        // Crear un nuevo div para cada agrupación
                        let recuadroDiv = document.createElement('div');
                        recuadroDiv.classList.add('recuadro1');
                        let colores = coloresAgrupaciones[agrupacion.idAgrupacion];
                        // Crear el contenido dinámicamente
                        recuadroDiv.innerHTML = `
                            <div class="titulo-agrupaciones">
                                <p id="nombre-partido">${agrupacion.nombreAgrupacion}</p>
                            </div>
                            <hr>
                            <div class="listas">
                                ${agrupacion.listas.map(lista => {
                            let porcentajeLista = ((parseFloat(lista.votos) !== 0 ? (parseFloat(lista.votos) * 100) / parseFloat(agrupacion.votos) : 0).toFixed(2));
                            return `
                                        <div class="listas-data">
                                            <div class="nombre-agrupaciones">
                                                <p>${lista.nombre}</p>
                                            </div>  
                                            <div class="texto-agrupaciones">
                                                <p>${porcentajeLista}%</p>
                                                <p>${lista.votos} votos </p>
                                            </div>
                                        </div>
                                        <div class="progress" style="background:${colores.colorPleno};">
                                            <div class="progress-bar" style="width:${porcentajeLista}%; background:${colores.colorLiviano};">
                                                <span class="progress-bar-text">${porcentajeLista}%</span>
                                            </div>
                                        </div>
                                    `;
                        }).join('')}
                            </div>
                        `;

                        // Agregar el nuevo div al contenedor principal
                        contenedorPrincipal.appendChild(recuadroDiv);
                    });

                    //SEGUNDO RECUADRO
                    distrito.innerHTML = distritoElegido;
                    svgDistrito.innerHTML = mapas[distritoElegido];

                    //TERCER RECUADR
                    let primeros7Partidos = dataFiltrar.valoresTotalizadosPositivos.slice(0, 7); //se está creando una nueva array que consiste en los elementos desde el índice 0 hasta el índice 6 (inclusive) del array original.

                    // Obtén el contenedor principal donde agregarás los elementos dinámicos
                    let contenedorGrid = document.getElementById("grid");
                    contenedorGrid.innerHTML="";
                    
                    primeros7Partidos.forEach((partido, index) => {
                        // Crea el elemento div con la clase "bar"
                        let barDiv = document.createElement('div');
                        barDiv.classList.add('bar');

                        // Establece los estilos y atributos dinámicamente
                        barDiv.style.setProperty('--bar-value', `${partido.votosPorcentaje}%`); //setProperty es un método que te permite establecer el valor de una propiedad CSS
                        barDiv.style.setProperty('--bar-color', `${coloresAgrupaciones[partido.idAgrupacion].colorLiviano}`);
                        barDiv.dataset.name = `Partido ${index + 1}`
                        barDiv.title = `${partido.nombreAgrupacion} ${partido.votosPorcentaje}%`;

                        // Agrega el nuevo div al contenedor principal
                        contenedorGrid.appendChild(barDiv);
                    });
                }
            })
            .catch(error => {
                tituloPaso.innerHTML = `Elecciones ${añoElegido} | Paso`;
                subtituloPaso.innerHTML = `${añoElegido} > Paso > ${cargoElegido} > ${distritoElegido} > ${seccionElegida}`;
                mensajeRojoTitulo.style.display = "block";
                textoRojoTitulo.innerHTML = error.message
                mensajeRojoTitulo.style.margin = "40px 40%";
                fijarFooter()
            });
    }
}

//BOTON INFORMES
informes.onclick = function () {
    let valorAño = añoElegido.toString();
    let valorTipoRecuento = tipoRecuento.toString();
    let valorTipoEleccion = tipoEleccion.toString();
    let valorCategoriaId = categoriaId.toString();
    let valorDistritoId = idDistritoElegido.toString();
    let valorSeccionProvincialId = '';
    let valorSeccionId = idSeccionElegida.toString();
    let valorCircuitoId = circuitoId;
    let valorMesaId = mesaId;
    let arrayDatosString = localStorage.getItem('INFORMES'); //Se obtiene la cadena almacenada en el LocalStorage bajo la clave 'INFORMES'
    let arrayDatos = arrayDatosString ? arrayDatosString.split(',') : []; //Se verifica si la cadena arrayDatosString tiene algún valor, si tiene un valor, se divide la cadena en un array utilizando la coma como separador, si no tiene valor, se asigna un array vacío.
    //verifica si son null y tira el cartel de error
    if (valorAño == null || valorTipoRecuento == null || valorTipoEleccion == null ||
        valorCategoriaId == null || valorDistritoId == null || valorSeccionProvincialId == null ||
        valorSeccionId == null || valorCircuitoId == null || valorMesaId == null) {
        mensajeRojo.style.display = 'block';
        textoRojo.innerHTML = 'Hubo un error al almacenar los datos.';
    } else {
        let nuevoRegistro = [
            valorAño, valorTipoRecuento, valorTipoEleccion, valorCategoriaId,
            valorDistritoId, valorSeccionProvincialId, valorSeccionId,
            valorCircuitoId, valorMesaId, cargoElegido, distritoElegido, seccionElegida
        ].join('|'); //separa los valores como decia en el tp con |

        //verificar si ya esta incluida
        if (arrayDatos.includes(nuevoRegistro)) {
            mensajeAmarillo.style.display = 'block';
            textoAmarillo.innerHTML = 'La información ya se encuentra agregada al informe. Por favor, seleccione nueva información.';
            mensajeVerde.style.display = 'none';
        } else {
            // Agrega nuevoRegistro al arrayDatos y actualizar localStorage
            arrayDatos.push(nuevoRegistro);
            arrayDatosString = arrayDatos.join(',');
            localStorage.setItem('INFORMES', arrayDatosString); //almacena la informacion
            mensajeVerde.style.display = 'block';
            textoVerde.innerHTML = 'La operación fue exitosa. Consulta agregada al informe.';
        }
    }
}  