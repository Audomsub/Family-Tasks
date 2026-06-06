package com.dev.family_task.controller;

import com.dev.family_task.entities.FamilyEntity;
import com.dev.family_task.entities.SystemNotificationEntity;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.services.AdminService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/ban")
    public ResponseEntity<String> toggleBanUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleBanUser(id));
    }

    @PatchMapping("/users/{id}/reset-password")
    public ResponseEntity<String> resetPassword(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.forcePasswordReset(id));
    }

    @GetMapping("/families")
    public ResponseEntity<List<FamilyEntity>> getAllFamilies() {
        return ResponseEntity.ok(adminService.getAllFamilies());
    }

    @DeleteMapping("/families/{id}")
    public ResponseEntity<String> deleteFamily(@PathVariable Long id) {
        adminService.deleteFamily(id);
        return ResponseEntity.ok("Family deleted successfully.");
    }

    @PostMapping("/broadcast")
    public ResponseEntity<String> broadcast(@RequestBody BroadcastRequest request) {
        adminService.broadcastMessage(request.getTitle(), request.getMessage(), request.getTargetRole());
        return ResponseEntity.ok("Message broadcasted successfully.");
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<SystemNotificationEntity>> getAllNotifications() {
        return ResponseEntity.ok(adminService.getAllNotifications());
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<com.dev.family_task.entities.TaskEntity>> getAllTasks() {
        return ResponseEntity.ok(adminService.getAllTasks());
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        adminService.deleteTask(id);
        return ResponseEntity.ok("Task deleted successfully.");
    }

    @GetMapping("/rewards")
    public ResponseEntity<List<com.dev.family_task.entities.RewardEntity>> getAllRewards() {
        return ResponseEntity.ok(adminService.getAllRewards());
    }

    @DeleteMapping("/rewards/{id}")
    public ResponseEntity<String> deleteReward(@PathVariable Long id) {
        adminService.deleteReward(id);
        return ResponseEntity.ok("Reward deleted successfully.");
    }

    @Data
    public static class BroadcastRequest {
        private String title;
        private String message;
        private String targetRole;
    }
}
