

// para probar el local storage con lo de ultima compra necesita resetear el Local Storage

// declaracion de variables mas importantes
const seccionProductos = document.getElementById(`seccion-productos`)
const confirmoCompra = document.getElementById("confirmo-compra")
const mostradorCarrito = document.getElementById("lista-carrito");
let ultimaCompraLista = document.getElementById("ultima-compra-list")
const cards = document.querySelectorAll(`.card`)
let mensajeExito = document.createElement("span")
let autoEncontrado;
let botonesEliminar;
let total = document.getElementById("total")
// declaracion de addeventlistener y de funciones
confirmoCompra.addEventListener(`click`, guardarenLS)

function ultimaCompra() {
    let traerCarrito = localStorage.getItem("carrito")
    let tuUltimaCompra = JSON.parse(traerCarrito)
    if (tuUltimaCompra) {
        mostrarultimaCompra(tuUltimaCompra)
    }
}
const mostrarultimaCompra = (datos) => {
    ultimaCompraLista.innerHTML = ``
    datos.forEach((auto) => {
        const ultimaCompraCard = document.createElement("div");
        ultimaCompraCard.classList.add("ultima-compra-card")
        ultimaCompraCard.innerHTML = `
    <img src="${auto.imagen}" alt="">
            <p>
                Cantidad: <span>${auto.cantidad}</span> <br>
                Marca: <span>${auto.marca}</span> <br>
                Modelo: <span>${auto.modelo}</span> <br>
                Trasmision: <span>${auto.trasmision}</span> <br>
                Precio por esta compra: <span>${auto.precio * auto.cantidad * 1.21}</span> $
            </p>`;
        ultimaCompraLista.appendChild(ultimaCompraCard)
    })
}
ultimaCompra()

let carritodelLS;
let carrito = []
let stock = []
// usamos fetch (para manejo de promesas, espero que esto cuente como promesa no estoy seguro la verdad jajaja 
// y lo usamos para mostrar el stock en pagina y crear el array stock para operar con el, a partir del proddata.json con datos de cada uno
fetch('./proddata.json')
    .then((res) => res.json())
    .then((datos) => {
        datos.forEach(auto => {
            const cardAuto = document.createElement(`li`);
            cardAuto.setAttribute(`id`, `tarjeta-auto`);
            cardAuto.innerHTML = `
          <img src="${auto.imagen}"
        alt="">
    <div class="card-body">
        <h4>${auto.marca} ${auto.modelo}</h4>
        <p>Modelo de trasmision ${auto.trasmision} <br>el precio por unidad es de : <span> ${auto.precio} </span> USD</p>
        <p>STOCK: ${auto.stock} </p>
        <button class="btn-comprar" id="${auto.id}">COMPRAR</button>
    </div>`;
            seccionProductos.appendChild(cardAuto);
            stock.push(auto)

        });
        const btnComprar = document.querySelectorAll(`.btn-comprar`);
        btnComprar.forEach(este => {
            este.addEventListener(`click`, (e) => { agregarAutoCarrito(e.currentTarget.id) })
        })

    })
    // si comenta o escribe o cambia algo en el json, este error se activa
    .catch((error) => {
        error = Swal.fire({
            title: 'Error en base de datos',
            text: 'Imposible cargar correctamente la pagina, la base de datos no se encuentra disponible!',
            icon: 'error',
            confirmButtonText: 'OK!',
        })
    })

function agregarAutoCarrito(id) {
    mensajeExito.innerText = ``
    const yaHay = carrito.some(hay => hay.id === parseInt(id))
    autoEncontrado = stock.find(prod => prod.id === parseInt(id));
    if (yaHay) {
        if (autoEncontrado.cantidad < autoEncontrado.stock)
            //    operador ++ sugar syntax!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            autoEncontrado.cantidad++;
        agregarTarjetita()
        ActualizarBotonesEliminar()
    } else {
        carrito.push(autoEncontrado);
        agregarTarjetita()
        ActualizarBotonesEliminar()
    }
    precioTotal()
}

function agregarTarjetita() {
    let tarjetaNueva = document.createElement("div");
    tarjetaNueva.classList.add("card");
    tarjetaNueva.id = `card-${autoEncontrado.id}`;
    tarjetaNueva.innerHTML = `
    <div class="card-body">
    <h4>${autoEncontrado.marca} ${autoEncontrado.modelo}</h4>
    <p>Modelo de lujo <br>el precio por unidad es de : <span> ${autoEncontrado.precio} </span> USD</p>
    <p>el precio con iva es de <span> ${autoEncontrado.precio * 1.21}</span> USD</p>
    <p>compraste un total de <span>${autoEncontrado.cantidad}</span> autos de este modelo</p>
    <p>el total a pagar por todos los autos de este modelo sera de <span> ${autoEncontrado.precio * 1.21 * autoEncontrado.cantidad}</span> USD</p>
    <button class="btn-eliminar" id="tarjeta-${autoEncontrado.id}">Eliminar Compra</button>
    </div>
      `;
    let yahaytarjeta = document.getElementById(`card-${autoEncontrado.id}`)
    // usamos operador ternario
    yahaytarjeta ? ActualizarTarjetita() : mostradorCarrito.append(tarjetaNueva)
}

const eliminar = (nombre) => {
    let index = carrito.indexOf(nombre)
    if (index != -1) {
        carrito.splice(index, 1)
    }
}

function ActualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(`.btn-eliminar`);
    botonesEliminar.forEach(boton => {
        boton.addEventListener(`click`, Borrarcompra)
    })
}

function Borrarcompra(e) {
    let idBoton = e.currentTarget.id
    let estaTarjeta = document.getElementById(`${idBoton}`)
    estaTarjeta.parentElement.parentElement.remove()
    idBoton = e.currentTarget.id.substring(8)
    let esteAuto = carrito.find((car) => car.id === parseInt(idBoton))
    eliminar(esteAuto)
    precioTotal()
    Swal.fire({
        title: 'Compra Eliminada',
        text: 'Tu auto ha sido eliminado del carrito!',
        icon: 'error',
        confirmButtonText: 'OK!',
    })
}

function precioTotal() {
    let preciototal = carrito.reduce((preciofinal, preciomodelos) => preciofinal + preciomodelos.precio * preciomodelos.cantidad * 1.21, 0)
    total.innerText = `${preciototal}`
}
// funcion con Local Storage y JSON
function guardarenLS() {
    if (carrito.length >= 1) {
        let carritoenLS = JSON.stringify(carrito)
        localStorage.setItem("carrito", carritoenLS)
        carritodelLS = JSON.parse(carritoenLS)
        carrito = []
        mostradorCarrito.innerHTML = ``
        precioTotal()
        // sweet alert de libreria implementado
        Swal.fire({
            title: 'Compra Exitosa',
            text: 'Podras ver tu ultima compra arriba del todo, o la siguinte vez que entres a este sitio!',
            icon: 'success',
            confirmButtonText: 'Perfecto!',
        })
    }
    ultimaCompra()
}

function ActualizarTarjetita() {
    let yahaytarjeta = document.getElementById(`card-${autoEncontrado.id}`)
    yahaytarjeta.innerHTML = `
    <div class="card-body">
    <h4>${autoEncontrado.marca} ${autoEncontrado.modelo}</h4>
    <p>Modelo de lujo <br>el precio por unidad es de : <span> ${autoEncontrado.precio} </span> USD</p>
    <p>el precio con iva es de <span> ${autoEncontrado.precio * 1.21}</span> USD</p>
    <p>compraste un total de <span>${autoEncontrado.cantidad}</span> autos de este modelo</p>
    <p>el total a pagar por todos los autos de este modelo sera de <span> ${autoEncontrado.precio * 1.21 * autoEncontrado.cantidad}</span> USD</p>
    <button class="btn-eliminar" id="tarjeta-${autoEncontrado.id}">Eliminar Compra</button>
    </div>
    `;
}