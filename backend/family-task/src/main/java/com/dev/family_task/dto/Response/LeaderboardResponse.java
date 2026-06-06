package com.dev.family_task.dto.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaderboardResponse {
    private Integer rank;       // อันดับ
    private String fullName;    // ชื่อ
    private String role;        // ตำแหน่ง (เผื่อลูกอยากขิงพ่อแม่ว่าแต้มเยอะกว่า)
    private Integer totalPoints;// แต้มรวม
}