package com.dev.family_task.config;

import com.dev.family_task.constant.TaskStatus;
import com.dev.family_task.entities.FamilyEntity;
import com.dev.family_task.entities.RewardEntity;
import com.dev.family_task.entities.RoleEntity;
import com.dev.family_task.entities.TaskEntity;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.repositories.FamilyRepository;
import com.dev.family_task.repositories.RewardRepository;
import com.dev.family_task.repositories.TaskRepository;
import com.dev.family_task.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class MockDataSeeder implements CommandLineRunner {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final RewardRepository rewardRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only run if we don't have enough data
        if (taskRepository.count() > 50) {
            System.out.println("Mock data already exists. Skipping seeder.");
            return;
        }

        System.out.println("========== SEEDING 100+ MOCK DATA ==========");

        Random random = new Random();
        String[] familyNames = {"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"};
        String[] kidNames = {"Timmy", "Sarah", "Leo", "Emma", "Noah", "Olivia", "Liam", "Ava", "Mason", "Sophia", "Ethan", "Isabella", "Lucas", "Mia", "Aiden"};
        String[] parentNames = {"John", "Mary", "Michael", "Linda", "David", "Susan", "James", "Karen", "Robert", "Nancy"};
        String[] taskTitles = {"Clean your room", "Do the dishes", "Walk the dog", "Finish homework", "Take out trash", "Read for 30 mins", "Help with dinner", "Fold laundry", "Feed the cat", "Water plants"};
        String[] rewardTitles = {"Ice Cream", "Extra Screen Time", "New Toy", "Movie Night", "Pizza Dinner", "Go to Park", "Buy Video Game", "Stay up late", "Robux Gift Card", "Trip to Zoo"};

        List<FamilyEntity> families = new ArrayList<>();
        List<UserEntity> kids = new ArrayList<>();

        // Generate 10 Families
        for (int i = 0; i < 10; i++) {
            FamilyEntity f = new FamilyEntity();
            f.setFamilyName(familyNames[i] + " Family");
            f.setInviteCode("FAM" + (1000 + i));
            f = familyRepository.save(f);
            families.add(f);

            // 1 Parent
            UserEntity parent = new UserEntity();
            parent.setFamily(f);
            parent.setFullName(parentNames[i]);
            parent.setEmail("parent" + i + "@family.com");
            parent.setPassword(passwordEncoder.encode("123456"));
            parent.setRole(RoleEntity.PARENT);
            userRepository.save(parent);

            // 2-3 Kids
            int kidCount = 2 + random.nextInt(2);
            for (int k = 0; k < kidCount; k++) {
                UserEntity kid = new UserEntity();
                kid.setFamily(f);
                kid.setFullName(kidNames[random.nextInt(kidNames.length)]);
                kid.setEmail("kid" + i + "_" + k + "@family.com");
                kid.setPassword(passwordEncoder.encode("123456"));
                kid.setRole(RoleEntity.CHILD);
                kid.setTotalPoints(random.nextInt(1200)); // Random points
                kid = userRepository.save(kid);
                kids.add(kid);
            }

            // 2 Rewards per family
            for (int r = 0; r < 2; r++) {
                RewardEntity reward = new RewardEntity();
                reward.setFamily(f);
                reward.setName(rewardTitles[random.nextInt(rewardTitles.length)]);
                reward.setPointsRequired(50 + random.nextInt(450));
                rewardRepository.save(reward);
            }
        }

        // Generate 50 Tasks randomly assigned to kids
        for (int i = 0; i < 60; i++) {
            UserEntity assignee = kids.get(random.nextInt(kids.size()));
            TaskEntity task = new TaskEntity();
            task.setFamily(assignee.getFamily());
            task.setAssignedTo(assignee);
            task.setTitle(taskTitles[random.nextInt(taskTitles.length)]);
            task.setDescription("Please do this task carefully and with love.");
            task.setPoints(10 + random.nextInt(90));
            
            int statusRand = random.nextInt(10);
            if (statusRand < 5) {
                task.setStatus(TaskStatus.APPROVED);
            } else if (statusRand < 8) {
                task.setStatus(TaskStatus.SUBMITTED);
            } else {
                task.setStatus(TaskStatus.PENDING);
            }
            
            taskRepository.save(task);
        }

        System.out.println("========== SEEDING COMPLETE ==========");
    }
}
