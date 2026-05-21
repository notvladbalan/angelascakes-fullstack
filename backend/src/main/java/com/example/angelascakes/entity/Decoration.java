package com.example.angelascakes.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "decorations")
@Data
public class Decoration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}