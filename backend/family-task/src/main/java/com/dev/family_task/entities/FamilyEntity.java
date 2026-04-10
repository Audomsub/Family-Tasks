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

    @Column(name = "created_at", insertable = false, updatable = false)
    private ZonedDateTime createdAt;

    // เชื่อมไปยังสมาชิกในบ้าน
    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL)
    private List<UserEntity> members;
}
