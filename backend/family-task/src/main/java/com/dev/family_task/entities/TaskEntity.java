package com.dev.family_task.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private FamilyEntity family;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private UserEntity assignedTo;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int points;

    private String status = "TODO"; // TODO, PENDING_REVIEW, COMPLETED

    @Column(name = "image_proof_url")
    private String imageProofUrl;

    @Column(name = "due_date")
    @Temporal(TemporalType.DATE) // บังคับให้เป็นแค่ วัน/เดือน/ปี เท่านั้น ไม่เอาเวลา
    private LocalDate dueDate;
}