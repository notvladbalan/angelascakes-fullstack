package com.example.angelascakes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FlavorDTO {
    private Long id;

    @NotBlank(message = "Název příchutě nesmí být prázdný")
    private String name;
}