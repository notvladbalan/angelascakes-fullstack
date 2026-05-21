package com.example.angelascakes.service;

import com.example.angelascakes.dto.CakeRequestDTO;
import com.example.angelascakes.dto.CakeResponseDTO;
import com.example.angelascakes.entity.Cake;
import com.example.angelascakes.entity.CakeSize;
import com.example.angelascakes.entity.Decoration;
import com.example.angelascakes.entity.Flavor;
import com.example.angelascakes.repository.CakeRepository;
import com.example.angelascakes.repository.CakeSizeRepository;
import com.example.angelascakes.repository.DecorationRepository;
import com.example.angelascakes.repository.FlavorRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.angelascakes.dto.CakeSizeDTO;
import com.example.angelascakes.entity.CakeType;
import com.example.angelascakes.repository.CakeTypeRepository;
import com.example.angelascakes.exception.ResourceNotFoundException;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CakeService {

    private static final Logger log = LoggerFactory.getLogger(CakeService.class);

    private final CakeRepository cakeRepository;
    private final CakeSizeRepository cakeSizeRepository;
    private final FlavorRepository flavorRepository;
    private final DecorationRepository decorationRepository;
    private final CakeTypeRepository cakeTypeRepository;

    public Page<CakeResponseDTO> searchCakes(String name, Long flavorId, Long cakeTypeId,
                                             Set<Long> decorationIds,
                                             BigDecimal minPrice, BigDecimal maxPrice,
                                             Pageable pageable) {
        if (decorationIds != null && !decorationIds.isEmpty()) {
            return cakeRepository.searchCakesByDecorations(
                            name, flavorId, cakeTypeId, minPrice, maxPrice, decorationIds, pageable)
                    .map(this::toDTO);
        }
        return cakeRepository.searchCakes(name, flavorId, cakeTypeId, minPrice, maxPrice, pageable)
                .map(this::toDTO);
    }

    public Page<CakeResponseDTO> searchAllCakes(String name, Long cakeTypeId,
                                                BigDecimal minPrice, BigDecimal maxPrice,
                                                Pageable pageable) {
        return cakeRepository.searchAllCakes(name, cakeTypeId, minPrice, maxPrice, pageable)
                .map(this::toDTO);
    }

    public CakeResponseDTO getById(Long id) {
        Cake cake = cakeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dort nenalezen."));
        return toDTO(cake);
    }

    public CakeResponseDTO create(CakeRequestDTO dto) {
        Cake cake = buildCakeFromDTO(new Cake(), dto);
        cake.setAvailable(false);
        Cake saved = cakeRepository.save(cake);
        createDefaultSizes(saved, saved.getPrice());
        log.info("Nový dort vytvořen: {}", saved.getName());
        return toDTO(saved);
    }

    public CakeResponseDTO update(Long id, CakeRequestDTO dto) {
        Cake cake = cakeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dort nenalezen."));

        BigDecimal oldPrice = cake.getPrice();
        buildCakeFromDTO(cake, dto);
        Cake saved = cakeRepository.save(cake);

        if (dto.getPrice() != null && dto.getPrice().compareTo(oldPrice) != 0) {
            List<CakeSize> existingSizes = cakeSizeRepository.findByCakeId(saved.getId());
            cakeSizeRepository.deleteAll(existingSizes);
            createDefaultSizes(saved, saved.getPrice());
            log.info("Velikosti dortu aktualizovány, id: {}", saved.getId());
        }

        log.info("Dort aktualizován, id: {}", saved.getId());
        return toDTO(saved);
    }

    public CakeResponseDTO setAvailability(Long id, boolean available) {
        Cake cake = cakeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dort nenalezen."));
        cake.setAvailable(available);
        Cake saved = cakeRepository.save(cake);
        log.info("Dort id {} nastaven available={}", id, available);
        return toDTO(saved);
    }

    private Cake buildCakeFromDTO(Cake cake, CakeRequestDTO dto) {
        cake.setName(dto.getName());
        cake.setDescription(dto.getDescription());
        cake.setImageUrl(dto.getImageUrl());
        cake.setPrice(dto.getPrice());

        if (dto.getFlavorId() != null) {
            Flavor flavor = flavorRepository.findById(dto.getFlavorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Příchuť nenalezena."));
            cake.setFlavor(flavor);
        }

        if (dto.getDecorationIds() != null && !dto.getDecorationIds().isEmpty()) {
            Set<Decoration> decorations = new HashSet<>(
                    decorationRepository.findAllById(dto.getDecorationIds())
            );
            cake.setDecorations(decorations);
        }

        if (dto.getCakeTypeId() != null) {
            CakeType cakeType = cakeTypeRepository.findById(dto.getCakeTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Typ dortu nenalezen."));
            cake.setCakeType(cakeType);
        } else if (cake.getCakeType() == null) {
            cakeTypeRepository.findByName("Regular")
                    .ifPresent(cake::setCakeType);
        }

        return cake;
    }

    private void createDefaultSizes(Cake cake, BigDecimal basePrice) {
        CakeSize sSize = new CakeSize();
        sSize.setCake(cake);
        sSize.setLabel("S");
        sSize.setSlices(8);
        sSize.setPrice(basePrice.multiply(BigDecimal.valueOf(0.90))
                .setScale(2, java.math.RoundingMode.HALF_UP));
        cakeSizeRepository.save(sSize);

        CakeSize mSize = new CakeSize();
        mSize.setCake(cake);
        mSize.setLabel("M");
        mSize.setSlices(12);
        mSize.setPrice(basePrice.setScale(2, java.math.RoundingMode.HALF_UP));
        cakeSizeRepository.save(mSize);

        CakeSize lSize = new CakeSize();
        lSize.setCake(cake);
        lSize.setLabel("L");
        lSize.setSlices(20);
        lSize.setPrice(basePrice.multiply(BigDecimal.valueOf(1.10))
                .setScale(2, java.math.RoundingMode.HALF_UP));
        cakeSizeRepository.save(lSize);
    }

    private CakeResponseDTO toDTO(Cake cake) {
        CakeResponseDTO dto = new CakeResponseDTO();
        dto.setId(cake.getId());
        dto.setName(cake.getName());
        dto.setDescription(cake.getDescription());
        dto.setImageUrl(cake.getImageUrl());
        dto.setPrice(cake.getPrice());
        dto.setAvailable(cake.isAvailable());

        if (cake.getFlavor() != null) {
            dto.setFlavorName(cake.getFlavor().getName());
            dto.setFlavorId(cake.getFlavor().getId());
        }

        if (cake.getDecorations() != null) {
            dto.setDecorationNames(
                    cake.getDecorations().stream()
                            .map(Decoration::getName)
                            .collect(Collectors.toSet())
            );
            dto.setDecorationIds(
                    cake.getDecorations().stream()
                            .map(Decoration::getId)
                            .collect(Collectors.toSet())
            );
        }

        // Map sizes
        List<CakeSizeDTO> sizes = cakeSizeRepository.findByCakeId(cake.getId())
                .stream()
                .map(size -> {
                    CakeSizeDTO sizeDTO = new CakeSizeDTO();
                    sizeDTO.setId(size.getId());
                    sizeDTO.setLabel(size.getLabel());
                    sizeDTO.setSlices(size.getSlices());
                    sizeDTO.setPrice(size.getPrice());
                    return sizeDTO;
                })
                .collect(Collectors.toList());
        dto.setSizes(sizes);

        if (cake.getCakeType() != null) {
            dto.setCakeTypeId(cake.getCakeType().getId());
            dto.setCakeTypeName(cake.getCakeType().getName());
        }

        return dto;
    }
}