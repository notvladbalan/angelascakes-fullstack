package com.example.angelascakes.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Long id;
    private String customerEmail;
    private String status;
    private LocalDateTime createdAt;
    private BigDecimal totalPrice;
    private String note;
    private boolean seen;
    private List<OrderItemResponseDTO> items;

    // Delivery address
    private String deliveryFirstName;
    private String deliveryLastName;
    private String deliveryAddressLine;
    private String deliveryBuildingName;
    private String deliveryStreetName;
    private String deliveryPostcode;
    private String deliveryCity;
}