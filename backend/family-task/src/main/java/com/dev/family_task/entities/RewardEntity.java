package com.dev.family_task.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rewards")
@Data
@NoArgsConstructor
public class RewardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // ชื่อรางวัล เช่น "ไปกินชาบู", "เล่นเกมเพิ่ม 2 ชม."

    private String description;

    @Column(nullable = false)
    private Integer pointsRequired; // แต้มที่ต้องใช้แลก

    @ManyToOne
    @JoinColumn(name = "family_id", nullable = false)
    private FamilyEntity family; // รางวัลนี้เป็นของบ้านไหน
}