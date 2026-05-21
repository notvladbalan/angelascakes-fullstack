package com.example.angelascakes.service;

import com.example.angelascakes.dto.FlavorDTO;
import com.example.angelascakes.entity.Flavor;
import com.example.angelascakes.exception.ResourceNotFoundException;
import com.example.angelascakes.repository.FlavorRepository;
import com.example.angelascakes.repository.CakeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlavorService {

    private static final Logger log = LoggerFactory.getLogger(FlavorService.class);

    private final FlavorRepository flavorRepository;

    private final CakeRepository cakeRepository;

    public List<FlavorDTO> getAll() {
        return flavorRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public FlavorDTO create(FlavorDTO dto) {
        if (flavorRepository.existsByName(dto.getName())) {
            log.warn("Pokus o vytvoření duplicitní příchuti: {}", dto.getName());
            throw new RuntimeException("Příchuť s tímto názvem již existuje.");
        }

        Flavor flavor = new Flavor();
        flavor.setName(dto.getName());
        Flavor saved = flavorRepository.save(flavor);

        log.info("Nová příchuť vytvořena: {}", saved.getName());
        return toDTO(saved);
    }

    public FlavorDTO update(Long id, FlavorDTO dto) {
        Flavor flavor = flavorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Příchuť nenalezena."));

        if (flavorRepository.existsByNameAndIdNot(dto.getName(), id)) {
            throw new RuntimeException("Příchuť s tímto názvem již existuje.");
        }

        flavor.setName(dto.getName());
        Flavor saved = flavorRepository.save(flavor);
        log.info("Příchuť aktualizována, id: {}", id);
        return toDTO(saved);
    }


    public void delete(Long id) {
        if (!flavorRepository.existsById(id)) {
            log.warn("Pokus o smazání neexistující příchutě, id: {}", id);
            throw new ResourceNotFoundException("Příchuť nenalezena.");
        }

        // Zkontroluj jestli je příchuť používaná v nějakém dortu
        if (cakeRepository.existsByFlavorId(id)) {
            log.warn("Pokus o smazání příchutě která je používaná v dortu, id: {}", id);
            throw new RuntimeException("Příchuť nelze smazat, je používaná v dortu.");
        }

        flavorRepository.deleteById(id);
        log.info("Příchuť smazána, id: {}", id);
    }

    private FlavorDTO toDTO(Flavor flavor) {
        FlavorDTO dto = new FlavorDTO();
        dto.setId(flavor.getId());
        dto.setName(flavor.getName());
        return dto;
    }
}