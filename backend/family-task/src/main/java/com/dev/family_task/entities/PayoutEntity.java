package com.dev.family_task.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;

@Entity
@Table(name = "payouts")
@Getter
@Setter
@NoArgsConstructor
public class PayoutEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id", nullable = false)
    private FamilyEntity family;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    private UserEntity parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private UserEntity child;

    @Column(name = "points_deducted", nullable = false)
    private Integer pointsDeducted;

    @Column(name = "money_paid", nullable = false)
    private Double moneyPaid;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "payout_date", updatable = false)
    private ZonedDateTime payoutDate;
}
