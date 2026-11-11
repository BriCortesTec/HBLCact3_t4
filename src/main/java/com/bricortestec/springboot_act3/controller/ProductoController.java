package com.bricortestec.springboot_act3.controller;

import com.bricortestec.springboot_act3.model.Producto;
import com.bricortestec.springboot_act3.repository.ProductoRepository;
import com.bricortestec.springboot_act3.repository.CategoriaRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoController(ProductoRepository productoRepository,CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    // Consultar todos los productos
    @GetMapping
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    // Consultar producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscar(@PathVariable Long id) {
        return productoRepository.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }

    // Registrar producto
    @PostMapping
    public ResponseEntity<Object> guardar(@RequestBody Producto producto) {

        if (producto.getCategoria() == null ||
            producto.getCategoria().getId() == null) {
            return ResponseEntity.badRequest()
        .body("Debe especificar una categoria.");
        }

        return categoriaRepository.findById(producto.getCategoria().getId())
            .map(categoria -> {
                producto.setCategoria(categoria);
                return ResponseEntity.ok()
                .body((Object) productoRepository.save(producto));
            })
            .orElse(ResponseEntity.badRequest()
                .body((Object) "La categoria no existe."));
    }

    // Actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,@RequestBody Producto datos) {
        return productoRepository.findById(id)
                .map(producto -> {

                    producto.setNombre(datos.getNombre());
                    producto.setPrecio(datos.getPrecio());
                    producto.setDescripcion(datos.getDescripcion());

                    if (datos.getCategoria() != null &&
                        datos.getCategoria().getId() != null) {

                        categoriaRepository.findById(datos.getCategoria().getId())
                                .ifPresent(producto::setCategoria);
                    }

                    return ResponseEntity.ok(productoRepository.save(producto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        if (!productoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
