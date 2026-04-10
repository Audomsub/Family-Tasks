package com.dev.family_task.dto.Response;

import lombok.Builder;
import lombok.Data;

import java.lang.reflect.Member;
import java.util.List;

@Data
@Builder
public class FamilyResponse {
    private Long familyId;

    private String familyName;

    private String inviteCode;

    private List<MemberDto> member;

    @Data
    @Builder
    public static class MemberDto {
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private Integer totalPoints;
    }
}

