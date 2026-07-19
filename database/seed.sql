-- Smart Adaptive Recovery System (SARS)
-- PostgreSQL Seed Data

-- Clear existing data if needed (cascade will handle child tables)
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE customers CASCADE;
TRUNCATE TABLE help_center_articles CASCADE;

-- 1. Insert Admin User
INSERT INTO users (username, password_hash, email, full_name, role)
VALUES 
('admin', '$2a$10$7cK.YF4Z/b5U2zH9c3xO.OWy1C6wZ/1Q7x5P1Z8uP9c3xO.OWy1C6', 'admin@viettelpost.com.vn', 'System Administrator', 'ADMIN'); -- password is 'admin' (dummy hash for demo)

-- 2. Insert Help Center Articles
INSERT INTO help_center_articles (slug, category, title_vi, content_vi, title_en, content_en, sort_order)
VALUES 
('chinh-sach-boi-thuong', 'POLICY', 'Chính sách bồi thường', 'Hàng hóa có bảo hiểm: Bồi thường 100% giá trị khai báo (tối đa 100 triệu VNĐ). Hàng hóa không bảo hiểm: Bồi thường 04 lần cước vận chuyển đối với bưu gửi trong nước.', 'Compensation Policy', 'Insured items: 100% compensation based on the declared parcel value (maximum 100 million VND). Non-insured items: Compensation equals 4× the shipping fee for domestic shipments.', 1),
('quy-trinh-xu-ly-su-co', 'GUIDE', 'Quy trình xử lý sự cố', 'Hệ thống tự động phát hiện đơn hàng có dấu hiệu bất thường trước khi khách hàng cần liên hệ hỗ trợ. Lựa chọn phương án xử lý dựa trên loại khách hàng, loại bưu gửi và tình trạng bảo hiểm của đơn hàng.', 'Incident Handling Process', 'The system automatically detects abnormal delays and initializes the investigation. Recovery strategies are adapted based on customer type, parcel category, and insurance status.', 2),
('hotline-ho-tro', 'FAQ', 'Thông tin liên hệ Hotline', 'Hotline Viettel Post: 19001515. Email hỗ trợ khách hàng: cskh@viettelpost.com.', 'Hotline Contact Information', 'Viettel Post Hotline: 1900 1515. Customer Support Email: cskh@viettelpost.com.', 3);

-- 3. Insert Customers & Shipments using PL/pgSQL block
DO $$ 
DECLARE 
    cust_id BIGINT;
    ship_id BIGINT;
    rec_id BIGINT;
    v_tracking VARCHAR(20);
    v_case_id VARCHAR(20);
    v_customer_type VARCHAR(30);
    v_parcel_category VARCHAR(30);
    v_insurance VARCHAR(15);
    v_status VARCHAR(30);
    v_recovery_mode VARCHAR(30);
    v_inv_status VARCHAR(30);
    i INTEGER;
    j INTEGER;
BEGIN
    -- Create 5 predefined customers
    INSERT INTO customers (full_name, phone, email, customer_type, preferred_language) VALUES ('Nguyễn Thị Lan', '0901234567', 'lan.nguyen@example.com', 'ONLINE_SHOPPER', 'vi') RETURNING id INTO cust_id;
    INSERT INTO customers (full_name, phone, email, customer_type, preferred_language) VALUES ('Trần Văn Bảo', '0987654321', 'bao.tran@example.com', 'ONLINE_SHOPPER', 'en');
    INSERT INTO customers (full_name, phone, email, customer_type, preferred_language) VALUES ('Cửa hàng Mẹ & Bé', '0911223344', 'mevabe@example.com', 'ONLINE_MERCHANT', 'vi');
    INSERT INTO customers (full_name, phone, email, customer_type, preferred_language) VALUES ('TechZone Store', '0944556677', 'techzone@example.com', 'ONLINE_MERCHANT', 'vi');
    INSERT INTO customers (full_name, phone, email, customer_type, preferred_language) VALUES ('Lê Hoàng Minh', '0977889900', 'minh.le@example.com', 'INDIVIDUAL_SENDER', 'vi');

    -- Generate 50 Shipments
    FOR i IN 1..50 LOOP
        -- Randomly select customer
        SELECT id, customer_type INTO cust_id, v_customer_type FROM customers ORDER BY RANDOM() LIMIT 1;
        
        -- Random attributes
        v_tracking := 'VTP' || TO_CHAR(NOW(), 'YYMMDD') || LPAD(i::text, 5, '0');
        
        -- Parcel Category
        v_parcel_category := (ARRAY['COMMERCIAL_GOODS', 'PERSONAL_ITEMS', 'IMPORTANT_DOCUMENTS', 'ONE_OF_A_KIND', 'FRAGILE'])[floor(random() * 5 + 1)];
        
        -- Insurance
        v_insurance := (ARRAY['INSURED', 'NOT_INSURED'])[floor(random() * 2 + 1)];
        
        -- Current Status (heavy on normal statuses, some abnormal delays)
        IF i <= 10 THEN
            v_status := 'ABNORMAL_DELAY_DETECTED';
        ELSIF i <= 20 THEN
            v_status := 'DELIVERED';
        ELSE
            v_status := (ARRAY['CREATED', 'CONFIRMED', 'PREPARING', 'IN_TRANSIT_TO_HUB', 'AT_SORTING_HUB', 'OUT_FOR_DELIVERY'])[floor(random() * 6 + 1)];
        END IF;

        -- Determine Recovery Mode
        CASE v_parcel_category
            WHEN 'COMMERCIAL_GOODS' THEN v_recovery_mode := 'FAST_REPLACEMENT_REFUND';
            WHEN 'IMPORTANT_DOCUMENTS' THEN v_recovery_mode := 'PRIORITY_RECOVERY';
            WHEN 'ONE_OF_A_KIND' THEN v_recovery_mode := 'INTENSIVE_SEARCH';
            ELSE v_recovery_mode := 'STANDARD_RECOVERY';
        END CASE;

        -- Insert Shipment
        INSERT INTO shipments (
            tracking_id, customer_id, sender_name, sender_phone, receiver_name, receiver_phone, 
            customer_type, parcel_category, insurance_status, current_status, recovery_mode, 
            declared_value, shipping_fee, estimated_delivery, delay_stage_index, is_demo, simulation_active, created_at
        ) VALUES (
            v_tracking, cust_id, 'Người gửi ' || i, '090000' || LPAD(i::text, 4, '0'), 'Người nhận ' || i, '098000' || LPAD(i::text, 4, '0'),
            v_customer_type, v_parcel_category, v_insurance, v_status, v_recovery_mode,
            floor(random() * 5000000 + 100000), floor(random() * 50000 + 20000), NOW() + INTERVAL '2 days', 4, true, (v_status != 'DELIVERED' AND v_status != 'ABNORMAL_DELAY_DETECTED'), NOW() - (random() * interval '5 days')
        ) RETURNING id INTO ship_id;

        -- Generate Tracking History
        INSERT INTO tracking_history (shipment_id, status, location, description, is_current, occurred_at) 
        VALUES (ship_id, 'CREATED', 'System', 'Đơn hàng đã được tạo', (v_status = 'CREATED'), NOW() - INTERVAL '5 days');
        
        IF v_status != 'CREATED' THEN
            INSERT INTO tracking_history (shipment_id, status, location, description, is_current, occurred_at) 
            VALUES (ship_id, 'CONFIRMED', 'Hà Nội', 'Đơn hàng đã được xác nhận', (v_status = 'CONFIRMED'), NOW() - INTERVAL '4 days');
        END IF;

        IF v_status IN ('PREPARING', 'IN_TRANSIT_TO_HUB', 'AT_SORTING_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED', 'ABNORMAL_DELAY_DETECTED') THEN
            INSERT INTO tracking_history (shipment_id, status, location, description, is_current, occurred_at) 
            VALUES (ship_id, 'AT_SORTING_HUB', 'Bưu cục Phân Loại', 'Đã đến bưu cục phân loại', (v_status = 'AT_SORTING_HUB' OR v_status = 'ABNORMAL_DELAY_DETECTED'), NOW() - INTERVAL '2 days');
        END IF;

        -- Generate Recovery Cases for Abnormal Delays
        IF v_status = 'ABNORMAL_DELAY_DETECTED' THEN
            v_case_id := 'RC' || TO_CHAR(NOW(), 'YYMMDD') || LPAD(i::text, 5, '0');
            v_inv_status := (ARRAY['CREATED', 'IN_PROGRESS', 'PARCEL_FOUND', 'CONFIRMED_LOST', 'CLOSED'])[floor(random() * 5 + 1)];
            
            INSERT INTO recovery_cases (
                case_id, shipment_id, customer_id, customer_type, parcel_category, 
                insurance_status, recovery_mode, investigation_status, estimated_resolution_hours,
                created_at, updated_at
            ) VALUES (
                v_case_id, ship_id, cust_id, v_customer_type, v_parcel_category,
                v_insurance, v_recovery_mode, v_inv_status, 7,
                NOW() - INTERVAL '1 day', NOW()
            ) RETURNING id INTO rec_id;

            INSERT INTO abnormal_events (shipment_id, event_type, detected_at_status, description, delay_minutes, detected_at)
            VALUES (ship_id, 'ABNORMAL_DELAY', 'AT_SORTING_HUB', 'Parcel remained at sorting hub longer than expected threshold', 1440, NOW() - INTERVAL '1 day');

            INSERT INTO notifications (customer_id, recovery_case_id, title, message, notification_type, is_read, created_at)
            VALUES (cust_id, rec_id, 'Abnormal Delay Detected', 'Your parcel has remained at the current logistics stage longer than expected. Investigation initialized.', 'DELAY_DETECTED', false, NOW() - INTERVAL '1 day');
            
            -- If Confirmed Lost or Closed, maybe add compensation request
            IF v_inv_status = 'CONFIRMED_LOST' OR v_inv_status = 'CLOSED' THEN
                INSERT INTO compensation_requests (recovery_case_id, customer_id, compensation_type, compensation_amount, status, created_at)
                VALUES (rec_id, cust_id, CASE WHEN v_insurance = 'INSURED' THEN 'FULL_VALUE' ELSE 'SHIPPING_FEE_4X' END, 
                CASE WHEN v_insurance = 'INSURED' THEN 1000000 ELSE 150000 END, 'APPROVED', NOW());
            END IF;
        END IF;

    END LOOP;
END $$;
