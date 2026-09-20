const express = require('express');
const router = express.Router();

// Bengali months data
const BENGALI_MONTHS = [
  { index: 0, nameBn: 'বৈশাখ', nameEn: 'Boishakh', season: 'Grisma (Summer)' },
  { index: 1, nameBn: 'জ্যৈষ্ঠ', nameEn: 'Jyoishtho', season: 'Grisma (Summer)' },
  { index: 2, nameBn: 'আষাঢ়', nameEn: 'Ashadh', season: 'Barsha (Monsoon)' },
  { index: 3, nameBn: 'শ্রাবণ', nameEn: 'Shrabon', season: 'Barsha (Monsoon)' },
  { index: 4, nameBn: 'ভাদ্র', nameEn: 'Bhadro', season: 'Sarat (Autumn)' },
  { index: 5, nameBn: 'আশ্বিন', nameEn: 'Ashwin', season: 'Sarat (Autumn)' },
  { index: 6, nameBn: 'কার্তিক', nameEn: 'Kartik', season: 'Hemanta (Late Autumn)' },
  { index: 7, nameBn: 'অগ্রহায়ণ', nameEn: 'Agrahayan', season: 'Hemanta (Late Autumn)' },
  { index: 8, nameBn: 'পৌষ', nameEn: 'Poush', season: 'Sheet (Winter)' },
  { index: 9, nameBn: 'মাঘ', nameEn: 'Magh', season: 'Sheet (Winter)' },
  { index: 10, nameBn: 'ফাল্গুন', nameEn: 'Falgun', season: 'Basanta (Spring)' },
  { index: 11, nameBn: 'চৈত্র', nameEn: 'Chaitra', season: 'Basanta (Spring)' }
];

const FESTIVALS = [
  { nameBn: 'পয়লা বৈশাখ (শুভ নববর্ষ)', nameEn: 'Poila Boishakh (Bengali New Year)', month: 0, day: 1, type: 'MAJOR' },
  { nameBn: 'অক্ষয় তৃতীয়া', nameEn: 'Akshaya Tritiya', month: 0, day: 18, type: 'AUSPICIOUS' },
  { nameBn: 'রথযাত্রা', nameEn: 'Ratha Yatra', month: 2, day: 12, type: 'MAJOR' },
  { nameBn: 'ঝুলনযাত্রা ও রাখী পূর্ণিমা', nameEn: 'Rakhi Purnima & Jhulan Yatra', month: 3, day: 30, type: 'FESTIVAL' },
  { nameBn: 'শ্রীকৃষ্ণের জন্মাষ্টমী', nameEn: 'Sri Krishna Janmashtami', month: 4, day: 8, type: 'MAJOR' },
  { nameBn: 'মহালয়া', nameEn: 'Mahalaya', month: 5, day: 14, type: 'SACRED' },
  { nameBn: 'শ্রীশ্রী শারদীয়া দুর্গাপূজা (মহাষ্টমী)', nameEn: 'Durga Puja (Maha Ashtami)', month: 5, day: 22, type: 'GRAND' },
  { nameBn: 'শ্রীশ্রী কোজাগরী লক্ষ্মীপূজা', nameEn: 'Kojagari Lakshmi Puja', month: 5, day: 28, type: 'MAJOR' },
  { nameBn: 'শ্রীশ্রী শ্যামাপূজা ও দীপাবলি', nameEn: 'Kali Puja & Deepavali', month: 6, day: 15, type: 'GRAND' },
  { nameBn: 'শ্রীশ্রী জগদ্ধাত্রী পূজা', nameEn: 'Jagaddhatri Puja', month: 6, day: 24, type: 'MAJOR' },
  { nameBn: 'মকর সংক্রান্তি ও গঙ্গাসাগর স্নান', nameEn: 'Makar Sankranti & Ganga Sagar Snan', month: 8, day: 30, type: 'SACRED' },
  { nameBn: 'শ্রীশ্রী সরস্বতী পূজা (শ্রীপঞ্চমী)', nameEn: 'Saraswati Puja (Vasant Panchami)', month: 9, day: 10, type: 'MAJOR' },
  { nameBn: 'মহা শিবরাত্রি', nameEn: 'Maha Shivratri', month: 10, day: 14, type: 'MAJOR' },
  { nameBn: 'দোলযাত্রা ও শ্রীগৌরাঙ্গ মহাপ্রভুর আবির্ভাব', nameEn: 'Dol Yatra & Gaura Purnima', month: 10, day: 29, type: 'GRAND' }
];

// GET /api/panjika/today
router.get('/today', (req, res) => {
  res.json({
    success: true,
    data: {
      bengaliDate: '৪ঠা আশ্বিন, ১৪৩২ বঙ্গাব্দ',
      gregorianDate: new Date().toLocaleDateString('en-IN', { dateStyle: 'full' }),
      tithiBn: 'শুক্লা অষ্টমী তিথি (রাত ০৯:৪২ পর্যন্ত)',
      tithiEn: 'Shukla Ashtami (until 09:42 PM)',
      nakshatra: 'উত্তরাষাঢ়া নক্ষত্র',
      yoga: 'সৌভাগ্য যোগ',
      suryaUdaya: '০৫:২৪ পূর্বাহ্ণ (5:24 AM)',
      suryaAsta: '০৫:৪০ অপরাহ্ণ (5:40 PM)',
      amritaYoga: 'সকাল ০৭:১৫ - ০৯:৩০, দুপুর ১২:১০ - ০১:৪০',
      rahukaal: 'দুপুর ০১:২০ - ০২:৫০ (অশুভ কাল)',
      specialOfferings: 'কালীঘাট ও তারাপীঠে বিশেষ চণ্ডীপাঠ ও রক্তজবা নিবেদন প্রযোজ্য।'
    }
  });
});

// GET /api/panjika/months
router.get('/months', (req, res) => {
  res.json({ success: true, data: BENGALI_MONTHS });
});

// GET /api/panjika/festivals
router.get('/festivals', (req, res) => {
  const { year = 1432 } = req.query;
  res.json({ success: true, year, data: FESTIVALS });
});

module.exports = router;
