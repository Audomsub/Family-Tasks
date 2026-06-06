package com.dev.family_task.services;

import com.dev.family_task.dto.Request.GroceryRequest;
import com.dev.family_task.dto.Response.GroceryResponse;
import com.dev.family_task.entities.GroceryEntity;
import com.dev.family_task.entities.UserEntity;
import com.dev.family_task.repositories.GroceryRepository;
import com.dev.family_task.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroceryService {

    private final GroceryRepository groceryRepository;
    private final UserRepository userRepository;

    // 1. ดึงรายการของทั้งหมด
    public List<GroceryResponse> getFamilyGroceries(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<GroceryEntity> items = groceryRepository.findByFamilyId(user.getFamily().getId());

        return items.stream().map(item -> GroceryResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .isPurchased(item.isPurchased())
                .addedByName(item.getAddedBy().getFullName())
                .build()
        ).toList();
    }

    // 2. เพิ่มรายการของ
    public String addGroceryItem(String email, GroceryRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        GroceryEntity item = new GroceryEntity();
        item.setName(request.getName());
        item.setFamily(user.getFamily());
        item.setAddedBy(user);

        groceryRepository.save(item);
        return "Item added to grocery list";
    }

    // 3. ติ๊กสลับสถานะ ซื้อแล้ว/ยังไม่ซื้อ (Toggle)
    public String togglePurchasedStatus(Long itemId, String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        GroceryEntity item = groceryRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getFamily().getId().equals(user.getFamily().getId())) {
            throw new RuntimeException("You cannot access items of another family");
        }

        // สลับสถานะ (ถ้า true เป็น false, ถ้า false เป็น true)
        item.setPurchased(!item.isPurchased());
        groceryRepository.save(item);

        return item.isPurchased() ? "Item marked as purchased" : "Item marked as unpurchased";
    }
}