package com.example.angelascakes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CakeTypeDTO {
    private Long id;

    @NotBlank(message = "Název typu nesmí být prázdný")
    private String name;
}