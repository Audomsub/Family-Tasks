-- 1. สร้างครอบครัว
INSERT INTO families (id, family_name, invite_code, created_at)
VALUES (100, 'Happy House', 'HAPPY123', CURRENT_TIMESTAMP)
ON CONFLICT (invite_code) DO NOTHING;

-- รหัสผ่านสำหรับทุกคนคือ '123456' (Bcrypt: $2a$10$yZ/4.v0.z/xK4m20/8h.YOp5E6.U7v8P00lE0w817N1H.K/jMpw6i)
-- 2. สร้างผู้ใช้งาน (พ่อ, แม่, ลูก)
INSERT INTO users (id, family_id, full_name, email, password, role, total_points, created_at)
VALUES 
(101, 100, 'Super Dad', 'dad@family.com', '$2a$10$yZ/4.v0.z/xK4m20/8h.YOp5E6.U7v8P00lE0w817N1H.K/jMpw6i', 'PARENT', 0, CURRENT_TIMESTAMP),
(102, 100, 'Wonder Mom', 'mom@family.com', '$2a$10$yZ/4.v0.z/xK4m20/8h.YOp5E6.U7v8P00lE0w817N1H.K/jMpw6i', 'PARENT', 50, CURRENT_TIMESTAMP),
(103, 100, 'Little Bunny', 'kid@family.com', '$2a$10$yZ/4.v0.z/xK4m20/8h.YOp5E6.U7v8P00lE0w817N1H.K/jMpw6i', 'CHILD', 150, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- 3. สร้างรายการงาน (Tasks)
INSERT INTO tasks (family_id, assigned_to, title, description, points, status)
VALUES 
(100, NULL, 'ล้างจานมื้อเย็น', 'ล้างให้สะอาดและเช็ดให้แห้ง', 20, 'PENDING'),
(100, 103, 'กวาดบ้านถูบ้าน', 'ทำความสะอาดห้องรับแขก', 30, 'IN_PROGRESS'),
(100, 103, 'รดน้ำต้นไม้', 'รดน้ำแปลงผักหลังบ้าน', 10, 'APPROVED'),
(100, 101, 'ซ่อมหลอดไฟ', 'เปลี่ยนหลอดไฟหน้าบ้านที่ขาด', 50, 'SUBMITTED');

-- 4. สร้างรายการของชำ (Groceries)
-- ตาราง groceries ชื่อคอลัมน์จาก Entity: family_id, added_by_id, name, is_purchased
INSERT INTO groceries (family_id, added_by_id, name, is_purchased)
VALUES 
(100, 102, 'นมจืด 2 แกลลอน', false),
(100, 102, 'ไข่ไก่ 1 แผง', false),
(100, 103, 'ขนมเยลลี่หมี', false),
(100, 101, 'น้ำยาล้างจาน', true);

-- 5. สร้างของรางวัล (Rewards)
-- ตาราง rewards ชื่อคอลัมน์จาก Entity: family_id, name, description, points_required
INSERT INTO rewards (family_id, name, description, points_required)
VALUES 
(100, 'ไปกินหมูกระทะ', 'มื้อเย็นสุดพิเศษ', 300),
(100, 'เล่นเกมเพิ่ม 1 ชม.', 'เวลาพักผ่อน', 50),
(100, 'ไอศกรีม 1 ถ้วย', 'กินไอศกรีมรสที่ชอบ', 30),
(100, 'ดูหนังเรื่องใหม่', 'ไปดูหนังที่โรงภาพยนตร์', 500);

-- รีเซ็ตค่า Sequence ID เพื่อเวลาสร้างข้อมูลใหม่จากหน้าเว็บจะได้ไม่พัง
SELECT setval('families_id_seq', (SELECT MAX(id) FROM families));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks));
SELECT setval('groceries_id_seq', (SELECT MAX(id) FROM groceries));
SELECT setval('rewards_id_seq', (SELECT MAX(id) FROM rewards));
