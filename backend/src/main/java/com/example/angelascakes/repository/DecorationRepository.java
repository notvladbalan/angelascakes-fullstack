package com.example.angelascakes.repository;

import com.example.angelascakes.entity.Decoration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DecorationRepository extends JpaRepository<Decoration, Long> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, Long id);
}