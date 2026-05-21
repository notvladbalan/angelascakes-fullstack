package com.example.angelascakes.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemRequestDTO {

    @NotNull(message = "ID dortu nesmí být prázdné")
    private Long cakeId;

    private Long cakeSizeId;

    @NotNull(message = "Množství nesmí být prázdné")
    @Min(value = 1, message = "Množství musí být alespoň 1")
    private Integer quantity;
}