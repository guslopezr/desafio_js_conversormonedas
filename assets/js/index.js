//declaración de variables

const clp = document.getElementById("pesoschilenos");
const urlAPI = "https://mindicador.cl/api";
const dolar = "https://mindicador.cl/api/dolar";
const euro = "https://mindicador.cl/api/euro";
const resultado = document.getElementById("valorconvertido");
const tabla = document.getElementById("lista-usuario");
const moneda = document.getElementById("moneda");

const chartDOM = document.getElementById("myChart2").getContext("2d");

//Request a la API

async function getMonedas(url) {
    const endpoint = urlAPI;
    try {
        const res = await fetch(endpoint);
        const monedas = await res.json();
        return monedas;
    } catch (e) {
        alert(e.message);
    }

    console.log(endpoint);
}

/*
 ****************************************************************************************
 */
async function convertir() {
    if (clp.value == "") alert("Ingrese un monto válido");
    else {
        try {
            const divisas = await getMonedas(urlAPI);

            if (moneda.value == "dolar") {
                resultado.innerHTML = `Resultado: ${new Intl.NumberFormat("de-DE", {style: "currency", currency: "USD",}).format((clp.value / divisas.dolar.valor).toFixed(2))}`;
                renderGrafica();
            } else {
                resultado.innerHTML = `Resultado: ${new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR",}).format((clp.value / divisas.euro.valor).toFixed(2))}`;
                renderGrafica();
            }
        } catch (err) {
            alert("Algo no funciona. Intenta la consulta nuevamente");
            console.log(err.message);
        }
    }
}


//************************************************************************************************************* */
async function cargarDatos(moneda) {
    const tipoDeGrafica = "line";
    const titulo = "Historico " + moneda.value.toUpperCase();
    const colorDeLinea = "#" + randomHex(6) + "";

    const divisas = await getMonedas(urlAPI + "/" + moneda.value);

    const fechas = divisas.serie.map((elemento) => { return elemento.fecha; });
    const etiquetas = divisas.serie.map((etiq) => { return etiq.valor; });

    const config = {
        type: tipoDeGrafica,
        data: {
            labels: fechas.reverse().slice(-10),
            datasets: [{ //Aqui cada objeto representa un indicador que sera visualizado en la grafica
                label: titulo,
                borderColor: "#" + randomHex(6) + "",
                backgroundColor: colorDeLinea,
                data: etiquetas.reverse().slice(-10),
            }, ],
        },
    };

    //REfrescar el grafico

    if (window.chartDOM) {
        window.chartDOM.clear();
        window.chartDOM.destroy();
    }
    window.chartDOM = new Chart(chartDOM, config);
}

async function renderGrafica() {
    await cargarDatos(moneda);
}

moneda.addEventListener("change", function() {
    this.options[moneda.selectedIndex];
});

function valideKey(evt) {
    // code is the decimal ASCII representation of the pressed key.
    var code = evt.which ? evt.which : evt.keyCode;

    if (code == 8) {
        // backspace.
        return true;
    } else if (code >= 48 && code <= 57) {
        // is a number.
        return true;
    } else {
        // other keys.
        return false;
    }
}

//GEnerar los colores de lineas aleatoriamente en cada busqueda
randomHex = length => ('0'.repeat(length) + Math.floor((Math.random() * 16 ** length)).toString(16)).slice(-length);