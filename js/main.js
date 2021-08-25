/* CLASES */
class Producto{
    constructor(pIdProducto, pNombre, pPrecio, pFoto){
        this.idProducto = pIdProducto;
        this.nombre = pNombre;
        this.precio = pPrecio;
        this.foto = pFoto;
    }

    mostrarPrecio = function(){
        console.log("El precio es de " + this.precio);
    }

    mostrarDetalle = function() { 
        return this.nombre + " ($ " + this.precio + ")";
    }

    armarCard = function() {
        let seccion = document.createElement("section");
        seccion.classList.add("card");
        seccion.innerHTML = `<img src="${ this.foto }" class="card-img-top img-fluid" alt="${ this.nombre }">
                            <div class="card-body">
                                <h5 class="card-title" style="text-align: left;"> ${ this.nombre }</h5>
                                <p  class="card-text"> $ ${ this.precio }</p>
                                <button class="btn btn-danger card-add" id="${ this.idProducto }">Agregar al carrito</button>
                            </div>`;

        return seccion;        
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
        let divProductosCarrito = document.getElementById("divCardProductosCarrito");

        if(this.arrayProductos.length > 0){
            divProductosCarrito.style.display = 'block';

            let listaProductos = document.getElementById("listaProductos");

            let itemProducto = document.createElement("li");
            itemProducto.classList.add("list-group-item");

            let producto = this.arrayProductos[this.arrayProductos.length - 1];
            itemProducto.innerHTML = producto.mostrarDetalle();

            listaProductos.appendChild(itemProducto);
            
        }
        else{
            divProductosCarrito.style.display = 'none';
        }
    }

    vaciarCarrito(){
        this.arrayProductos = [];

        let listaProductos = document.getElementById("listaProductos");
        listaProductos.innerHTML = '';
    }

    mostrarTotal(){
        let divCardTotal = document.getElementById("divTotal");
        divCardTotal.innerHTML = `$ ${ this.obtenerTotal()}`;
    }

    obtenerCantidadArticulos(){
        return this.arrayProductos.length;
    }

    mostrarCantidadArticulos(){
        let cantidadArticulos = this.obtenerCantidadArticulos();
        let spanCantidadArticulos = document.getElementById("spanCantidadArticulos");

        if(cantidadArticulos > 0){
            spanCantidadArticulos.style.display = 'block';
            spanCantidadArticulos.innerHTML = cantidadArticulos;
        }
        else{
            spanCantidadArticulos.style.display = 'none';
        }
    }
    
}
/* FIN CLASES */

function cargarAlLocalStorage(pArrayProductos){
    const arrayProductosEnJSON = JSON.stringify(pArrayProductos);

    let arrayGuardado = JSON.parse(localStorage.getItem("listaProductos"));

    if(!Array.isArray(arrayGuardado)){
        console.log("Se guarda array al LocalStorage");
        localStorage.setItem("listaProductos", arrayProductosEnJSON);
    }
    else{
        console.log("Se levanta array del LocalStorage");
        pArrayProductos = JSON.parse(localStorage.getItem("listaProductos"));
    }

}

function mostrarProductosDisponibles(pArrayProductos){
    if(pArrayProductos.length > 0){
        let contenedorPrincipal = document.getElementById("productsContainer");
        console.log(contenedorPrincipal.innerHTML);

        for(let producto of pArrayProductos){
            /* INICIO DEL CONTENEDOR */
            let contenedor = document.createElement("div");
            contenedor.classList.add("col-md-4");

            /* INICIO DE LA CARD */
            contenedor.appendChild(producto.armarCard());
            /* FIN DE LA CARD */

            contenedorPrincipal.appendChild(contenedor);
            /* FIN DEL CONTENEDOR */
        }
    }
    else{
        mensajeMostrar = "Carrito vacío.";
    }
}

function agregarProductoAlCarrito(e){
    console.log(e.target);

    const productoEncontrado = arrayProductos.find(producto => {
        return producto.idProducto == e.target.id;
    });

    let mensaje = '';

    if(productoEncontrado !== undefined){
        carritoActual.agregarProducto(productoEncontrado);
        mensaje = "Se agregó " + productoEncontrado.nombre + " al carrito."

        carritoActual.mostrarTotal();
        carritoActual.mostrarCantidadArticulos();
        carritoActual.mostrarCarrito();
    }
    else{
        mensaje = "Hubo un problema al agregar el producto al carrito.";
    }

    console.log(mensaje);
    mostrarMensaje(mensaje);
}

function mostrarMensaje(mensaje){
    let modal = document.getElementById("divMensajeModal");
    modal.style.display = "inline";

    let mensajeModal = document.getElementById("parrafoMensajeModal");
    mensajeModal.innerHTML = mensaje;
}

function cerrarModal(){
    let modal = document.getElementById("divMensajeModal");
    modal.style.display = "none";
}


//creo los productos
let prod1 = new Producto(1, "Zapatilla Nine Mile", 2500, "images/nine-mile.webp");
let prod2 = new Producto(2, "Zapatilla Nike", 3500, "images/nike.webp");
let prod3 = new Producto(3, "Zapatilla I-Run", 4000, "images/buss.webp");
let prod4 = new Producto(4, "Zapatilla All Crash", 2250, "images/all-crash.webp");
let prod5 = new Producto(5, "Buzo", 2500, "images/buzos.webp");

//cargo el array de productos
var arrayProductos = [prod1, prod2, prod3, prod4, prod5];
console.log(arrayProductos);

var carritoActual = new Carrito();

cargarAlLocalStorage(arrayProductos);

//llamo a la funcion principal
mostrarProductosDisponibles(arrayProductos);
carritoActual.mostrarCarrito();
carritoActual.mostrarTotal();

var arrayBotonesCarrito = document.getElementsByClassName("card-add");
console.log(arrayBotonesCarrito);

for(let botonCarrito of arrayBotonesCarrito){
    botonCarrito.addEventListener("click", agregarProductoAlCarrito);
}

var botonLimpiarCarrito = document.getElementById("buttonLimpiarCarrito");
botonLimpiarCarrito.addEventListener("click", () => {
    carritoActual.vaciarCarrito();

    mostrarMensaje("Se vació el carrito!");
    carritoActual.mostrarCarrito();
    carritoActual.mostrarTotal();
    carritoActual.mostrarCantidadArticulos();
});

var botonCerrarModal = document.getElementById("buttonCerrarModal");
botonCerrarModal.addEventListener("click", cerrarModal);