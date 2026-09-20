import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';

export default function MantrasScreen() {
  const { isBn } = useContext(AuthContext);
  const [activeMantraIndex, setActiveMantraIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [japaCount, setJapaCount] = useState(0);

  const mantras = [
    {
      id: 'GAYATRI',
      titleBn: 'গায়ত্রী মহামন্ত্র (সবিতা উপাসনা)',
      titleEn: 'Gayatri Mahamantra',
      deity: 'Surya / Savitur',
      sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
      bengali: 'ওঁ ভূর্ভুবঃ স্বঃ তৎসবিতুর্বরেণ্যং ভর্গো দেবস্য ধীমহি ধিয়ো য়ো নঃ প্রচোদয়াৎ॥',
      meaningBn: 'আমরা সেই পরম তেজস্বী সূর্যদেবের জ্যোতিকে ধ্যান করি, যিনি আমাদের বুদ্ধিকে সত্য ও ধর্মের পথে পরিচালিত করেন।',
      meaningEn: 'We meditate on that most adorable divine splendor of the Sun, may He illuminate and guide our intellect.'
    },
    {
      id: 'MAHAMRITYUNJAYA',
      titleBn: 'মহামৃত্যুঞ্জয় মন্ত্র (শ্রী শিব স্তব)',
      titleEn: 'Maha Mrityunjaya Mantra',
      deity: 'Lord Shiva',
      sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥',
      bengali: 'ওঁ ত্র্যম্বকং যজামহে সুগন্ধিং পুষ্টিবর্ধনম্। উর্বারুকমিব বন্ধনামৃত্যোর্মুক্ষীয় মামৃতাৎ॥',
      meaningBn: 'আমরা ত্রিনয়ন সুগন্ধযুক্ত পুষ্টিবর্ধক শিবের আরাধনা করি। তিনি যেন আমাদের মৃত্যুর বন্ধন থেকে মুক্ত করে অমৃতত্ব প্রদান করেন।',
      meaningEn: 'We worship the three-eyed Lord Shiva who nourishes all beings. May He liberate us from death and bestow immortality.'
    },
    {
      id: 'KALI_BEEJ',
      titleBn: 'শ্রীশ্রী দক্ষিণাকালিকা বীজমন্ত্র',
      titleEn: 'Dakshina Kali Beej Mantra',
      deity: 'Maa Kali',
      sanskrit: 'ॐ क्रीं क्रीं क्रीं हूं हूं ह्रीं ह्रीं दक्षिणे कालिके क्रीं क्रीं क्रीं हूं हूं ह्रीं ह্রিं स्वाहा॥',
      bengali: 'ওঁ ক্রীং ক্রীং ক্রীং হুং হুং হ্রীং হ্রীং দক্ষিণে কালিকে ক্রীং ক্রীং ক্রীং হুং হুং হ্রীং হ্রীং স্বাহা॥',
      meaningBn: 'কালীঘাটের জাগ্রত মহাকালী দেবীর সর্ববিঘ্ননাশিনী ও শত্রুভয়বিনাশিনী মহাশক্তি মন্ত্র।',
      meaningEn: 'The supreme shakti mantra invoking Goddess Mahakali for protection and overcoming all obstacles.'
    }
  ];

  const current = mantras[activeMantraIndex];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🔔</Text>
        <View>
          <Text style={styles.headerTitle}>
            {isBn ? 'বেদমন্ত্র ও পবিত্র দেবস্তোত্র' : 'Sacred Vedic Mantras & Chants'}
          </Text>
          <Text style={styles.headerSub}>
            {isBn ? 'শান্তি, সংকল্প ও ১০৮ বার জপ' : '108 Sacred Chants & Inner Peace'}
          </Text>
        </View>
      </View>

      {/* Mantra Selector Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
        {mantras.map((m, idx) => {
          const isSelected = activeMantraIndex === idx;
          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.tabChip, isSelected && styles.tabChipActive]}
              onPress={() => {
                setActiveMantraIndex(idx);
                setJapaCount(0);
                setIsPlaying(false);
              }}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {isBn ? m.titleBn.split(' ')[0] : m.titleEn.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Main Mantra Card */}
      <View style={styles.mantraCard}>
        <Text style={styles.mantraTitle}>{isBn ? current.titleBn : current.titleEn}</Text>
        <Text style={styles.deityBadge}>🙏 {current.deity}</Text>

        <View style={styles.verseBox}>
          <Text style={styles.sanskritText}>{current.sanskrit}</Text>
          <Text style={styles.bengaliText}>{current.bengali}</Text>
        </View>

        <Text style={styles.meaningTitle}>{isBn ? 'আধ্যাত্মিক অর্থ:' : 'Spiritual Meaning:'}</Text>
        <Text style={styles.meaningText}>{isBn ? current.meaningBn : current.meaningEn}</Text>

        {/* Chanting Player Controls */}
        <View style={styles.playerControls}>
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => setIsPlaying(!isPlaying)}
            activeOpacity={0.8}
          >
            <Text style={styles.playBtnText}>
              {isPlaying ? '⏸️ বিরতি (Pause)' : '▶️ জপ শুনুন (Play)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.japaBtn}
            onPress={() => setJapaCount((prev) => (prev < 108 ? prev + 1 : 1))}
            activeOpacity={0.7}
          >
            <Text style={styles.japaBtnText}>📿 জপ করুন: {japaCount}/108</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.mandirRed,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.mandirGold,
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.pureWhite,
  },
  headerSub: {
    fontSize: 11,
    color: Colors.mandirGoldLight,
    marginTop: 2,
  },
  tabsRow: {
    marginBottom: 14,
  },
  tabChip: {
    backgroundColor: Colors.pureWhite,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginRight: 8,
  },
  tabChipActive: {
    backgroundColor: Colors.saffronRed,
    borderColor: Colors.saffronRed,
  },
  tabText: {
    fontSize: 12,
    color: Colors.textDark,
  },
  tabTextActive: {
    color: Colors.pureWhite,
    fontWeight: 'bold',
  },
  mantraCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
  },
  mantraTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  deityBadge: {
    fontSize: 12,
    color: Colors.saffronRed,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 12,
  },
  verseBox: {
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    marginBottom: 12,
  },
  sanskritText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  bengaliText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textDark,
    textAlign: 'center',
  },
  meaningTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 16,
  },
  playerControls: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  playBtn: {
    flex: 1,
    backgroundColor: Colors.mandirRed,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  playBtnText: {
    color: Colors.mandirGoldLight,
    fontWeight: 'bold',
    fontSize: 12.5,
  },
  japaBtn: {
    flex: 1,
    backgroundColor: Colors.saffronRed,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  japaBtnText: {
    color: Colors.pureWhite,
    fontWeight: 'bold',
    fontSize: 12.5,
  },
});
