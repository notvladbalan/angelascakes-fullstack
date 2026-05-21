package com.example.angelascakes.controller;

import com.example.angelascakes.dto.CakeRequestDTO;
import com.example.angelascakes.dto.CakeResponseDTO;
import com.example.angelascakes.service.CakeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cakes")
@RequiredArgsConstructor
public class CakeController {

    private final CakeService cakeService;

    @GetMapping
    public ResponseEntity<Page<CakeResponseDTO>> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long flavorId,
            @RequestParam(required = false) Long cakeTypeId,
            @RequestParam(required = false) Set<Long> decorationIds,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable) {
        return ResponseEntity.ok(cakeService.searchCakes(
                name, flavorId, cakeTypeId, decorationIds, minPrice, maxPrice, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CakeResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cakeService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CakeResponseDTO> create(@Valid @RequestBody CakeRequestDTO dto) {
        return ResponseEntity.ok(cakeService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CakeResponseDTO> update(@PathVariable Long id,
                                                  @Valid @RequestBody CakeRequestDTO dto) {
        return ResponseEntity.ok(cakeService.update(id, dto));
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CakeResponseDTO> setAvailability(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(cakeService.setAvailability(id, body.get("available")));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<CakeResponseDTO>> getAllForAdmin(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long cakeTypeId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable) {
        return ResponseEntity.ok(cakeService.searchAllCakes(name, cakeTypeId, minPrice, maxPrice, pageable));
    }
}