package com.dev.family_task.dto.Request;

import lombok.Data;

@Data
public class RewardRequest {
    private String name;
    private String description;
    private Integer pointsRequired;
}