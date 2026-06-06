package com.dev.family_task.controller;

import com.dev.family_task.dto.Request.GroceryRequest;
import com.dev.family_task.dto.Response.GroceryResponse;
import com.dev.family_task.services.GroceryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groceries")
@RequiredArgsConstructor
public class GroceryController {

    private final GroceryService groceryService;

    @GetMapping
    public ResponseEntity<List<GroceryResponse>> getGroceries() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        return ResponseEntity.ok(groceryService.getFamilyGroceries(email));
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> addItem(@RequestBody GroceryRequest request) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        String message = groceryService.addGroceryItem(email, request);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Map<String, String>> toggleItem(@PathVariable Long id) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        try {
            String message = groceryService.togglePurchasedStatus(id, email);
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