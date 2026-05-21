package com.example.angelascakes.service;

import com.example.angelascakes.dto.CakeSizeDTO;
import com.example.angelascakes.entity.Cake;
import com.example.angelascakes.entity.CakeSize;
import com.example.angelascakes.exception.ResourceNotFoundException;
import com.example.angelascakes.repository.CakeRepository;
import com.example.angelascakes.repository.CakeSizeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CakeSizeService {

    private static final Logger log = LoggerFactory.getLogger(CakeSizeService.class);

    private final CakeSizeRepository cakeSizeRepository;
    private final CakeRepository cakeRepository;

    public List<CakeSizeDTO> getSizesForCake(Long cakeId) {
        return cakeSizeRepository.findByCakeId(cakeId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CakeSizeDTO addSize(Long cakeId, CakeSizeDTO dto) {
        Cake cake = cakeRepository.findById(cakeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dort nenalezen."));

        CakeSize size = new CakeSize();
        size.setCake(cake);
        size.setLabel(dto.getLabel());
        size.setSlices(dto.getSlices());
        size.setPrice(dto.getPrice());

        CakeSize saved = cakeSizeRepository.save(size);
        log.info("Přidána velikost {} pro dort id: {}", dto.getLabel(), cakeId);
        return toDTO(saved);
    }

    public void deleteSize(Long sizeId) {
        if (!cakeSizeRepository.existsById(sizeId)) {
            throw new ResourceNotFoundException("Velikost nenalezena.");
        }
        cakeSizeRepository.deleteById(sizeId);
        log.info("Velikost smazána, id: {}", sizeId);
    }

    private CakeSizeDTO toDTO(CakeSize size) {
        CakeSizeDTO dto = new CakeSizeDTO();
        dto.setId(size.getId());
        dto.setLabel(size.getLabel());
        dto.setSlices(size.getSlices());
        dto.setPrice(size.getPrice());
        return dto;
    }
}