package com.example.angelascakes.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDTO {

    @NotEmpty(message = "Objednávka musí obsahovat alespoň jeden dort")
    private List<OrderItemRequestDTO> items;

    private String note;
}