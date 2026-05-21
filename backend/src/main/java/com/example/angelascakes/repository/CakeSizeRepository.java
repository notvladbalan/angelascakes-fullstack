package com.example.angelascakes.repository;

import com.example.angelascakes.entity.CakeSize;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CakeSizeRepository extends JpaRepository<CakeSize, Long> {
    List<CakeSize> findByCakeId(Long cakeId);
}