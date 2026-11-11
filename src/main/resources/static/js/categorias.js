const API = "/api/categorias";

const formulario = document.getElementById("formCategoria");
const tabla = document.getElementById("tablaCategorias");
const mensaje = document.getElementById("mensaje");

async function cargarCategorias() {
    try {
        const respuesta = await fetch(API);

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar las categorías.");
        }

        const categorias = await respuesta.json();
        tabla.innerHTML = "";

        categorias.forEach(categoria => {
            const fila = document.createElement("tr");

            const id = document.createElement("td");
            id.textContent = categoria.id;

            const nombre = document.createElement("td");
            nombre.textContent = categoria.nombre;

            const descripcion = document.createElement("td");
            descripcion.textContent = categoria.descripcion || "";

            const acciones = document.createElement("td");

            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.className = "editar";
            botonEditar.onclick = () => editarCategoria(categoria);

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.className = "eliminar";
            botonEliminar.onclick = () => eliminarCategoria(categoria.id);

            acciones.append(botonEditar, botonEliminar);
            fila.append(id, nombre, descripcion, acciones);
            tabla.appendChild(fila);
        });

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("id").value;

    const categoria = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value
    };

    try {
        const respuesta = await fetch(id ? `${API}/${id}` : API, {
            method: id ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categoria)
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo guardar la categoría.");
        }

        mostrarMensaje("Categoría guardada correctamente.");
        limpiarFormulario();
        cargarCategorias();

    } catch (error) {
        mostrarMensaje(error.message);
    }
});

function editarCategoria(categoria) {
    document.getElementById("id").value = categoria.id;
    document.getElementById("nombre").value = categoria.nombre;
    document.getElementById("descripcion").value = categoria.descripcion || "";

    document.getElementById("tituloFormulario").textContent =
        "Editar categoría";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function eliminarCategoria(id) {
    if (!confirm("¿Deseas eliminar esta categoría?")) {
        return;
    }

    try {
        const respuesta = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo eliminar. Comprueba que no tenga productos asociados."
            );
        }

        mostrarMensaje("Categoría eliminada correctamente.");
        cargarCategorias();

    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function limpiarFormulario() {
    formulario.reset();
    document.getElementById("id").value = "";
    document.getElementById("tituloFormulario").textContent =
        "Registrar categoría";
}

function mostrarMensaje(texto) {
    mensaje.textContent = texto;
}

document.getElementById("cancelar").addEventListener("click", limpiarFormulario);
document.getElementById("actualizar").addEventListener("click", cargarCategorias);

cargarCategorias();
