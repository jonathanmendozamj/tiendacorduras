/* CLASES */
class Producto{
    constructor(pIdProducto, pNombre, pPrecio){
        this.idProducto = pIdProducto;
        this.nombre = pNombre;
        this.precio = pPrecio;
    }

    mostrarPrecio = function(){
        console.log("El precio es de " + this.precio);
    }

    mostrarDetalle = function() { 
        return this.nombre + " ($ " + this.precio + ")";
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
        let mensajeMostrar = '';
        let total = 0;

        if(this.arrayProductos.length > 0){
            for(let producto of this.arrayProductos){
                mensajeMostrar = mensajeMostrar + producto.mostrarDetalle() + "\n";
                total = total + producto.precio;
            }

            mensajeMostrar = mensajeMostrar + "TOTAL: $ " + total;
        }
        else{
            mensajeMostrar = "Carrito vacío.";
        }

        alert(mensajeMostrar);
    }

    vaciarCarrito(){
        this.arrayProductos = [];
    }
    
}
/* FIN CLASES */

//creo los productos
let prod1 = new Producto(1, "Zapatilla Nine Mile", 2500);
let prod2 = new Producto(2, "Zapatilla Nike", 3500);
let prod3 = new Producto(3, "Zapatilla I-Run", 4000);
let prod4 = new Producto(4, "Zapatilla All Crash", 2250);
let prod5 = new Producto(5, "Buzo", 2500);

//cargo el array de productos
var arrayProductos = [prod1, prod2, prod3, prod4, prod5];
console.log(arrayProductos);

var carritoActual = new Carrito();

//función menu principal
function main(){
    let opcion = mostrarMenu();

    while(opcion != 0){
        switch(opcion){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                carritoActual.agregarProducto(arrayProductos[opcion - 1]);  
                arrayProductos[opcion - 1].mostrarPrecio();
                alert("Felicitaciones! Sumaste " + arrayProductos[opcion - 1].nombre);  
            break;

            case 6:
                carritoActual.mostrarCarrito();
            break;

            case 7:
                carritoActual.vaciarCarrito();
                alert("El carrito fue vaciado.");
            break;

            case 8:
                mainOrdenarPorCriterio();
            break;

            default:
                alert("Opción inválida.");
            break; 
        }

        opcion = mostrarMenu();
        console.log(carritoActual);
    }

    alert("Saliste del programa.");
}

//funcion que ordena array por criterio pasado por parámetro
function ordenarArrayPorCriterio(pArrayProductos, criterio){
    let nuevoArray = pArrayProductos.slice();

    return nuevoArray.sort(criterio);
}

//funcion donde se encuentra el switch y las funciones de ordenamiento
function mainOrdenarPorCriterio(){
    const criterioOrdenarMenorMayorPrecio = (itemA, itemB) => {
        if(itemA.precio > itemB.precio){
            return 1;
        }

        if(itemA.precio < itemB.precio){
            return -1;
        }

        return 0;
    };

    const criterioOrdenarMayorMenorPrecio = (itemA, itemB) => {
        if(itemA.precio < itemB.precio){
            return 1;
        }

        if(itemA.precio > itemB.precio){
            return -1;
        }

        return 0;
    };

    const criterioOrdenarAscendenteNombre = (itemA, itemB) => {
        if(itemA.nombre > itemB.nombre){
            return 1;
        }

        if(itemA.nombre < itemB.nombre){
            return -1;
        }

        return 0;
    };

    const criterioOrdenarDescendenteNombre = (itemA, itemB) => {
        if(itemA.nombre < itemB.nombre){
            return 1;
        }

        if(itemA.nombre > itemB.nombre){
            return -1;
        }

        return 0;
    };

    let opcion = mostrarMenuOpcionesOrdenamiento();

    while(opcion != 0){
        switch(opcion){
            case 1:
                console.log("Array original", arrayProductos);
                console.log("Array ordenado de menor a mayor precio", ordenarArrayPorCriterio(arrayProductos, criterioOrdenarMenorMayorPrecio));
            break;
    
            case 2:
                console.log("Array original", arrayProductos);
                console.log("Array ordenado de mayor a menor precio", ordenarArrayPorCriterio(arrayProductos, criterioOrdenarMayorMenorPrecio));
            break;
    
            case 3: 
                console.log("Array original", arrayProductos);
                console.log("Array ordenado alfabéticamente por nombre de forma ascendente (A-Z) ", ordenarArrayPorCriterio(arrayProductos, criterioOrdenarAscendenteNombre));
            break;
    
            case 4:
                console.log("Array original", arrayProductos);
                console.log("Array ordenado alfabéticamente por nombre de forma descendente (Z-A)", ordenarArrayPorCriterio(arrayProductos, criterioOrdenarDescendenteNombre));
            break;

            default:
                alert("Opción inválida.");
            break; 
        }

        opcion = mostrarMenuOpcionesOrdenamiento();
    }

    alert("Saliste de la subsección de ordenamiento.");
}

//Función que muestra el menu de ordenamiento
function mostrarMenuOpcionesOrdenamiento(){
    let mensaje = "**** MENÚ ORDEN ****\n";
    mensaje = mensaje + "\n";
    mensaje = mensaje + "1) Ordenar de menor a mayor precio\n";
    mensaje = mensaje + "2) Ordenar de mayor a menor precio\n";
    mensaje = mensaje + "3) Ordenar alfabéticamente por nombre de forma ascendente (A-Z)\n";
    mensaje = mensaje + "4) Ordenar alfabéticamente por nombre de forma descendente (Z-A)\n";
    mensaje = mensaje + "0) Volver al menú principal\n";
    mensaje = mensaje + "\n";
    mensaje = mensaje + "Ingrese una opción";

    let opcion = parseInt(prompt(mensaje));

    if(isNaN(opcion)){
        opcion = -1;
    }

    return opcion;
}

//funcion que muestra el menu principal
function mostrarMenu(){
    let mensaje = "**** MENÚ ****\n";
    mensaje = mensaje + "\n";
    mensaje = mensaje + "1) Zapatilla Nine Mile ($ 2.500)\n";
    mensaje = mensaje + "2) Zapatilla Nike ($ 3.500)\n";
    mensaje = mensaje + "3) Zapatilla I-Run ($ 4.000)\n";
    mensaje = mensaje + "4) Zapatilla All Crash ($ 2.250)\n";
    mensaje = mensaje + "5) Buzo ($ 2.500)\n";
    mensaje = mensaje + "6) Mostrar carrito actual\n";
    mensaje = mensaje + "7) Vaciar carrito\n";
    mensaje = mensaje + "8) Mostrar productos disponibles según orden\n";
    mensaje = mensaje + "0) Salir del programa\n";
    mensaje = mensaje + "\n";
    mensaje = mensaje + "Ingrese una opción";

    let opcion = parseInt(prompt(mensaje));

    if(isNaN(opcion)){
        opcion = -1;
    }

    return opcion;
}

//llamo a la funcion principal
main();