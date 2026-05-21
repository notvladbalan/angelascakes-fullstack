package com.example.angelascakes.controller;

import com.example.angelascakes.dto.DecorationDTO;
import com.example.angelascakes.service.DecorationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decorations")
@RequiredArgsConstructor
public class DecorationController {

    private final DecorationService decorationService;

    @GetMapping
    public ResponseEntity<List<DecorationDTO>> getAll() {
        return ResponseEntity.ok(decorationService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DecorationDTO> create(@Valid @RequestBody DecorationDTO dto) {
        return ResponseEntity.ok(decorationService.create(dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        decorationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DecorationDTO> update(@PathVariable Long id,
                                                @Valid @RequestBody DecorationDTO dto) {
        return ResponseEntity.ok(decorationService.update(id, dto));
    }
}