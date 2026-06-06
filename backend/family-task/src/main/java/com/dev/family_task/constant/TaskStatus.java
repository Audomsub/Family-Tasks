package com.dev.family_task.constant;

public enum TaskStatus {
    PENDING,    // รอดำเนินการ/รอคนมาหยิบ
    IN_PROGRESS, // กำลังทำ
    SUBMITTED,   // ส่งงานแล้ว (รอพ่อแม่อนุมัติ)
    APPROVED,    // อนุมัติแล้ว (แต้มเด้งเข้ากระเป๋า)
    REJECTED     // ตีกลับให้ทำใหม่
}