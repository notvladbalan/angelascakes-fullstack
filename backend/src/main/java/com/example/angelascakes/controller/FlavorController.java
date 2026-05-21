package com.example.angelascakes.controller;

import com.example.angelascakes.dto.FlavorDTO;
import com.example.angelascakes.service.FlavorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flavors")
@RequiredArgsConstructor
public class FlavorController {

    private final FlavorService flavorService;

    @GetMapping
    public ResponseEntity<List<FlavorDTO>> getAll() {
        return ResponseEntity.ok(flavorService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FlavorDTO> create(@Valid @RequestBody FlavorDTO dto) {
        return ResponseEntity.ok(flavorService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FlavorDTO> update(@PathVariable Long id,
                                            @Valid @RequestBody FlavorDTO dto) {
        return ResponseEntity.ok(flavorService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        flavorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}