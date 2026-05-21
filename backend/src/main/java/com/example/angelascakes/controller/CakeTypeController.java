package com.example.angelascakes.controller;

import com.example.angelascakes.dto.CakeTypeDTO;
import com.example.angelascakes.service.CakeTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cake-types")
@RequiredArgsConstructor
public class CakeTypeController {

    private final CakeTypeService cakeTypeService;

    @GetMapping
    public ResponseEntity<List<CakeTypeDTO>> getAll() {
        return ResponseEntity.ok(cakeTypeService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CakeTypeDTO> create(@Valid @RequestBody CakeTypeDTO dto) {
        return ResponseEntity.ok(cakeTypeService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CakeTypeDTO> update(@PathVariable Long id,
                                              @Valid @RequestBody CakeTypeDTO dto) {
        return ResponseEntity.ok(cakeTypeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cakeTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}