/* CLASES */
class Producto{
    constructor(pIdProducto, pNombre, pPrecio, pCategoria, pFoto){
        this.idProducto = pIdProducto;
        this.nombre = pNombre;
        this.precio = pPrecio;
        this.foto = pFoto;
        this.categoria = pCategoria;
    }

    mostrarDetalle = function() { 
        return this.nombre + " ($ " + this.precio + ")";
    }

    armarCard = function() {
        return `<section class="card">
                    <img src="${ this.foto }" class="card-img-top img-fluid" alt="${ this.nombre }">
                    <div class="card-body">
                        <h5 class="card-title" style="text-align: left;"> ${ this.nombre }</h5>
                        <p  class="card-text"> $ ${ this.precio }</p>
                        <button id="${ this.idProducto }" class="btn btn-danger card-add" >Agregar</button>
                    </div>
                </section>`;       
    }
}

class Cliente{
    constructor(pNombre, pApellido, pDNI, pIdProvincia, pTelefono, pMail){
        this.nombre = pNombre;
        this.apellido = pApellido;
        this.dni = pDNI;
        this.idProvincia = pIdProvincia;
        this.telefono = pTelefono;
        this.mail = pMail;
        this.carrito = [];
    }

    agregarCarrito(pArrayProductos){
        this.carrito = pArrayProductos;
    }
}

class Carrito{
    constructor(){
        this.arrayProductos = [];
    }

    agregarProducto(pProducto) {
        this.arrayProductos.push(pProducto);
    }

    guardarProductos(pArrayProductos) {
        if(Array.isArray(arrayProductos)){
            for(let producto of pArrayProductos){
                this.arrayProductos.push(producto);
            }
        }
        else{
            console.log("La variable pasada no es un array.");
        }
    }

    obtenerTotal(){
        let total = 0;
        this.arrayProductos.map(producto => total = total + producto.precio);

        return total;
    }

    mostrarCarrito(){
        let display = '';

        $("#listaProductos").empty();

        if(this.arrayProductos.length > 0){
            display = 'block';

            for(const producto of this.arrayProductos){
                $("#listaProductos").append(`<li class="list-group-item">${ producto.mostrarDetalle() }</li>`);
            }

        }
        else{
            display = 'none';
        }

        $("#divCardProductosCarrito").css('display', display);
    }

    vaciarCarrito(){
        this.arrayProductos = [];
        this.mostrarCambiosEnDOM();
    }

    mostrarTotal(){
        $('#divTotal').html(`$ ${ this.obtenerTotal() }`);
    }

    obtenerCantidadArticulos(){
        return this.arrayProductos.length;
    }

    mostrarCantidadArticulos(){
        let cantidadArticulos = this.obtenerCantidadArticulos();
        let spanCantidadArticulos = $("#spanCantidadArticulos");
        let buttonRealizarCompra = $("#buttonRealizarCompra");

        let display = '';

        if(cantidadArticulos > 0){
            display = 'inline-block';
            spanCantidadArticulos.html(cantidadArticulos);
        }
        else{
            display = 'none';
        }

        spanCantidadArticulos.css('display', display);
        buttonRealizarCompra.css('display', display);

    }

    mostrarCambiosEnDOM(){
        this.mostrarTotal();
        this.mostrarCantidadArticulos();
        this.mostrarCarrito();
    }
    
}
/* FIN CLASES */

//Muestra los productos que tengo disponibles
function mostrarProductosDisponibles(pArrayProductos){

    const URLLOCAL = 'data/productos.json';

    $.getJSON(URLLOCAL, function(respuesta){
        console.log(respuesta);

        if(Array.isArray(respuesta) && respuesta.length > 0){
            for(const item of respuesta){
                let nuevoProducto = new Producto(item.idProducto, item.nombre, item.precio, item.categoria, item.foto);

                pArrayProductos.push(nuevoProducto);

                $("#contenedorProductos").append(`<div class="col-md-4">
                                                ${ nuevoProducto.armarCard() }
                                            </div>`);
            }
        }
        else{
            console.log("Array de productos vacío");
        }

        console.log(pArrayProductos);
    });
}

//Funcion que agrega los productos al carrito
function agregarProductoAlCarrito(e){
    console.log(e.target);

    const productoEncontrado = arrayProductos.find(producto => {
        return producto.idProducto == e.target.id;
    });

    let mensaje = '';

    if(productoEncontrado !== undefined){
        carritoActual.agregarProducto(productoEncontrado);
        mensaje = "Se agregó " + productoEncontrado.nombre + " al carrito.";

        carritoActual.mostrarCambiosEnDOM();
    }
    else{
        mensaje = "Hubo un problema al agregar el producto al carrito.";
    }

    console.log(mensaje);
    mostrarMensaje(mensaje);
}

function mostrarProvincias(){
    const URL = "https://apis.datos.gob.ar/georef/api/provincias";

    $.get(URL, function (respuesta, estado){
        console.log(respuesta);
        console.log(estado);

        let listaProvincias = respuesta.provincias;

        if(Array.isArray(listaProvincias) && listaProvincias.length > 0){

            listaProvincias.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                  return 1;
                }

                if (a.nombre < b.nombre) {
                  return -1;
                }
                return 0;
            });

            for(const provincia of listaProvincias){
                let optionProvincia = `<option value=${ provincia.id }>${ provincia.nombre }</option>`;

                $('#selectProvincias').append(optionProvincia);
            }
            
        }
    });
}

function mostrarMensaje(mensaje){
    //Agregada transicion para aparecer
    $("#divMensajeModal").fadeIn(function(){
        $("#divMensajeModal").fadeOut(1500);
    });

    //Muestro mensaje pasado por parámetro
    $("#parrafoMensajeModal").html(mensaje);
}

function cerrarModal(modal){
    //Oculto el modal
    modal.css("display", "none");
}

function mostrarMensajeConfirmacion(){
    $("#divMensajeConfirmar").fadeIn();

    mostrarProvincias();
}

function enviarFormulario(e){
    e.preventDefault();

    console.log("Entro por aca");

    let formulario = e.target;

    let nombre = $('#inputNombre').val();
    let apellido = $('#inputApellido').val();
    let dni = $('#inputDNI').val();
    let provincia = $('#selectProvincia').val();
    let telefono = $('#inputTelefono').val();
    let mail = $('#inputMail').val();

    let mensaje = '';

    if(nombre != '' && apellido != ''
        && dni != '' && provincia != ''
        && telefono != '' && mail != ''){

        let nuevoCliente = new Cliente(nombre, apellido, dni, provincia, telefono, mail);
        nuevoCliente.agregarCarrito(carritoActual.arrayProductos);

        localStorage.removeItem('carrito');
        carritoActual.vaciarCarrito();

        formulario.reset();
        $('.cerrarModal').trigger('click');

        mensaje = "Envío cargado de forma correcta.";
    }
    else{
        mensaje = "Por favor, complete campos faltantes.";
    }

    mostrarMensaje(mensaje);
}

function guardarCarritoLocalStorage(){
    if(carritoActual.arrayProductos.length > 0){
        const carritoEnJSON = JSON.stringify(carritoActual.arrayProductos);

        localStorage.setItem("carrito", carritoEnJSON);
    }
}

function cargarCarrito(){
    let pArrayProductos = [];

    const arrayObtenidoDelStorage = JSON.parse(localStorage.getItem("carrito"));

    if(Array.isArray(arrayObtenidoDelStorage)){
        console.log(arrayObtenidoDelStorage);
        for(const item of arrayObtenidoDelStorage){
            pArrayProductos.push(new Producto(item.idProducto, item.nombre, item.precio, item.categoria, item.foto));
        }

        carritoActual.guardarProductos(pArrayProductos);
    }
}

function inicializarEventos(){
    //llamo a la funcion principal
    mostrarProductosDisponibles(arrayProductos);
    carritoActual.mostrarCambiosEnDOM();

    $(document).on("click", ".card-add", function(e){
        agregarProductoAlCarrito(e);
    });

    $('#buttonLimpiarCarrito').click(function() {
        localStorage.removeItem('carrito');
        carritoActual.vaciarCarrito();

        mostrarMensaje("Se vació el carrito!");
        carritoActual.mostrarCambiosEnDOM();
    });

    $('.cerrarModal').click(function() {
        cerrarModal($(this).parent().parent().parent().parent());
    });

    $("#buttonRealizarCompra").click(function(){
        mostrarMensajeConfirmacion();
    });

    $('#buttonEnviarFormulario').click(function(){
        $('#formEnviar').trigger('submit');
    });

    $('#formEnviar').submit(function(e){
        enviarFormulario(e);
    });

    $('.categoria-productos').click(function(e){
        console.log(e.target.id);

        let arrayFiltrado = arrayProductos.filter(function(producto){
            return (producto.categoria === e.target.id) || (e.target.id === 'todas');
        });

        console.log(arrayFiltrado);
    });

    //Filtra por palabra
    $('#inputBuscarProducto').on('input', function(e){
        console.log("Entro al evento change de inputBuscarProducto");
        console.log(e.target.value);

        let palabraBuscada = e.target.value;

        let arrayProductosFiltrado = arrayProductos.filter(function(producto) {
            return producto.nombre.toLowerCase().indexOf(palabraBuscada.toLowerCase()) > -1;
        });

        console.log(arrayProductosFiltrado);
    });
}

//Variables globales que utilizo
var arrayProductos = [];
var carritoActual = new Carrito();

$(document).ready(function(){
    cargarCarrito();
    inicializarEventos();
});

$(window).on('beforeunload', function(){
    guardarCarritoLocalStorage();
});