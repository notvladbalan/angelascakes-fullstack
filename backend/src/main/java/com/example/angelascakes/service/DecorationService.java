package com.example.angelascakes.service;

import com.example.angelascakes.dto.DecorationDTO;
import com.example.angelascakes.entity.Decoration;
import com.example.angelascakes.exception.ResourceNotFoundException;
import com.example.angelascakes.repository.DecorationRepository;
import com.example.angelascakes.repository.CakeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DecorationService {

    private static final Logger log = LoggerFactory.getLogger(DecorationService.class);

    private final DecorationRepository decorationRepository;
    private final CakeRepository cakeRepository;

    public List<DecorationDTO> getAll() {
        return decorationRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DecorationDTO create(DecorationDTO dto) {
        if (decorationRepository.existsByName(dto.getName())) {
            log.warn("Pokus o vytvoření duplicitní dekorace: {}", dto.getName());
            throw new RuntimeException("Dekorace s tímto názvem již existuje.");
        }

        Decoration decoration = new Decoration();
        decoration.setName(dto.getName());
        Decoration saved = decorationRepository.save(decoration);

        log.info("Nová dekorace vytvořena: {}", saved.getName());
        return toDTO(saved);
    }

    public DecorationDTO update(Long id, DecorationDTO dto) {
        Decoration decoration = decorationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dekorace nenalezena."));

        if (decorationRepository.existsByNameAndIdNot(dto.getName(), id)) {
            throw new RuntimeException("Dekorace s tímto názvem již existuje.");
        }

        decoration.setName(dto.getName());
        Decoration saved = decorationRepository.save(decoration);
        log.info("Dekorace aktualizována, id: {}", id);
        return toDTO(saved);
    }

    public void delete(Long id) {
        if (!decorationRepository.existsById(id)) {
            log.warn("Pokus o smazání neexistující dekorace, id: {}", id);
            throw new ResourceNotFoundException("Dekorace nenalezena.");
        }

        if (cakeRepository.existsByDecorationsId(id)) {
            log.warn("Pokus o smazání dekorace která je používaná v dortu, id: {}", id);
            throw new RuntimeException("Dekorace nelze smazat, je používaná v dortu.");
        }

        decorationRepository.deleteById(id);
        log.info("Dekorace smazána, id: {}", id);
    }

    private DecorationDTO toDTO(Decoration decoration) {
        DecorationDTO dto = new DecorationDTO();
        dto.setId(decoration.getId());
        dto.setName(decoration.getName());
        return dto;
    }
}