package com.bricortestec.springboot_act3.controller;

import com.bricortestec.springboot_act3.model.Categoria;
import com.bricortestec.springboot_act3.repository.CategoriaRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    // Consultar todas las categorias
    @GetMapping
    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    // Consultar una categoria por ID
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> buscar(@PathVariable Long id) {
        return categoriaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Registrar categoria
    @PostMapping
    public Categoria guardar(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // Actualizar categoria
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(
            @PathVariable Long id,
            @RequestBody Categoria datos) {

        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNombre(datos.getNombre());
                    categoria.setDescripcion(datos.getDescripcion());
                    return ResponseEntity.ok(categoriaRepository.save(categoria));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar categoria
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!categoriaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        categoriaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
