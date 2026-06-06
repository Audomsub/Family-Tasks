package com.dev.family_task.dto.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private int totalMembers;      // จำนวนสมาชิกในบ้าน
    private int pendingTasks;      // งานที่ยังไม่มีคนทำ หรือกำลังทำ (PENDING)
    private int tasksToApprove;    // งานที่ลูกส่งมาแล้ว รอพ่อแม่ตรวจ (SUBMITTED)
    private int availableRewards;  // จำนวนของรางวัลทั้งหมด
}