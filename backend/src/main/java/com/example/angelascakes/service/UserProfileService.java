package com.example.angelascakes.service;

import com.example.angelascakes.dto.UserProfileDTO;
import com.example.angelascakes.dto.UserProfileUpdateDTO;
import com.example.angelascakes.entity.User;
import com.example.angelascakes.exception.ResourceNotFoundException;
import com.example.angelascakes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private static final Logger log = LoggerFactory.getLogger(UserProfileService.class);

    private final UserRepository userRepository;

    public UserProfileDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Uživatel nenalezen."));
        return toDTO(user);
    }

    public UserProfileDTO updateProfile(String email, UserProfileUpdateDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Uživatel nenalezen."));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setAddressLine(dto.getAddressLine());
        user.setBuildingName(dto.getBuildingName());
        user.setStreetName(dto.getStreetName());
        user.setPostcode(dto.getPostcode());
        user.setCity(dto.getCity());

        User saved = userRepository.save(user);
        log.info("Profil uživatele aktualizován: {}", email);
        return toDTO(saved);
    }

    private UserProfileDTO toDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setAddressLine(user.getAddressLine());
        dto.setBuildingName(user.getBuildingName());
        dto.setStreetName(user.getStreetName());
        dto.setPostcode(user.getPostcode());
        dto.setCity(user.getCity());
        return dto;
    }
}