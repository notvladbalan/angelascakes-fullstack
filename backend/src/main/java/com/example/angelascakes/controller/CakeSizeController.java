package com.example.angelascakes.controller;

import com.example.angelascakes.dto.CakeSizeDTO;
import com.example.angelascakes.service.CakeSizeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cakes/{cakeId}/sizes")
@RequiredArgsConstructor
public class CakeSizeController {

    private final CakeSizeService cakeSizeService;

    @GetMapping
    public ResponseEntity<List<CakeSizeDTO>> getSizes(@PathVariable Long cakeId) {
        return ResponseEntity.ok(cakeSizeService.getSizesForCake(cakeId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CakeSizeDTO> addSize(@PathVariable Long cakeId,
                                               @Valid @RequestBody CakeSizeDTO dto) {
        return ResponseEntity.ok(cakeSizeService.addSize(cakeId, dto));
    }

    @DeleteMapping("/{sizeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSize(@PathVariable Long cakeId,
                                           @PathVariable Long sizeId) {
        cakeSizeService.deleteSize(sizeId);
        return ResponseEntity.noContent().build();
    }
}