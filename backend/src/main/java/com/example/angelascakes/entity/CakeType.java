package com.example.angelascakes.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cake_types")
@Data
public class CakeType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}