package com.dev.family_task.services;

import com.dev.family_task.config.SecurityConfig;
import com.dev.family_task.dto.Request.LoginRequest;
import com.dev.family_task.dto.Request.RegisterRequest;
import com.dev.family_task.entities.FamilyEntity;
import com.dev.family_task.entities.RoleEntity;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.repositories.FamilyRepository;
import com.dev.family_task.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public String registerFamily(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("email already exists!");
        }
        
        FamilyEntity familyEntity = new FamilyEntity();
        familyEntity.setFamilyName(request.getFamilyName());
        familyEntity.setInviteCode(UUID.randomUUID().toString().substring(0 , 8).toUpperCase());
        familyEntity = familyRepository.save(familyEntity);

        UserEntity userEntity = new UserEntity();
        userEntity.setFullName(request.getFullName());
        userEntity.setEmail(request.getEmail());
        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
        userEntity.setRole(RoleEntity.PARENT);
        userEntity.setFamily(familyEntity);
        userEntity.setTotalPoints(0);
        userRepository.save(userEntity);
        return "Register successful? Invite code : " + familyEntity.getInviteCode();
    }

    public String login(LoginRequest request) {
        UserEntity userEntity = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("no user"));

        if (!passwordEncoder.matches(request.getPassword() , userEntity.getPassword())) {
            throw new RuntimeException("password invalid");
        }
        return jwtService.generateToken(userEntity.getEmail());
    }

    @Transactional
    public String joinFamily(String email , String invitCode) {
        FamilyEntity familyEntity = familyRepository.findByInviteCode(invitCode)
                .orElseThrow(() -> new RuntimeException("invite code invalid"));

        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

//        if (userEntity.getFamily() != null) {
//            throw new RuntimeException("You are already of another family");
//        }

        userEntity.setFamily(familyEntity);
        userEntity.setRole(RoleEntity.CHILD);
        userRepository.save(userEntity);

        return "Welcome to family : " + familyEntity.getFamilyName();
    }
}
