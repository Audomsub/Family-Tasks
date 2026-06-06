package com.dev.family_task.controller;

import com.dev.family_task.dto.Response.FamilyResponse;
import com.dev.family_task.services.FamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
public class FamilyController {

    private final FamilyService familyService;

    @GetMapping("/me")
    public ResponseEntity<FamilyResponse> getFamily() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        return ResponseEntity.ok(familyService.getFamilyDetails(email));
    }

    @org.springframework.web.bind.annotation.PatchMapping("/allowance-rate")
    public ResponseEntity<String> updateAllowanceRate(@org.springframework.web.bind.annotation.RequestBody java.util.Map<String, Integer> payload) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        familyService.updateAllowanceRate(email, payload.get("rate"));
        return ResponseEntity.ok("Allowance rate updated");
    }

    @org.springframework.web.bind.annotation.PostMapping("/payout")
    public ResponseEntity<String> executePayout(@org.springframework.web.bind.annotation.RequestBody java.util.Map<String, Object> payload) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        Long childId = Long.valueOf(payload.get("childId").toString());
        Integer points = Integer.valueOf(payload.get("points").toString());
        Double money = Double.valueOf(payload.get("money").toString());
        familyService.executePayout(email, childId, points, money);
        return ResponseEntity.ok("Payout executed");
    }

    @GetMapping("/payout-history")
    public ResponseEntity<java.util.List<com.dev.family_task.entities.PayoutEntity>> getPayoutHistory() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        return ResponseEntity.ok(familyService.getPayoutHistory(email));
    }

    @GetMapping("/analytics")
    public ResponseEntity<java.util.Map<String, Object>> getAnalytics() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        return ResponseEntity.ok(familyService.getAnalytics(email));
    }
}
