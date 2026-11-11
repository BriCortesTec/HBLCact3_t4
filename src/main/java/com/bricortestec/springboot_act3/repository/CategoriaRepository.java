package com.bricortestec.springboot_act3.repository;

import com.bricortestec.springboot_act3.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
