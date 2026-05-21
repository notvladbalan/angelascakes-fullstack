package com.example.angelascakes.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private BigDecimal totalPrice;

    private String note;

    private boolean seen = false;

    // Delivery address snapshot (copied from user at order time)
    private String deliveryFirstName;
    private String deliveryLastName;
    private String deliveryAddressLine;
    private String deliveryBuildingName;
    private String deliveryStreetName;
    private String deliveryPostcode;
    private String deliveryCity;
}