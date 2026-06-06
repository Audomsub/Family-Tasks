package com.dev.family_task.dto.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GroceryResponse {
    private Long id;
    private String name;
    private boolean isPurchased;
    private String addedByName;
}