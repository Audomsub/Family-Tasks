package com.dev.family_task.repositories;

import com.dev.family_task.entities.PayoutEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayoutRepository extends JpaRepository<PayoutEntity, Long> {
    List<PayoutEntity> findByFamilyIdOrderByPayoutDateDesc(Long familyId);
}
