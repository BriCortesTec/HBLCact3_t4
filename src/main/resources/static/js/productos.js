const API_PRODUCTOS = "/api/productos";
const API_CATEGORIAS = "/api/categorias";

const formulario = document.getElementById("formProducto");
const tabla = document.getElementById("tablaProductos");
const selectCategoria = document.getElementById("categoria");
const mensaje = document.getElementById("mensaje");

async function cargarCategorias() {
    const respuesta = await fetch(API_CATEGORIAS);

    if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las categorías.");
    }

    const categorias = await respuesta.json();

    selectCategoria.innerHTML =
        '<option value="">Selecciona una categoría</option>';

    categorias.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;
        selectCategoria.appendChild(opcion);
    });
}

async function cargarProductos() {
    try {
        const respuesta = await fetch(API_PRODUCTOS);

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar los productos.");
        }

        const productos = await respuesta.json();
        tabla.innerHTML = "";

        productos.forEach(producto => {
            const fila = document.createElement("tr");

            const valores = [
                producto.id,
                producto.nombre,
                `$${Number(producto.precio).toFixed(2)}`,
                producto.descripcion || "",
                producto.categoria?.nombre || "Sin categoría"
            ];

            valores.forEach(valor => {
                const celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            const acciones = document.createElement("td");

            const editar = document.createElement("button");
            editar.textContent = "Editar";
            editar.className = "editar";
            editar.onclick = () => editarProducto(producto);

            const eliminar = document.createElement("button");
            eliminar.textContent = "Eliminar";
            eliminar.className = "eliminar";
            eliminar.onclick = () => eliminarProducto(producto.id);

            acciones.append(editar, eliminar);
            fila.appendChild(acciones);

            tabla.appendChild(fila);
        });

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("id").value;

    const producto = {
        nombre: document.getElementById("nombre").value,
        precio: Number(document.getElementById("precio").value),
        descripcion: document.getElementById("descripcion").value,
        categoria: {
            id: Number(selectCategoria.value)
        }
    };

    try {
        const respuesta = await fetch(
            id ? `${API_PRODUCTOS}/${id}` : API_PRODUCTOS,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(producto)
            }
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo guardar el producto.");
        }

        mostrarMensaje("Producto guardado correctamente.");
        limpiarFormulario();
        cargarProductos();

    } catch (error) {
        mostrarMensaje(error.message);
    }
});

function editarProducto(producto) {
    document.getElementById("id").value = producto.id;
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("descripcion").value =
        producto.descripcion || "";

    selectCategoria.value = producto.categoria?.id || "";

    document.getElementById("tituloFormulario").textContent =
        "Editar producto";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function eliminarProducto(id) {
    if (!confirm("¿Deseas eliminar este producto?")) return;

    try {
        const respuesta = await fetch(`${API_PRODUCTOS}/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo eliminar el producto.");
        }

        mostrarMensaje("Producto eliminado correctamente.");
        cargarProductos();

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function limpiarFormulario() {
    formulario.reset();
    document.getElementById("id").value = "";
    document.getElementById("tituloFormulario").textContent =
        "Registrar producto";
}

function mostrarMensaje(texto) {
    mensaje.textContent = texto;
}

document.getElementById("cancelar").addEventListener("click", limpiarFormulario);
document.getElementById("actualizar").addEventListener("click", cargarProductos);

async function iniciar() {
    try {
        await cargarCategorias();
        await cargarProductos();
    } catch (error) {
        mostrarMensaje(error.message);
    }
}

iniciar();
