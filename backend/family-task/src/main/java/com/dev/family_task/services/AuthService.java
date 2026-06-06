package com.dev.family_task.services;

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

        // ตรวจสอบ role ที่ส่งมา (ถ้าไม่ส่งให้ default เป็น PARENT)
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "PARENT";

        UserEntity userEntity = new UserEntity();
        userEntity.setFullName(request.getFullName());
        userEntity.setEmail(request.getEmail());
        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
        userEntity.setTotalPoints(0);

        if ("CHILD".equals(role)) {
            // CHILD: ต้องมี inviteCode เพื่อ join family โดยตรงในขั้นตอนเดียว
            if (request.getInviteCode() == null || request.getInviteCode().isBlank()) {
                throw new RuntimeException("Invite code is required for children!");
            }
            FamilyEntity familyEntity = familyRepository.findByInviteCode(request.getInviteCode())
                    .orElseThrow(() -> new RuntimeException("Invalid invite code. Ask your parents for the correct code!"));

            userEntity.setRole(RoleEntity.CHILD);
            userEntity.setFamily(familyEntity);
            userRepository.save(userEntity);
            return "Welcome to family: " + familyEntity.getFamilyName() + "! 🎉";
        } else {
            // PARENT: สร้างครอบครัวใหม่พร้อมกัน
            if (request.getFamilyName() == null || request.getFamilyName().isBlank()) {
                throw new RuntimeException("Family name is required for parents!");
            }
            FamilyEntity familyEntity = new FamilyEntity();
            familyEntity.setFamilyName(request.getFamilyName());
            familyEntity.setInviteCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            familyEntity = familyRepository.save(familyEntity);

            userEntity.setRole(RoleEntity.PARENT);
            userEntity.setFamily(familyEntity);
            userRepository.save(userEntity);
            return "Register successful! Invite code: " + familyEntity.getInviteCode();
        }
    }

    public String login(LoginRequest request) {
        UserEntity userEntity = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("no user"));

        if (!passwordEncoder.matches(request.getPassword(), userEntity.getPassword())) {
            throw new RuntimeException("password invalid");
        }
        return jwtService.generateToken(userEntity.getEmail());
    }

    @Transactional
    public String joinFamily(String email, String inviteCode) {
        FamilyEntity familyEntity = familyRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("invite code invalid"));

        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userEntity.setFamily(familyEntity);
        userEntity.setRole(RoleEntity.CHILD);
        userRepository.save(userEntity);

        return "Welcome to family: " + familyEntity.getFamilyName();
    }

    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public String deductPoints(Long childId, String parentEmail, int pointsToDeduct) {
        UserEntity parent = userRepository.findByEmail(parentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!parent.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only parents can deduct points");
        }
        UserEntity child = userRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        if (!child.getFamily().getId().equals(parent.getFamily().getId())) {
            throw new RuntimeException("Cannot deduct points from a child in another family");
        }
        
        int currentPoints = child.getTotalPoints() == null ? 0 : child.getTotalPoints();
        child.setTotalPoints(Math.max(0, currentPoints - pointsToDeduct)); // Don't let points go negative
        userRepository.save(child);
        return "Deducted " + pointsToDeduct + " points from " + child.getFullName();
    }

    @Transactional
    public String updateAvatar(String email, String avatarUrl) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        return "Avatar updated successfully";
    }
}
