package com.dev.family_task.repositories;

import com.dev.family_task.entities.RewardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RewardRepository extends JpaRepository<RewardEntity, Long> {
    List<RewardEntity> findByFamilyId(Long familyId); // ดึงรางวัลทั้งหมดของบ้านนี้

    // เพิ่มบรรทัดนี้
    int countByFamilyId(Long familyId);
}