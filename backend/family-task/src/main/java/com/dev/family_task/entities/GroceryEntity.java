package com.dev.family_task.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "groceries")
@Data
@NoArgsConstructor
public class GroceryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // ชื่อของที่ต้องซื้อ เช่น "นมสด 2 ขวด"

    private boolean isPurchased = false; // สถานะว่าซื้อหรือยัง (ค่าเริ่มต้นคือยังไม่ซื้อ)

    @ManyToOne
    @JoinColumn(name = "family_id", nullable = false)
    private FamilyEntity family;

    @ManyToOne
    @JoinColumn(name = "added_by_id")
    private UserEntity addedBy; // ใครเป็นคนจด
}