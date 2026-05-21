package com.example.angelascakes.repository;

import com.example.angelascakes.entity.Cake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import java.util.Set;
import java.math.BigDecimal;

public interface CakeRepository extends JpaRepository<Cake, Long> {

    @Query("SELECT c FROM Cake c WHERE " +
            "(:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:flavorId IS NULL OR c.flavor.id = :flavorId) AND " +
            "(:cakeTypeId IS NULL OR c.cakeType.id = :cakeTypeId) AND " +
            "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
            "c.available = true")
    Page<Cake> searchCakes(@Param("name") String name,
                           @Param("flavorId") Long flavorId,
                           @Param("cakeTypeId") Long cakeTypeId,
                           @Param("minPrice") BigDecimal minPrice,
                           @Param("maxPrice") BigDecimal maxPrice,
                           Pageable pageable);

    @Query("SELECT DISTINCT c FROM Cake c JOIN c.decorations d WHERE " +
            "(:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:flavorId IS NULL OR c.flavor.id = :flavorId) AND " +
            "(:cakeTypeId IS NULL OR c.cakeType.id = :cakeTypeId) AND " +
            "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
            "c.available = true AND " +
            "d.id IN :decorationIds")
    Page<Cake> searchCakesByDecorations(@Param("name") String name,
                                        @Param("flavorId") Long flavorId,
                                        @Param("cakeTypeId") Long cakeTypeId,
                                        @Param("minPrice") BigDecimal minPrice,
                                        @Param("maxPrice") BigDecimal maxPrice,
                                        @Param("decorationIds") Set<Long> decorationIds,
                                        Pageable pageable);

    @Query("SELECT c FROM Cake c WHERE " +
            "(:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:cakeTypeId IS NULL OR c.cakeType.id = :cakeTypeId) AND " +
            "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR c.price <= :maxPrice)")
    Page<Cake> searchAllCakes(@Param("name") String name,
                              @Param("cakeTypeId") Long cakeTypeId,
                              @Param("minPrice") BigDecimal minPrice,
                              @Param("maxPrice") BigDecimal maxPrice,
                              Pageable pageable);

    boolean existsByFlavorId(Long flavorId);
    boolean existsByDecorationsId(Long decorationId);
}