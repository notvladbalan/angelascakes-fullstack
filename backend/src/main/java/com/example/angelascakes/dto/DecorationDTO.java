package com.example.angelascakes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DecorationDTO {
    private Long id;

    @NotBlank(message = "Název dekorace nesmí být prázdný")
    private String name;
}