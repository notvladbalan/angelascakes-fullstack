package com.example.angelascakes.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "cake_sizes")
@Data
public class CakeSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cake_id", nullable = false)
    private Cake cake;

    @Column(nullable = false)
    private String label; // S, M, L

    @Column(nullable = false)
    private Integer slices; // 8, 12, 20

    @Column(nullable = false)
    private BigDecimal price; // 20, 30, 40
}