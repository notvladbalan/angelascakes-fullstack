package com.example.angelascakes.repository;

import com.example.angelascakes.entity.Flavor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlavorRepository extends JpaRepository<Flavor, Long> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, Long id);
}