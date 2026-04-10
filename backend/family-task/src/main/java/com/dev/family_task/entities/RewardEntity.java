package com.dev.family_task.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rewards")
@Getter
@Setter
@NoArgsConstructor
public class RewardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private FamilyEntity family;

    @Column(nullable = false)
    private String title;

    @Column(name = "point_cost", nullable = false)
    private int pointCost;

    private int stock = -1; // -1 คือไม่จำกัด

    @Column(name = "image_url")
    private String imageUrl;
}