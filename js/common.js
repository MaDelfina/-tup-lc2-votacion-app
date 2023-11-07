var datosFiltros = []

async function consultaAnio() {
    const url = 'https://resultados.mininterior.gob.ar/api/menu/periodos'
    const respuesta = await fetch(url);
    if (respuesta.ok) {
        const data = await respuesta.json(); //almacenar y transportar información
        console.log(data);
        return data
    } else {
        throw new Error('Error al obtener los datos del servidor');
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
            alert(error.message);
        });
};

async function consultarCargo() {
    const respuesta = await fetch('https://resultados.mininterior.gob.ar/api/menu?año=' + seleccionAnio.value);
    if (respuesta.ok) {
        datosFiltros = await respuesta.json();
        return datosFiltros
    } else {
        throw new Error('Error al obtener los datos del servidor');
    }
}
