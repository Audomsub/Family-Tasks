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
    private final com.dev.family_task.repositories.FamilyRepository familyRepository;
    private final com.dev.family_task.repositories.PayoutRepository payoutRepository;
    private final com.dev.family_task.repositories.TaskRepository taskRepository;

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
                .allowanceRate(familyEntity.getAllowanceRate())
                .member(memberDtos)
                .build();
    }

    public void updateAllowanceRate(String email, Integer rate) {
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!"PARENT".equals(parent.getRole().name())) {
            throw new RuntimeException("Only PARENT can set allowance rate");
        }
        FamilyEntity family = parent.getFamily();
        if (family == null) throw new RuntimeException("Family not found");
        
        family.setAllowanceRate(rate);
        familyRepository.save(family);
    }

    public void executePayout(String email, Long childId, Integer pointsToDeduct, Double moneyPaid) {
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!"PARENT".equals(parent.getRole().name())) {
            throw new RuntimeException("Only PARENT can execute payout");
        }
        
        UserEntity child = userRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));
                
        int currentPoints = child.getTotalPoints() == null ? 0 : child.getTotalPoints();
        if (currentPoints < pointsToDeduct) {
            throw new RuntimeException("Child does not have enough points");
        }
        
        child.setTotalPoints(currentPoints - pointsToDeduct);
        userRepository.save(child);
        
        com.dev.family_task.entities.PayoutEntity payout = new com.dev.family_task.entities.PayoutEntity();
        payout.setFamily(parent.getFamily());
        payout.setParent(parent);
        payout.setChild(child);
        payout.setPointsDeducted(pointsToDeduct);
        payout.setMoneyPaid(moneyPaid);
        
        payoutRepository.save(payout);
    }

    public List<com.dev.family_task.entities.PayoutEntity> getPayoutHistory(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        FamilyEntity family = user.getFamily();
        if (family == null) return List.of();
        
        return payoutRepository.findByFamilyIdOrderByPayoutDateDesc(family.getId());
    }

    // Analytics: gather data from family members and tasks
    public java.util.Map<String, Object> getAnalytics(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        FamilyEntity family = user.getFamily();
        
        if (family == null) return java.util.Map.of();

        long totalPointsEarned = family.getMembers().stream()
                .filter(m -> "CHILD".equals(m.getRole().name()))
                .mapToLong(UserEntity::getTotalPoints)
                .sum();
                
        int totalTasks = taskRepository.countByFamilyId(family.getId());
        int approvedTasks = taskRepository.countByFamilyIdAndStatus(family.getId(), com.dev.family_task.constant.TaskStatus.APPROVED);
        int pendingTasks = taskRepository.countByFamilyIdAndStatus(family.getId(), com.dev.family_task.constant.TaskStatus.PENDING);
        int submittedTasks = taskRepository.countByFamilyIdAndStatus(family.getId(), com.dev.family_task.constant.TaskStatus.SUBMITTED);
        int rejectedTasks = taskRepository.countByFamilyIdAndStatus(family.getId(), com.dev.family_task.constant.TaskStatus.REJECTED);
        
        java.util.List<java.util.Map<String, Object>> memberStats = family.getMembers().stream()
                .filter(m -> "CHILD".equals(m.getRole().name()))
                .map(m -> java.util.Map.<String, Object>of(
                    "id", m.getId(),
                    "name", m.getFullName(),
                    "totalPoints", m.getTotalPoints() == null ? 0 : m.getTotalPoints(),
                    "currentPoints", m.getTotalPoints() == null ? 0 : m.getTotalPoints(),
                    "streak", m.getCurrentStreak() == null ? 0 : m.getCurrentStreak(),
                    "level", m.getLevel() == null ? 1 : m.getLevel()
                )).toList();

        return java.util.Map.of(
            "totalPointsEarned", totalPointsEarned,
            "childrenCount", family.getMembers().stream().filter(m -> "CHILD".equals(m.getRole().name())).count(),
            "tasks", java.util.Map.of(
                "total", totalTasks,
                "approved", approvedTasks,
                "pending", pendingTasks,
                "submitted", submittedTasks,
                "rejected", rejectedTasks
            ),
            "members", memberStats
        );
    }
}
