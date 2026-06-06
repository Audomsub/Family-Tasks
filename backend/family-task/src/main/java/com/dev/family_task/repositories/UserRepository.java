package com.dev.family_task.repositories;

import com.dev.family_task.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    List<UserEntity> findByFamilyIdOrderByTotalPointsDesc(Long familyId);
    int countByFamilyId(Long familyId);
}