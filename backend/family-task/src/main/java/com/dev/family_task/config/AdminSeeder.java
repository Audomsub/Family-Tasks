package com.dev.family_task.config;

import com.dev.family_task.entities.RoleEntity;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin2@family.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            UserEntity admin = new UserEntity();
            admin.setFullName("Super Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole(RoleEntity.SUPER_ADMIN);
            admin.setTotalPoints(0);
            
            userRepository.save(admin);
            System.out.println("========== SUPER ADMIN CREATED ==========");
            System.out.println("Email: " + adminEmail);
            System.out.println("Password: 123456");
            System.out.println("=========================================");
        }
    }
}
