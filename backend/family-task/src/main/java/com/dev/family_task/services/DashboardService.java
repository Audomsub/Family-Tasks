package com.dev.family_task.services;

import com.dev.family_task.dto.Response.DashboardResponse;
import com.dev.family_task.constant.TaskStatus;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.repositories.RewardRepository;
import com.dev.family_task.repositories.TaskRepository;
import com.dev.family_task.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final RewardRepository rewardRepository;

    public DashboardResponse getFamilySummary(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getFamily() == null) {
            throw new RuntimeException("You are not in any family");
        }

        Long familyId = user.getFamily().getId();

        // นับจำนวนข้อมูลต่างๆ ด้วย familyId
        int totalMembers = userRepository.countByFamilyId(familyId);
        int pendingTasks = taskRepository.countByFamilyIdAndStatus(familyId, TaskStatus.PENDING);
        int tasksToApprove = taskRepository.countByFamilyIdAndStatus(familyId, TaskStatus.SUBMITTED);
        int availableRewards = rewardRepository.countByFamilyId(familyId);

        return DashboardResponse.builder()
                .totalMembers(totalMembers)
                .pendingTasks(pendingTasks)
                .tasksToApprove(tasksToApprove)
                .availableRewards(availableRewards)
                .build();
    }
}