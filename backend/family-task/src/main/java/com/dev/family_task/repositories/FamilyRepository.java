package com.dev.family_task.repositories;

import com.dev.family_task.entities.FamilyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface FamilyRepository extends JpaRepository<FamilyEntity, Long> {
    Optional<FamilyEntity> findByInviteCode(String inviteCode);
}