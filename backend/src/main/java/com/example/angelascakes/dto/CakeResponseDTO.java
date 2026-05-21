package com.example.angelascakes.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;
import java.util.List;

@Data
public class CakeResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private String flavorName;
    private Set<String> decorationNames;
    private List<CakeSizeDTO> sizes;
    private Long flavorId;
    private Set<Long> decorationIds;
    private Long cakeTypeId;
    private String cakeTypeName;
    private boolean available;
}