package com.dev.family_task.dto.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RewardResponse {
    private Long id;
    private String name;
    private String description;
    private Integer pointsRequired;
}