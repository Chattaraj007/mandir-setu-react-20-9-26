-- Mandir Setu Seed Script
-- Inserts dummy records for Temples, Users (all roles), Puja Offerings, and Bookings

-- 1. Insert Sacred Temples
INSERT INTO temples (id, name_en, name_bn, deity_en, deity_bn, district_en, district_bn, location_en, location_bn, description_en, description_bn, darshan_timings, aarti_timings)
VALUES
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Kalighat Kali Temple',
    'কালীঘাট কালী মন্দির',
    'Maa Kali',
    'মা কালী',
    'Kolkata',
    'কলকাতা',
    'Kalighat, Kolkata - 700026',
    'কালীঘাট, কলকাতা - ৭০০০২৬',
    'One of the 51 Shakti Peethas where the right toe of Sati fell.',
    '৫১টি সতীপীঠের অন্যতম প্রধান মহাপীঠ যেখানে সতীর ডান পদাঙ্গুলি পতিত হয়েছিল।',
    '05:00 AM - 10:30 PM',
    'Mangal Aarti: 05:30 AM | Sandhya Aarti: 06:30 PM'
),
(
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Dakshineswar Kali Temple',
    'দক্ষিণেশ্বর ভবতারিণী মন্দির',
    'Bhavatarini Kali',
    'ভবতারিণী মা কালী',
    'North 24 Parganas',
    'উত্তর ২৪ পরগনা',
    'Dakshineswar, Kolkata - 700076',
    'দক্ষিণেশ্বর, কলকাতা - ৭০০০৭৬',
    'Historic temple on the Hooghly river founded by Rani Rashmoni, home of Sri Ramakrishna Paramahamsa.',
    'রানী রাসমণি প্রতিষ্ঠিত শ্রীরামকৃষ্ণের পুণ্য লীলাভূমি ও মা ভবতারিণীর জাগ্রত পীঠস্থান।',
    '06:00 AM - 12:30 PM, 03:30 PM - 09:00 PM',
    'Sandhya Aarti: 07:00 PM'
),
(
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Tarapith Temple',
    'তারাপীঠ মন্দির',
    'Maa Tara',
    'মা তারা',
    'Birbhum',
    'বীরভূম',
    'Tarapith, Rampurhat, Birbhum - 731233',
    'তারাপীঠ, রামপুরহাট, বীরভূম - ৭৩১২৩৩',
    'Major Tantric Shakti Peetha revered by Mahasadhak Bamakhyapa.',
    'বামাক্ষ্যাপার সিদ্ধপীঠ ও মহাশ্মশান সংলগ্ন শ্রীশ্রী তারামায়ের তীর্থক্ষেত্র।',
    '06:00 AM - 09:00 PM',
    'Bhog Aarti: 01:00 PM | Sandhya Aarti: 07:30 PM'
),
(
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'Belur Math (Ramakrishna Mission)',
    'বেলুড় মঠ',
    'Sri Ramakrishna Paramahamsa',
    'শ্রী শ্রী রামকৃষ্ণ পরমহংসদেব',
    'Howrah',
    'হাওড়া',
    'Belur, Howrah - 711202',
    'বেলুড়, হাওড়া - ৭১১২০২',
    'Global headquarters of Ramakrishna Math and Mission founded by Swami Vivekananda.',
    'স্বামী বিবেকানন্দ প্রতিষ্ঠিত সর্বধর্ম সমন্বয়ের বিশ্বখ্যাত পুণ্যপীঠ।',
    '06:30 AM - 11:30 AM, 04:00 PM - 08:30 PM',
    'Evening Arati: 06:30 PM'
),
(
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    'Mayapur ISKCON Chandrodaya Mandir',
    'মায়াপুর ইসকন চন্দ্রোদয় মন্দির',
    'Sri Sri Radha Madhava',
    'শ্রী শ্রী রাধামাধব',
    'Nadia',
    'নদিয়া',
    'Mayapur, Nadia - 741313',
    'মায়াপুর, নদিয়া - ৭৪১৩১৩',
    'Birthplace of Sri Chaitanya Mahaprabhu and world spiritual headquarters of ISKCON.',
    'শ্রীচৈতন্য মহাপ্রভুর পুণ্য জন্মভূমি ও আন্তর্জাতিক কৃষ্ণভাবনামৃত সংঘের বিশ্ব কেন্দ্র।',
    '04:30 AM - 01:00 PM, 04:00 PM - 08:30 PM',
    'Mangal Aarti: 04:30 AM | Gaura Aarti: 06:30 PM'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Dummy Users (passwords hashed with standard bcrypt or plain-verified for dev login)
-- Passwords:
-- admin@mandirsetu.gov.in : admin123
-- priest@kalighat.org     : priest123
-- trustee@tarapith.org    : trustee123
-- devotee@mandirsetu.org  : omnamah108

INSERT INTO users (id, email, password_hash, full_name, phone, role, assigned_temple_id, gotra)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'admin@mandirsetu.gov.in',
    '$2b$10$w8T06P6wWvHekpYJdgE.oOJ.s4Z111V/94v6gHlE9Jg0jX2aJ5b2q', -- hash for 'admin123'
    'Dr. Soumitra Mukherjee',
    '+919830012345',
    'SUPER_ADMIN',
    NULL,
    'Bharadwaja'
),
(
    '22222222-2222-2222-2222-222222222222',
    'priest@kalighat.org',
    '$2b$10$tJjZz1kP8v8mF7Y/g9jTFe6G4oYF2M9nL3uV5pQ7rS9tU1vW3xY5a', -- hash for 'priest123'
    'Pandit Subhashish Bhattacharya',
    '+919831123456',
    'PRIEST',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Kalighat
    'Sandilya'
),
(
    '33333333-3333-3333-3333-333333333333',
    'trustee@tarapith.org',
    '$2b$10$9Gv1X3y5Z7a9B1c3D5e7F9g1H3j5L7n9P1r3T5v7X9z1B3d5F7h9J', -- hash for 'trustee123'
    'Devkumar Banerjee',
    '+919832234567',
    'TRUSTEE',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', -- Tarapith
    'Kashyapa'
),
(
    '44444444-4444-4444-4444-444444444444',
    'devotee@mandirsetu.org',
    '$2b$10$A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6A', -- hash for 'omnamah108'
    'Ananya Sen',
    '+919833345678',
    'DEVOTEE',
    NULL,
    'Gautama'
)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Puja Offerings
INSERT INTO puja_offerings (id, temple_id, title_en, title_bn, description_en, description_bn, base_price)
VALUES
(
    '55555555-5555-5555-5555-555555555501',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Maha Kali Shanti & Raksha Puja',
    'মহাকালী শান্তি ও রক্ষা কবচ পূজা',
    'Special auspicious archana and raksha sutra for family wellbeing.',
    'পরিবারের মঙ্গল ও রোগ-শোক নিবারণের জন্য সংকল্প সহ বিশেষ অর্চনা।',
    501.00
),
(
    '55555555-5555-5555-5555-555555555502',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Sahasranama Archana with Hibiscus Garland',
    'সহস্রনাম জবার মালা অর্চনা',
    '108 crimson hibiscus offering with Chandi Path.',
    '১০৮টি রক্তজবা ও চণ্ডীপাঠ সহযোগে বিশেষ নিবেদন।',
    1100.00
),
(
    '55555555-5555-5555-5555-555555555503',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Bhavatarini Special Sandhya Bhog Puja',
    'মা ভবতারিণীর বিশেষ সন্ধ্যা ভোগ পূজা',
    'Auspicious evening bhog with sacred Gangajal and prasad box.',
    'পবিত্র গঙ্গাজল ও প্রসাদ সহ মা ভবতারিণীর সান্ধ্য ভোগ নিবেদন।',
    751.00
),
(
    '55555555-5555-5555-5555-555555555504',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Tara Maa Siddha Sankalp Puja',
    'তারা মায়ের সিদ্ধ সংকল্প মহাপূজা',
    'Sacred Tantrik sankalp archana for removal of hurdles and graha dosha.',
    'গ্রহদোষ খণ্ডন ও বিঘ্ননাশের জন্য মহাশ্মশান সংলগ্ন সিদ্ধ সংকল্প।',
    1501.00
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Sample Bookings
INSERT INTO bookings (id, user_id, temple_id, offering_id, devotee_name, devotee_phone, gotra, puja_date, tithi_time, sankalp_wish, prasad_address, total_amount, payment_status, booking_status, assigned_priest_name)
VALUES
(
    '66666666-6666-6666-6666-666666666601',
    '44444444-4444-4444-4444-444444444444',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '55555555-5555-5555-5555-555555555501',
    'Ananya Sen',
    '+919833345678',
    'Gautama',
    CURRENT_DATE + INTERVAL '2 day',
    'Shukla Ashtami (Morning 07:30 AM)',
    'Family health and prosperity',
    '45/B Lake Road, Kolkata - 700029',
    501.00,
    'PAID',
    'CONFIRMED',
    'Pandit Subhashish Bhattacharya'
),
(
    '66666666-6666-6666-6666-666666666602',
    '44444444-4444-4444-4444-444444444444',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    '55555555-5555-5555-5555-555555555504',
    'Rahul Sen',
    '+919833345679',
    'Gautama',
    CURRENT_DATE + INTERVAL '5 day',
    'Purnima Tithi (11:00 AM)',
    'Success in business ventures',
    '45/B Lake Road, Kolkata - 700029',
    1501.00,
    'PAID',
    'PENDING',
    'Pandit Bama Charan'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Sample Donations (Chadhava & Cow Seva)
INSERT INTO donations (id, user_id, temple_id, donor_name, cause_type, amount, gotra, payment_method, transaction_ref, status)
VALUES
(
    '77777777-7777-7777-7777-777777777701',
    '44444444-4444-4444-4444-444444444444',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Ananya Sen',
    'GAU_SEVA',
    500.00,
    'Gautama',
    'UPI',
    'UPI-REF-2026-904123',
    'SUCCESS'
),
(
    '77777777-7777-7777-7777-777777777702',
    '44444444-4444-4444-4444-444444444444',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Devotee Family',
    'ANNADAN',
    1000.00,
    'Kashyapa',
    'NET_BANKING',
    'BANK-TXN-884192',
    'SUCCESS'
)
ON CONFLICT (id) DO NOTHING;
