package com.dev.family_task.services;

import com.dev.family_task.dto.Response.LeaderboardResponse;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;

    public List<LeaderboardResponse> getFamilyLeaderboard(String email) {
        // 1. หาว่าใครเป็นคนเรียก API และอยู่บ้านไหน
        UserEntity currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getFamily() == null) {
            throw new RuntimeException("You are not in any family");
        }

        // 2. ดึงสมาชิกทุกคนในบ้าน เรียงจากคะแนนมากไปน้อย (ใช้ Method ที่เราเพิ่งสร้าง)
        List<UserEntity> members = userRepository
                .findByFamilyIdOrderByTotalPointsDesc(currentUser.getFamily().getId());

        // 3. แปลงเป็น DTO พร้อมใส่ตัวเลขอันดับ (Rank)
        List<LeaderboardResponse> leaderboard = new ArrayList<>();
        int rank = 1;

        for (UserEntity member : members) {
            int points = member.getTotalPoints() == null ? 0 : member.getTotalPoints();

            leaderboard.add(LeaderboardResponse.builder()
                    .rank(rank++)
                    .fullName(member.getFullName())
                    .role(member.getRole().name())
                    .totalPoints(points)
                    .build());
        }

        return leaderboard;
    }
}