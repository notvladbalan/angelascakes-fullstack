package com.example.angelascakes.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class CakeRequestDTO {

    @NotBlank(message = "Název nesmí být prázdný")
    private String name;

    @Size(max = 500, message = "Popis může mít maximálně 500 znaků")
    private String description;

    private String imageUrl;

    @NotNull(message = "Cena nesmí být prázdná")
    @DecimalMin(value = "0.1", message = "Cena musí být větší než 0")
    private BigDecimal price;

    private Long flavorId;

    private Set<Long> decorationIds;

    private Long cakeTypeId;

    private Boolean available;
}