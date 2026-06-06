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
    public String createTask(String email , TaskRequest request) {
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

        if (request.getAssignee_Id() != null) {
            UserEntity assignee = userRepository.findById(request.getAssignee_Id())
                    .orElseThrow(() -> new RuntimeException("No member found to assign"));
            task.setAssignedTo(assignee);
        }
        taskRepository.save(task);
        return "create home succeses";
    }


    // เพิ่ม Method นี้ต่อจาก createTask เลยครับ
    public List<TaskResponse> getFamilyTasks(String email) {
        // 1. หาว่าคนที่ Login คือใคร และอยู่บ้านไหน
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบข้อมูลผู้ใช้งาน"));

        if (user.getFamily() == null) {
            throw new RuntimeException("คุณยังไม่ได้เข้าร่วมครอบครัวใดๆ");
        }

        // 2. ดึงงานทั้งหมดของบ้านนี้ (ใช้ Method ที่เราเขียนไว้ใน TaskRepository)
        List<TaskEntity> tasks = taskRepository.findByFamilyId(user.getFamily().getId());

        // 3. แปลง Entity เป็น DTO เพื่อส่งกลับ
        return tasks.stream().map(task -> TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .points(task.getPoints())
                .dueDate(task.getDueDate())
                .status(task.getStatus().name())
                // เช็คว่ามีคนรับผิดชอบหรือยัง ถ้าไม่มีให้ขึ้นว่า "งานกองกลาง"
                .assigneeName(task.getAssignedTo() != null ? task.getAssignedTo().getFullName() : "งานกองกลาง")
                .build()
        ).toList();
    }



    @Transactional
    public String submitTask(Long taskId, String email) {
        // 1. หาข้อมูลลูกที่กดส่งงาน
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. หางานเป้าหมาย
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // 3. ตรวจสอบว่าเป็นงานในบ้านเดียวกันหรือไม่
        if (!task.getFamily().getId().equals(user.getFamily().getId())) {
            throw new RuntimeException("You do not have permission to access tasks of another family");
        }

        // 4. ตรวจสอบว่าเป็นงานของคนนี้จริงๆ หรือไม่ (ถ้ามีการระบุ Assignee ไว้)
        if (task.getAssignedTo() != null && !task.getAssignedTo().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot submit a task assigned to someone else");
        }

        // 5. ตรวจสอบสถานะว่าส่งได้ไหม (ต้องเป็น PENDING)
        if (task.getStatus() != TaskStatus.PENDING) {
            throw new RuntimeException("Cannot submit this task. Current status: " + task.getStatus());
        }

        // 6. เปลี่ยนสถานะเป็น SUBMITTED (รอพ่อแม่ตรวจ)
        task.setStatus(TaskStatus.SUBMITTED);
        taskRepository.save(task);

        return "Task submitted successfully! Waiting for parent's approval.";
    }


    @Transactional
    public String approveTask(Long taskId, String email) {
        // 1. หาข้อมูลผู้ใช้งาน (คาดหวังว่าเป็นพ่อแม่)
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. ตรวจสอบสิทธิ์ว่าต้องเป็น PARENT เท่านั้น
        if (!parent.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only parents can approve tasks");
        }

        // 3. หางานเป้าหมาย
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // 4. ตรวจสอบว่าเป็นงานของบ้านตัวเองหรือไม่
        if (!task.getFamily().getId().equals(parent.getFamily().getId())) {
            throw new RuntimeException("You do not have permission to access tasks of another family");
        }

        // 5. สถานะต้องเป็น SUBMITTED (ส่งงานแล้ว) ถึงจะอนุมัติได้
        if (task.getStatus() != TaskStatus.SUBMITTED) {
            throw new RuntimeException("Task is not ready for approval. Current status: " + task.getStatus());
        }

        // 6. เปลี่ยนสถานะเป็น APPROVED
        task.setStatus(TaskStatus.APPROVED);

        // 7. โอนแต้มให้ลูก (Assignee)
        if (task.getAssignedTo() != null) {
            UserEntity child = task.getAssignedTo();
            // ป้องกันกรณีแต้มเดิมเป็น null ให้มองเป็น 0
            int currentPoints = child.getTotalPoints() == null ? 0 : child.getTotalPoints();
            child.setTotalPoints(currentPoints + task.getPoints());

            userRepository.save(child); // บันทึกแต้มใหม่ของลูก
        }

        taskRepository.save(task); // บันทึกสถานะงานใหม่

        return "Task approved successfully! Points have been awarded to the assignee.";
    }
}