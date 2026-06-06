package com.dev.family_task.services;

import com.dev.family_task.entities.FamilyEntity;
import com.dev.family_task.entities.RoleEntity;
import com.dev.family_task.entities.SystemNotificationEntity;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;
    private final TaskRepository taskRepository;
    private final RewardRepository rewardRepository;
    private final SystemNotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepository.count();
        long parents = userRepository.findAll().stream().filter(u -> u.getRole() == RoleEntity.PARENT).count();
        long children = userRepository.findAll().stream().filter(u -> u.getRole() == RoleEntity.CHILD).count();
        long superAdmins = userRepository.findAll().stream().filter(u -> u.getRole() == RoleEntity.SUPER_ADMIN).count();
        long totalFamilies = familyRepository.count();
        long totalTasks = taskRepository.count();
        long totalRewards = rewardRepository.count();

        stats.put("totalUsers", totalUsers);
        stats.put("parents", parents);
        stats.put("children", children);
        stats.put("superAdmins", superAdmins);
        stats.put("totalFamilies", totalFamilies);
        stats.put("totalTasks", totalTasks);
        stats.put("totalRewards", totalRewards);
        return stats;
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public String toggleBanUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Cannot ban super admin
        if (user.getRole() == RoleEntity.SUPER_ADMIN) {
            throw new RuntimeException("Cannot ban Super Admin");
        }

        user.setBanned(!user.isBanned());
        userRepository.save(user);
        return user.isBanned() ? "User has been banned." : "User ban has been lifted.";
    }

    @Transactional
    public String forcePasswordReset(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String newPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return newPassword; // Return new password directly to admin
    }

    public List<FamilyEntity> getAllFamilies() {
        return familyRepository.findAll();
    }

    @Transactional
    public void deleteFamily(Long familyId) {
        // Need to delete tasks, rewards, groceries first if cascaded not fully covering or we just delete.
        // Assuming CascadeType.ALL handles members, but tasks/rewards/groceries might need explicit deletion if mapped differently.
        familyRepository.deleteById(familyId);
    }

    @Transactional
    public void broadcastMessage(String title, String message, String targetRole) {
        SystemNotificationEntity notif = new SystemNotificationEntity();
        notif.setTitle(title);
        notif.setMessage(message);
        notif.setTargetRole(targetRole);
        notificationRepository.save(notif);
    }

    public List<SystemNotificationEntity> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<com.dev.family_task.entities.TaskEntity> getAllTasks() {
        return taskRepository.findAll();
    }

    @Transactional
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public List<com.dev.family_task.entities.RewardEntity> getAllRewards() {
        return rewardRepository.findAll();
    }

    @Transactional
    public void deleteReward(Long rewardId) {
        rewardRepository.deleteById(rewardId);
    }
}
