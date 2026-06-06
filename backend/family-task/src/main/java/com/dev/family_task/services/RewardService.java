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
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!parent.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only parents can create rewards");
        }

        RewardEntity reward = new RewardEntity();
        reward.setName(request.getName());
        reward.setDescription(request.getDescription());
        reward.setPointsRequired(request.getPointsRequired());
        reward.setFamily(parent.getFamily());

        rewardRepository.save(reward);
        return "Reward created successfully!";
    }

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

    @Transactional
    public String updateReward(Long rewardId, String email, RewardRequest request) {
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!parent.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only parents can edit rewards");
        }

        RewardEntity reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new RuntimeException("Reward not found"));

        if (!reward.getFamily().getId().equals(parent.getFamily().getId())) {
            throw new RuntimeException("You do not have permission to edit this reward");
        }

        if (request.getName() != null) reward.setName(request.getName());
        if (request.getDescription() != null) reward.setDescription(request.getDescription());
        if (request.getPointsRequired() != null) reward.setPointsRequired(request.getPointsRequired());

        rewardRepository.save(reward);
        return "Reward updated successfully!";
    }

    @Transactional
    public String deleteReward(Long rewardId, String email) {
        UserEntity parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!parent.getRole().name().equals("PARENT")) {
            throw new RuntimeException("Only parents can delete rewards");
        }

        RewardEntity reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new RuntimeException("Reward not found"));

        if (!reward.getFamily().getId().equals(parent.getFamily().getId())) {
            throw new RuntimeException("You do not have permission to delete this reward");
        }

        rewardRepository.delete(reward);
        return "Reward deleted successfully!";
    }

    @Transactional
    public String redeemReward(Long rewardId, String email) {
        UserEntity child = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!child.getRole().name().equals("CHILD")) {
            throw new RuntimeException("Only children can redeem rewards");
        }

        RewardEntity reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new RuntimeException("Reward not found"));

        if (!reward.getFamily().getId().equals(child.getFamily().getId())) {
            throw new RuntimeException("You cannot redeem a reward from another family");
        }

        int currentPoints = child.getTotalPoints() == null ? 0 : child.getTotalPoints();
        if (currentPoints < reward.getPointsRequired()) {
            throw new RuntimeException("Not enough points to redeem this reward");
        }

        child.setTotalPoints(currentPoints - reward.getPointsRequired());
        userRepository.save(child);

        return "Reward redeemed successfully! Remaining points: " + child.getTotalPoints();
    }
}