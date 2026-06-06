package com.dev.family_task.services;


import com.dev.family_task.constant.TaskStatus;
import com.dev.family_task.dto.Request.TaskRequest;
import com.dev.family_task.dto.Response.TaskResponse;
import com.dev.family_task.entities.TaskEntity;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.repositories.TaskRepository;
import com.dev.family_task.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional
    public String createTask(String email, TaskRequest request) {
        UserEntity creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("user not found"));
        if (!creator.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only the head of the family can give orders.");
        }
        TaskEntity task = new TaskEntity();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPoints(request.getPoints());
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.PENDING);
        task.setFamily(creator.getFamily());
        task.setRecurrencePattern(request.getRecurrencePattern());

        if (request.getAssignee_Id() != null) {
            UserEntity assignee = userRepository.findById(request.getAssignee_Id())
                    .orElseThrow(() -> new RuntimeException("No member found to assign"));
            task.setAssignedTo(assignee);
        }
        taskRepository.save(task);
        return "Task created successfully!";
    }

    public List<TaskResponse> getFamilyTasks(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getFamily() == null) {
            throw new RuntimeException("You are not in any family");
        }

        List<TaskEntity> tasks = taskRepository.findByFamilyId(user.getFamily().getId());

        return tasks.stream().map(task -> TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .points(task.getPoints())
                .dueDate(task.getDueDate())
                .status(task.getStatus().name())
                .assigneeName(task.getAssignedTo() != null ? task.getAssignedTo().getFullName() : null)
                .recurrencePattern(task.getRecurrencePattern())
                .parentComment(task.getParentComment())
                .build()
        ).toList();
    }

    @Transactional
    public String updateTask(Long taskId, String email, TaskRequest request) {
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!parent.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only parents can edit tasks");
        }

        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getFamily().getId().equals(parent.getFamily().getId())) {
            throw new RuntimeException("You do not have permission to edit this task");
        }

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPoints() != null) task.setPoints(request.getPoints());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getRecurrencePattern() != null) task.setRecurrencePattern(request.getRecurrencePattern());

        if (request.getAssignee_Id() != null) {
            UserEntity assignee = userRepository.findById(request.getAssignee_Id())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignedTo(assignee);
        }

        taskRepository.save(task);
        return "Task updated successfully!";
    }

    @Transactional
    public String deleteTask(Long taskId, String email) {
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!parent.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only parents can delete tasks");
        }

        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getFamily().getId().equals(parent.getFamily().getId())) {
            throw new RuntimeException("You do not have permission to delete this task");
        }

        taskRepository.delete(task);
        return "Task deleted successfully!";
    }

    @Transactional
    public String submitTask(Long taskId, String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getFamily().getId().equals(user.getFamily().getId())) {
            throw new RuntimeException("You do not have permission to access tasks of another family");
        }

        if (task.getAssignedTo() != null && !task.getAssignedTo().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot submit a task assigned to someone else");
        }

        if (task.getStatus() != TaskStatus.PENDING && task.getStatus() != TaskStatus.REJECTED) {
            throw new RuntimeException("Cannot submit this task. Current status: " + task.getStatus());
        }

        task.setStatus(TaskStatus.SUBMITTED);
        taskRepository.save(task);

        return "Task submitted successfully! Waiting for parent's approval.";
    }

    @Transactional
    public String rejectTask(Long taskId, String email, String comment) {
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!parent.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only parents can reject tasks");
        }

        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getFamily().getId().equals(parent.getFamily().getId())) {
            throw new RuntimeException("You do not have permission to access tasks of another family");
        }

        if (task.getStatus() != TaskStatus.SUBMITTED) {
            throw new RuntimeException("Task is not ready for review. Current status: " + task.getStatus());
        }

        task.setStatus(TaskStatus.REJECTED);
        task.setParentComment(comment);
        taskRepository.save(task);

        return "Task rejected successfully.";
    }

    @Transactional
    public String approveTask(Long taskId, String email) {
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!parent.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only parents can approve tasks");
        }

        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getFamily().getId().equals(parent.getFamily().getId())) {
            throw new RuntimeException("You do not have permission to access tasks of another family");
        }

        if (task.getStatus() != TaskStatus.SUBMITTED) {
            throw new RuntimeException("Task is not ready for approval. Current status: " + task.getStatus());
        }

        task.setStatus(TaskStatus.APPROVED);

        if (task.getAssignedTo() != null) {
            UserEntity child = task.getAssignedTo();
            
            // Streak logic
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDate lastDate = child.getLastTaskDate();
            if (lastDate != null) {
                if (lastDate.equals(today)) {
                    // Already did a task today, streak unchanged
                } else if (lastDate.equals(today.minusDays(1))) {
                    // Did a task yesterday, increment streak
                    child.setCurrentStreak((child.getCurrentStreak() == null ? 0 : child.getCurrentStreak()) + 1);
                } else {
                    // Missed a day or more, reset streak
                    child.setCurrentStreak(1);
                }
            } else {
                child.setCurrentStreak(1); // First task ever
            }
            child.setLastTaskDate(today);

            // Points & Level logic
            int currentPoints = child.getTotalPoints() == null ? 0 : child.getTotalPoints();
            currentPoints += task.getPoints();
            child.setTotalPoints(currentPoints);
            child.setLevel(currentPoints / 100 + 1);

            userRepository.save(child);
        }

        taskRepository.save(task);

        // Recurring logic
        if (task.getRecurrencePattern() != null && !task.getRecurrencePattern().isEmpty() && !task.getRecurrencePattern().equals("NONE")) {
            TaskEntity newTask = new TaskEntity();
            newTask.setTitle(task.getTitle());
            newTask.setDescription(task.getDescription());
            newTask.setPoints(task.getPoints());
            newTask.setStatus(TaskStatus.PENDING);
            newTask.setFamily(task.getFamily());
            newTask.setAssignedTo(task.getAssignedTo());
            newTask.setRecurrencePattern(task.getRecurrencePattern());
            
            if (task.getDueDate() != null) {
                if (task.getRecurrencePattern().equals("DAILY")) {
                    newTask.setDueDate(task.getDueDate().plusDays(1));
                } else if (task.getRecurrencePattern().equals("WEEKLY")) {
                    newTask.setDueDate(task.getDueDate().plusWeeks(1));
                } else if (task.getRecurrencePattern().equals("MONTHLY")) {
                    newTask.setDueDate(task.getDueDate().plusMonths(1));
                }
            }
            taskRepository.save(newTask);
        }

        return "Task approved successfully! Points and streaks have been awarded.";
    }
}