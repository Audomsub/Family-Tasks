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

    @PostMapping()
    public ResponseEntity<Map<String , String>> createTask(@RequestBody TaskRequest request) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        try {
            String message = taskService.createTask(email , request);
            Map<String , String> response = new HashMap<>();
            response.put("message" , message);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String , String> error = new HashMap<>();
            error.put("error" , e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // เพิ่มตัวนี้เข้าไปต่อจาก Method POST ครับ
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks() {
        // แกะ Email จาก Token อัตโนมัติ (ขอบคุณ Filter ที่เราทำไว้!)
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        return ResponseEntity.ok(taskService.getFamilyTasks(email));
    }


    @PatchMapping("/{id}/submit")
    public ResponseEntity<Map<String, String>> submitTask(@PathVariable Long id) {
        // ดึง Email คนที่กำลังล็อกอินจาก Token
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        try {
            String message = taskService.submitTask(id, email);
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage()); // ตรงนี้จะพ่น Error ภาษาอังกฤษที่เราตั้งไว้ออกไป
            return ResponseEntity.badRequest().body(error);
        }
    }



    @PatchMapping("/{id}/approve")
    public ResponseEntity<Map<String, String>> approveTask(@PathVariable Long id) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        try {
            String message = taskService.approveTask(id, email);
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
