package com.example.angelascakes.config;

import com.example.angelascakes.entity.Role;
import com.example.angelascakes.entity.User;
import com.example.angelascakes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.example.angelascakes.entity.CakeType;
import com.example.angelascakes.repository.CakeTypeRepository;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CakeTypeRepository cakeTypeRepository;


    @Override
    public void run(String... args) {
        // Vytvoří admina pouze pokud ještě neexistuje
        if (userRepository.findByEmail("admin@angelascakes.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@angelascakes.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            log.info("Default admin user created.");
        }

        if (cakeTypeRepository.count() == 0) {
            List.of("Regular", "Birthday", "Cheesecake", "Wedding")
                    .forEach(name -> {
                        CakeType type = new CakeType();
                        type.setName(name);
                        cakeTypeRepository.save(type);
                    });
            log.info("Default cake types created.");
        }
    }
}