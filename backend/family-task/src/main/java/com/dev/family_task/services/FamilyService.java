package com.dev.family_task.services;

import com.dev.family_task.dto.Response.FamilyResponse;
import com.dev.family_task.entities.FamilyEntity;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FamilyService {

    private final UserRepository userRepository;

    public FamilyResponse getFamilyDetails(String email) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FamilyEntity familyEntity = userEntity.getFamily();

        List<FamilyResponse.MemberDto> memberDtos = familyEntity.getMembers().stream()
                .map(m -> FamilyResponse.MemberDto.builder()
                        .id(m.getId())
                        .fullName(m.getFullName())
                        .email(m.getEmail())
                        .role(m.getRole().name())
                        .totalPoints(m.getTotalPoints())
                        .build())
                .toList();
        return FamilyResponse.builder()
                .familyId(familyEntity.getId())
                .familyName(familyEntity.getFamilyName())
                .inviteCode(familyEntity.getInviteCode())
                .member(memberDtos)
                .build();
    }

}
