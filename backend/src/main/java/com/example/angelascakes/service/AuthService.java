package com.example.angelascakes.service;

import com.example.angelascakes.dto.AuthResponseDTO;
import com.example.angelascakes.dto.LoginDTO;
import com.example.angelascakes.dto.RegisterDTO;
import com.example.angelascakes.entity.Role;
import com.example.angelascakes.entity.User;
import com.example.angelascakes.repository.UserRepository;
import com.example.angelascakes.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDTO register(RegisterDTO dto) {
        // Zkontroluje zda email již existuje
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            log.warn("Pokus o registraci s existujícím emailem: {}", dto.getEmail());
            throw new RuntimeException("Email je již použit.");
        }

        // Vytvoří nového uživatle
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.CUSTOMER); // default role

        userRepository.save(user);
        log.info("Nový uživatel zaregistrován: {}", dto.getEmail());

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponseDTO(token, user.getRole().name());
    }

    public AuthResponseDTO login(LoginDTO dto) {
        // Ověří uživatele (vyhodí výjimku při špatných přihlašovacích údajích)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen."));

        log.info("Uživatel přihlášen: {}", dto.getEmail());

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponseDTO(token, user.getRole().name());
    }
}