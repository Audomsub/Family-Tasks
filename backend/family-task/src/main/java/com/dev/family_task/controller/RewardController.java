package com.dev.family_task.controller;

import com.dev.family_task.dto.Request.RewardRequest;
import com.dev.family_task.dto.Response.RewardResponse;
import com.dev.family_task.services.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @PostMapping
    public ResponseEntity<Map<String, String>> createReward(@RequestBody RewardRequest request) {
        // แกะ Email อัตโนมัติจาก Token
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        try {
            String message = rewardService.createReward(email, request);
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }



    @GetMapping
    public ResponseEntity<List<RewardResponse>> getRewards() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        return ResponseEntity.ok(rewardService.getFamilyRewards(email));
    }

    @PostMapping("/{id}/redeem")
    public ResponseEntity<Map<String, String>> redeemReward(@PathVariable Long id) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        try {
            String message = rewardService.redeemReward(id, email);
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}