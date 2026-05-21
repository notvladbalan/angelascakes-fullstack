package com.example.angelascakes.service;

import com.example.angelascakes.dto.CakeTypeDTO;
import com.example.angelascakes.entity.CakeType;
import com.example.angelascakes.exception.ResourceNotFoundException;
import com.example.angelascakes.repository.CakeTypeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CakeTypeService {

    private static final Logger log = LoggerFactory.getLogger(CakeTypeService.class);

    private final CakeTypeRepository cakeTypeRepository;

    public List<CakeTypeDTO> getAll() {
        return cakeTypeRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CakeTypeDTO update(Long id, CakeTypeDTO dto) {
        CakeType cakeType = cakeTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Typ dortu nenalezen."));

        if (cakeTypeRepository.existsByNameAndIdNot(dto.getName(), id)) {
            throw new RuntimeException("Typ s tímto názvem již existuje.");
        }

        cakeType.setName(dto.getName());
        CakeType saved = cakeTypeRepository.save(cakeType);
        log.info("Typ dortu aktualizován, id: {}", id);
        return toDTO(saved);
    }

    public CakeTypeDTO create(CakeTypeDTO dto) {
        if (cakeTypeRepository.existsByName(dto.getName())) {
            log.warn("Pokus o vytvoření duplicitního typu: {}", dto.getName());
            throw new RuntimeException("Typ s tímto názvem již existuje.");
        }

        CakeType cakeType = new CakeType();
        cakeType.setName(dto.getName());
        CakeType saved = cakeTypeRepository.save(cakeType);

        log.info("Nový typ dortu vytvořen: {}", saved.getName());
        return toDTO(saved);
    }

    public void delete(Long id) {
        if (!cakeTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Typ dortu nenalezen.");
        }
        cakeTypeRepository.deleteById(id);
        log.info("Typ dortu smazán, id: {}", id);
    }

    private CakeTypeDTO toDTO(CakeType cakeType) {
        CakeTypeDTO dto = new CakeTypeDTO();
        dto.setId(cakeType.getId());
        dto.setName(cakeType.getName());
        return dto;
    }
}