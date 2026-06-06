package com.dev.family_task.dto.Request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private Integer points;
    private LocalDate dueDate;
    private Long assignee_Id; // ID ของลูกที่จะมอบหมาย (ถ้าไม่ส่งมาจะเป็นงานกลาง)
    private String recurrencePattern;
    private String parentComment;
}
