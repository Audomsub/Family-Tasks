package com.dev.family_task.repositories;

import com.dev.family_task.constant.TaskStatus;
import com.dev.family_task.entities.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    // ดึงงานทั้งหมดของบ้านตัวเอง
    List<TaskEntity> findByFamilyId(Long familyId);

    // ดึงงานเฉพาะที่มอบหมายให้เรา
    List<TaskEntity> findByAssignedToId(Long userId);

    int countByFamilyIdAndStatus(Long familyId, TaskStatus status);

    // เพิ่มบรรทัดนี้
    int countByFamilyId(Long familyId);
}