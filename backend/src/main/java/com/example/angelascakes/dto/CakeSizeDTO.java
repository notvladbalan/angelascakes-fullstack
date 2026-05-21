package com.example.angelascakes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CakeSizeDTO {
    private Long id;

    @NotBlank(message = "Označení velikosti nesmí být prázdné")
    private String label;

    @NotNull(message = "Počet porcí nesmí být prázdný")
    private Integer slices;

    @NotNull(message = "Cena nesmí být prázdná")
    private BigDecimal price;
}