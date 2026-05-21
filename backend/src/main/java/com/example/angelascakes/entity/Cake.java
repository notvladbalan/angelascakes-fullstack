package com.example.angelascakes.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cakes")
@Data
public class Cake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    private String imageUrl;

    @Column(nullable = false)
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "flavor_id")
    private Flavor flavor;

    @ManyToMany
    @JoinTable(
            name = "cake_decorations",
            joinColumns = @JoinColumn(name = "cake_id"),
            inverseJoinColumns = @JoinColumn(name = "decoration_id")
    )
    private Set<Decoration> decorations;

    @OneToMany(mappedBy = "cake", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CakeSize> sizes = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "cake_type_id")
    private CakeType cakeType;

    @Column(nullable = false)
    private boolean available = false;
}