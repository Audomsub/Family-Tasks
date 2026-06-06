package com.dev.family_task.dto.Response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private Integer points;
    private LocalDate dueDate;
    private String status;
    private String assigneeName;
}
