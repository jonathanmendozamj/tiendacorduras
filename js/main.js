/* CLASES */
class Producto{
    constructor(pIdProducto, pNombre, pPrecio, pCategoria, pFoto){
        this.idProducto = pIdProducto;
        this.nombre = pNombre;
        this.precio = pPrecio;
        this.foto = pFoto;
        this.categoria = pCategoria;
    }

    mostrarDetalle() { 
        return this.nombre + " ($ " + this.precio + ")";
    }

    armarCard() {
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
        if(Array.isArray(pArrayProductos)){
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

            for(const [index, producto] of this.arrayProductos.entries()){
                $("#listaProductos").append(`<li class="list-group-item small"><a class="navbar-cart-product-close" href="#" id="itemCarrito${ index }"><i class="bi bi-x"></i></a> ${ producto.mostrarDetalle() }</li>`);
            
                $(`#itemCarrito${ index }`).click(function(){
                    console.log("Entro al click de " + index);

                    eliminarProducto(index);
                });
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
        let buttonConfirmarPedido = $("#buttonConfirmarPedido");

        let display = '';

        if(cantidadArticulos > 0){
            display = 'inline-block';
            spanCantidadArticulos.html(cantidadArticulos);
        }
        else{
            display = 'none';
        }

        spanCantidadArticulos.css('display', display);
        buttonConfirmarPedido.css('display', display);

    }

    mostrarCambiosEnDOM(){
        this.mostrarTotal();
        this.mostrarCantidadArticulos();
        this.mostrarCarrito();
    }
    
}
/* FIN CLASES */

//Muestro los productos disponibles
function mostrarProductosDisponibles(pArrayProductos){

    $("#contenedorProductos").empty();

    if(Array.isArray(pArrayProductos) && pArrayProductos.length > 0){
        for(let producto of pArrayProductos){
            $("#contenedorProductos").append(`<div class="col-md-4">
                                                    ${ producto.armarCard() }
                                                </div>`);
        }
    }
    else{
        console.log("Array de productos vacío o array inválido");
    }
}

//Obtengo los productos que tengo disponibles desde el archivo de texto JSON
function obtenerProductosDisponibles(pArrayProductos){

    const URLLOCAL = 'data/productos.json';

    $.getJSON(URLLOCAL, function(respuesta){
        console.log(respuesta);

        if(Array.isArray(respuesta) && respuesta.length > 0){
            for(const item of respuesta){
                let nuevoProducto = new Producto(item.idProducto, item.nombre, item.precio, item.categoria, item.foto);

                pArrayProductos.push(nuevoProducto);
            }

            mostrarProductosDisponibles(pArrayProductos);
        }
        else{
            console.log("Array de productos vacío o array inválido");
        }

        console.log(pArrayProductos);
    });
}

//Función que elimina un producto del carrito
function eliminarProducto(indiceProducto){
    console.log("El indice pasado es " + indiceProducto);

    var productoEliminado = carritoActual.arrayProductos.splice(indiceProducto, 1);
    console.log(productoEliminado);

    carritoActual.mostrarCambiosEnDOM();
    guardarCarritoLocalStorage();
}

//Funcion que agrega los productos al carrito
function agregarProductoAlCarrito(e){
    console.log(e.target);

    const productoEncontrado = arrayProductosDisponibles.find(producto => {
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
        $("#divMensajeModal").fadeOut(2000);
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
    let provincia = $('#selectProvincias').val();
    let domicilio = $('#inputDomicilio').val();
    let telefono = $('#inputTelefono').val();
    let mail = $('#inputMail').val();

    let mensaje = '';

    console.log(nombre, apellido, dni, provincia, domicilio, telefono, mail);

    if(nombre != '' && apellido != ''
        && dni != '' && domicilio != ''
        && provincia != ''
        && telefono != '' && mail != ''){

        if(isNaN(dni)){
            mostrarMensaje("Ingrese un DNI numérico.");

            return;
        }

        let nuevoCliente = new Cliente(nombre, apellido, dni, provincia, telefono, mail);
        nuevoCliente.agregarCarrito(carritoActual.arrayProductos);

        localStorage.removeItem('carrito');
        carritoActual.vaciarCarrito();

        formulario.reset();
        $('.cerrarModal').trigger('click');

        mensaje = "Pedido cargado de forma correcta. Se pondrán en contacto para coordinar entrega.";
    }
    else{
        mensaje = "Por favor, complete campos faltantes.";
    }

    mostrarMensaje(mensaje);
}

function guardarCarritoLocalStorage(){
    const carritoEnJSON = JSON.stringify(carritoActual.arrayProductos);
    localStorage.setItem("carrito", carritoEnJSON);
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
    obtenerProductosDisponibles(arrayProductosDisponibles);
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

    $("#buttonConfirmarPedido").click(function(){
        mostrarMensajeConfirmacion();
    });

    $('#buttonEnviarFormulario').click(function(){
        $('#formEnviar').trigger('submit');
    });

    $('#formEnviar').submit(function(e){
        enviarFormulario(e);
    });

    $('#buttonLimpiarBusqueda').click(function(){
        console.log("Entro al evento click de buttonLimpiarBusqueda");

        $('#inputBuscarProducto').val('');

        mostrarProductosDisponibles(arrayProductosDisponibles);
    });

    $('.categoria-productos').click(function(e){
        console.log(e.target.id);

        let arrayProductosFiltrado = arrayProductosDisponibles.filter(function(producto){
            return (producto.categoria === e.target.id) || (e.target.id === 'todas');
        });

        console.log(arrayProductosFiltrado);

        mostrarProductosDisponibles(arrayProductosFiltrado);
    });

    //Filtra por palabra
    $('#inputBuscarProducto').on('input', function(e){
        console.log("Entro al evento change de inputBuscarProducto");
        console.log(e.target.value);

        let palabraBuscada = e.target.value;

        let arrayProductosFiltrado = arrayProductosDisponibles.filter(function(producto) {
            return producto.nombre.toLowerCase().indexOf(palabraBuscada.toLowerCase()) > -1;
        });

        console.log(arrayProductosFiltrado);

        mostrarProductosDisponibles(arrayProductosFiltrado);
    });
}

//Variables globales que utilizo
var arrayProductosDisponibles = [];
var carritoActual = new Carrito();

$(document).ready(function(){
    cargarCarrito();
    inicializarEventos();
});

$(window).on('beforeunload', function(){
    guardarCarritoLocalStorage();
});