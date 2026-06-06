package com.dev.family_task.repositories;

import com.dev.family_task.entities.GroceryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GroceryRepository extends JpaRepository<GroceryEntity, Long> {
    List<GroceryEntity> findByFamilyId(Long familyId);
}