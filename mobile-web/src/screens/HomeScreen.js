import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { apiRequest } from '../api/client';

export default function HomeScreen({ onNavigate, onOpenBooking, onOpenDonation }) {
  const { isBn, user } = useContext(AuthContext);
  const [panjikaToday, setPanjikaToday] = useState(null);
  const [featuredTemples, setFeaturedTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      const [panjikaRes, templesRes] = await Promise.all([
        apiRequest('/api/panjika/today'),
        apiRequest('/api/temples')
      ]);

      if (panjikaRes && panjikaRes.success) {
        setPanjikaToday(panjikaRes.data);
      } else {
        // Fallback default
        setPanjikaToday({
          bengaliDate: '৪ঠা আশ্বিন, ১৪৩২ বঙ্গাব্দ',
          tithiBn: 'শুক্লা অষ্টমী তিথি (রাত ০৯:৪২ পর্যন্ত)',
          tithiEn: 'Shukla Ashtami (until 09:42 PM)',
          nakshatra: 'উত্তরাষাঢ়া নক্ষত্র',
          amritaYoga: 'সকাল ০৭:১৫ - ০৯:৩০, দুপুর ১২:১০ - ০১:৪০'
        });
      }

      if (templesRes && templesRes.success && templesRes.data?.length > 0) {
        setFeaturedTemples(templesRes.data.slice(0, 3));
      } else {
        setFeaturedTemples([
          {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            name_en: 'Kalighat Kali Temple',
            name_bn: 'কালীঘাট কালী মন্দির',
            deity_bn: 'মা কালী',
            district_bn: 'কলকাতা',
            darshan_timings: '05:00 AM - 10:30 PM'
          },
          {
            id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
            name_en: 'Dakshineswar Kali Temple',
            name_bn: 'দক্ষিণেশ্বর ভবতারিণী মন্দির',
            deity_bn: 'ভবতারিণী মা কালী',
            district_bn: 'উত্তর ২৪ পরগনা',
            darshan_timings: '06:00 AM - 09:00 PM'
          },
          {
            id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
            name_en: 'Tarapith Temple',
            name_bn: 'তারাপীঠ মন্দির',
            deity_bn: 'মা তারা',
            district_bn: 'বীরভূম',
            darshan_timings: '06:00 AM - 09:00 PM'
          }
        ]);
      }
      setLoading(false);
    }
    loadHomeData();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Sacred Welcome Hero */}
      <View style={styles.heroBanner}>
        <View style={styles.heroTextCol}>
          <Text style={styles.heroGreeting}>
            {isBn ? `নমস্কার, ${user?.fullName || 'ভক্তবৃন্দ'}` : `Namaskar, ${user?.fullName || 'Devotee'}`}
          </Text>
          <Text style={styles.heroTagline}>
            {isBn
              ? 'পশ্চিমবঙ্গের জাগ্রত শক্তিপীঠ ও দেবালয়ে প্রত্যক্ষ সংকল্প পূজা ও প্রসাদ বিতরণ'
              : 'Direct Sankalp Puja & Prasad delivery from revered West Bengal temples'}
          </Text>
        </View>
        <Text style={styles.heroOm}>🕉️</Text>
      </View>

      {/* Today's Panjika Tithi Card */}
      {panjikaToday && (
        <View style={styles.tithiCard}>
          <View style={styles.tithiHeader}>
            <Text style={styles.tithiIcon}>📅</Text>
            <Text style={styles.tithiTitle}>
              {isBn ? 'আজকের বঙ্গাব্দ পঞ্জিকা ও তিথি' : "Today's Bengali Almanac & Tithi"}
            </Text>
          </View>
          <Text style={styles.tithiDate}>{panjikaToday.bengaliDate}</Text>
          <Text style={styles.tithiDetails}>{isBn ? panjikaToday.tithiBn : panjikaToday.tithiEn}</Text>
          <View style={styles.tithiPillsRow}>
            <View style={styles.tithiPill}>
              <Text style={styles.pillText}>🌟 {panjikaToday.nakshatra}</Text>
            </View>
            <View style={styles.tithiPill}>
              <Text style={styles.pillText}>✨ অমৃতযোগ: {panjikaToday.amritaYoga}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Quick Seva Actions Grid */}
      <Text style={styles.sectionHeading}>{isBn ? 'পবিত্র সেবা ও পূজা' : 'Sacred Sevas & Pujas'}</Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#FFF3E0' }]}
          onPress={() => onOpenBooking && onOpenBooking(featuredTemples[0])}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🪔</Text>
          <Text style={styles.actionTitle}>{isBn ? 'সংকল্প পূজা বুকিং' : 'Book Puja'}</Text>
          <Text style={styles.actionDesc}>{isBn ? 'নাম ও গোত্র সংকল্প' : 'With Name & Gotra'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#FFEBEE' }]}
          onPress={() => onOpenDonation && onOpenDonation('GAU_SEVA')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🐄</Text>
          <Text style={styles.actionTitle}>{isBn ? 'গো-সেবা ও চড়াবা' : 'Gau Seva & Chadhava'}</Text>
          <Text style={styles.actionDesc}>{isBn ? 'পুণ্য অর্জন করুন' : 'Offer Sacred Care'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#E8F5E9' }]}
          onPress={() => onNavigate('TEMPLES')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🛕</Text>
          <Text style={styles.actionTitle}>{isBn ? 'মন্দির নির্দেশিকা' : 'Temples Directory'}</Text>
          <Text style={styles.actionDesc}>{isBn ? 'দর্শন ও আরতি সময়' : 'Darshan & Timings'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#F3E5F5' }]}
          onPress={() => onNavigate('MANTRAS')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🔔</Text>
          <Text style={styles.actionTitle}>{isBn ? 'বেদমন্ত্র ও স্তোত্র' : 'Sacred Mantras'}</Text>
          <Text style={styles.actionDesc}>{isBn ? 'শ্রবণ ও জপ' : 'Listen & Chant'}</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Temples Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>{isBn ? 'জাগ্রত মন্দিরসমূহ' : 'Featured Temples'}</Text>
        <TouchableOpacity onPress={() => onNavigate('TEMPLES')}>
          <Text style={styles.viewAllText}>{isBn ? 'সব দেখুন →' : 'View All →'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.mandirRed} style={{ marginVertical: 20 }} />
      ) : (
        featuredTemples.map((temple) => (
          <View key={temple.id} style={styles.templeCard}>
            <View style={styles.templeInfo}>
              <Text style={styles.templeName}>{isBn ? temple.name_bn : temple.name_en}</Text>
              <Text style={styles.templeDeity}>
                🙏 {isBn ? temple.deity_bn : temple.deity_en} • 📍 {isBn ? temple.district_bn : temple.district_en}
              </Text>
              <Text style={styles.templeTimings}>🕒 {temple.darshan_timings}</Text>
            </View>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => onOpenBooking && onOpenBooking(temple)}
              activeOpacity={0.8}
            >
              <Text style={styles.bookBtnText}>{isBn ? 'পূজা বুক করুন' : 'Book Puja'}</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  heroBanner: {
    backgroundColor: Colors.mandirRed,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.mandirGold,
    marginBottom: 16,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  heroGreeting: {
    color: Colors.mandirGoldLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroTagline: {
    color: Colors.pureWhite,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  heroOm: {
    fontSize: 38,
  },
  tithiCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.mandirGold,
    marginBottom: 18,
  },
  tithiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tithiIcon: {
    fontSize: 16,
  },
  tithiTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  tithiDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  tithiDetails: {
    fontSize: 12,
    color: Colors.saffronRed,
    fontWeight: '600',
    marginTop: 2,
  },
  tithiPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tithiPill: {
    backgroundColor: '#FFE082',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  pillText: {
    fontSize: 10.5,
    color: Colors.textDark,
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  viewAllText: {
    color: Colors.saffronRed,
    fontWeight: 'bold',
    fontSize: 13,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  actionCard: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    alignItems: 'flex-start',
  },
  actionIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  actionDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  templeCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templeInfo: {
    flex: 1,
    paddingRight: 8,
  },
  templeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  templeDeity: {
    fontSize: 11.5,
    color: Colors.textDark,
    marginTop: 2,
  },
  templeTimings: {
    fontSize: 10.5,
    color: Colors.textMuted,
    marginTop: 2,
  },
  bookBtn: {
    backgroundColor: Colors.saffronRed,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  bookBtnText: {
    color: Colors.pureWhite,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
