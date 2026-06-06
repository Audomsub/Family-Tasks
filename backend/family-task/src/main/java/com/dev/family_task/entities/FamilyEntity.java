package com.dev.family_task.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.List;

@Entity
@Table(name = "families")
@Getter
@Setter
@NoArgsConstructor
public class FamilyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "family_name", nullable = false)
    private String familyName;

    @Column(name = "invite_code", unique = true, nullable = false)
    private String inviteCode;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "allowance_rate")
    private Integer allowanceRate = 10; // Default 10 stars = 1 unit

    // เชื่อมไปยังสมาชิกในบ้าน
    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<UserEntity> members;
}
