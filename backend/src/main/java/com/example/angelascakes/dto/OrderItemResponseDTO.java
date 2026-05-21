package com.example.angelascakes.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemResponseDTO {
    private Long id;
    private Long cakeId;
    private String cakeName;
    private String cakeImageUrl;
    private String sizeLabel;
    private Integer slices;
    private Integer quantity;
    private BigDecimal priceAtOrder;
    private BigDecimal totalPrice;
}