package com.dev.family_task.controller;

import com.dev.family_task.dto.Request.TaskRequest;
import com.dev.family_task.dto.Response.TaskResponse;
import com.dev.family_task.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/task")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    private String getCurrentEmail() {
        return org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
    }

    @PostMapping()
    public ResponseEntity<Map<String, String>> createTask(@RequestBody TaskRequest request) {
        try {
            String message = taskService.createTask(getCurrentEmail(), request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks() {
        return ResponseEntity.ok(taskService.getFamilyTasks(getCurrentEmail()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        try {
            String message = taskService.updateTask(id, getCurrentEmail(), request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable Long id) {
        try {
            String message = taskService.deleteTask(id, getCurrentEmail());
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<Map<String, String>> submitTask(@PathVariable Long id) {
        try {
            String message = taskService.submitTask(id, getCurrentEmail());
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Map<String, String>> approveTask(@PathVariable Long id) {
        try {
            String message = taskService.approveTask(id, getCurrentEmail());
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Map<String, String>> rejectTask(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String comment = body.getOrDefault("comment", "");
            String message = taskService.rejectTask(id, getCurrentEmail(), comment);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
