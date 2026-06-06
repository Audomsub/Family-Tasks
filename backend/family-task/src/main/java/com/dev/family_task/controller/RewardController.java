package com.dev.family_task.controller;

import com.dev.family_task.dto.Request.RewardRequest;
import com.dev.family_task.dto.Response.RewardResponse;
import com.dev.family_task.services.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    private String getCurrentEmail() {
        return org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createReward(@RequestBody RewardRequest request) {
        try {
            String message = rewardService.createReward(getCurrentEmail(), request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<RewardResponse>> getRewards() {
        return ResponseEntity.ok(rewardService.getFamilyRewards(getCurrentEmail()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateReward(@PathVariable Long id, @RequestBody RewardRequest request) {
        try {
            String message = rewardService.updateReward(id, getCurrentEmail(), request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteReward(@PathVariable Long id) {
        try {
            String message = rewardService.deleteReward(id, getCurrentEmail());
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/redeem")
    public ResponseEntity<Map<String, String>> redeemReward(@PathVariable Long id) {
        try {
            String message = rewardService.redeemReward(id, getCurrentEmail());
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}