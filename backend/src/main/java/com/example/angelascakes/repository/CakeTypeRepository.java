package com.example.angelascakes.repository;

import com.example.angelascakes.entity.CakeType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface CakeTypeRepository extends JpaRepository<CakeType, Long> {
    boolean existsByName(String name);
    Optional<CakeType> findByName(String name);
    boolean existsByNameAndIdNot(String name, Long id);
}