package com.dev.family_task.repositories;

import com.dev.family_task.entities.SystemNotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemNotificationRepository extends JpaRepository<SystemNotificationEntity, Long> {
}
