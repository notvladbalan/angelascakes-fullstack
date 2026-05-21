package com.example.angelascakes.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Profile fields
    private String firstName;
    private String lastName;

    // Delivery address fields
    private String addressLine;
    private String buildingName;
    private String streetName;
    private String postcode;
    private String city;
}
