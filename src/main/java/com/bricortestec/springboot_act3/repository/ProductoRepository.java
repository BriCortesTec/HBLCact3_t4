
package com.bricortestec.springboot_act3.repository;

import com.bricortestec.springboot_act3.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
