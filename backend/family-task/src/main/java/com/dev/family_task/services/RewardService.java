package com.dev.family_task.services;

import com.dev.family_task.dto.Request.RewardRequest;
import com.dev.family_task.dto.Response.RewardResponse;
import com.dev.family_task.entities.RewardEntity;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.repositories.RewardRepository;
import com.dev.family_task.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final UserRepository userRepository;

    public String createReward(String email, RewardRequest request) {
        // 1. หาข้อมูลพ่อแม่ที่กำลังจะสร้างรางวัล
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. ตรวจสอบสิทธิ์ (ต้องเป็น PARENT เท่านั้น)
        if (!parent.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only parents can create rewards");
        }

        // 3. สร้างของรางวัลใหม่ผูกกับบ้านนี้
        RewardEntity reward = new RewardEntity();
        reward.setName(request.getName());
        reward.setDescription(request.getDescription());
        reward.setPointsRequired(request.getPointsRequired());
        reward.setFamily(parent.getFamily());

        rewardRepository.save(reward);

        return "Reward created successfully!";
    }



    // --- 1. Method สำหรับดึงรายการของรางวัลทั้งหมดในบ้าน ---
    public List<RewardResponse> getFamilyRewards(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getFamily() == null) {
            throw new RuntimeException("You are not in any family");
        }

        List<RewardEntity> rewards = rewardRepository.findByFamilyId(user.getFamily().getId());

        return rewards.stream().map(r -> RewardResponse.builder()
                .id(r.getId())
                .name(r.getName())
                .description(r.getDescription())
                .pointsRequired(r.getPointsRequired())
                .build()
        ).toList();
    }

    // --- 2. Method สำหรับลูกกดแลกของรางวัล ---
    @Transactional
    public String redeemReward(Long rewardId, String email) {
        // 1. หาข้อมูลลูกที่กดแลก
        UserEntity child = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. เช็คว่าเป็นลูกจริงๆ ใช่ไหม (พ่อแม่ห้ามแย่งแลก!)
        if (!child.getRole().name().equals("CHILD")) {
            throw new RuntimeException("Only children can redeem rewards");
        }

        // 3. หาของรางวัลเป้าหมาย
        RewardEntity reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new RuntimeException("Reward not found"));

        // 4. เช็คว่าเป็นของรางวัลในบ้านตัวเองไหม
        if (!reward.getFamily().getId().equals(child.getFamily().getId())) {
            throw new RuntimeException("You cannot redeem a reward from another family");
        }

        // 5. เช็คแต้มว่าพอไหม
        int currentPoints = child.getTotalPoints() == null ? 0 : child.getTotalPoints();
        if (currentPoints < reward.getPointsRequired()) {
            throw new RuntimeException("Not enough points to redeem this reward");
        }

        // 6. หักแต้ม!
        child.setTotalPoints(currentPoints - reward.getPointsRequired());
        userRepository.save(child);

        // หมายเหตุ: ในระบบที่ใหญ่กว่านี้ เราอาจจะสร้างตาราง RedemptionHistory
        // เพื่อเก็บประวัติว่าใครแลกอะไรไปบ้าง แต่นี่เราเอาแบบหักแต้มจบในตัวก่อนครับ

        return "Reward redeemed successfully! Remaining points: " + child.getTotalPoints();
    }
}