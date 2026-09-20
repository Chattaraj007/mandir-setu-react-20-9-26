import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { apiRequest } from '../api/client';

export default function PanjikaScreen() {
  const { isBn } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState(1433);
  const [festivals, setFestivals] = useState([]);
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  const years = [1433, 1434, 1435, 1436, 1437, 1438];

  useEffect(() => {
    async function loadPanjika() {
      setLoading(true);
      const [todayRes, festRes] = await Promise.all([
        apiRequest('/api/panjika/today'),
        apiRequest(`/api/panjika/festivals?year=${selectedYear}`)
      ]);

      if (todayRes && todayRes.success) setTodayData(todayRes.data);
      if (festRes && festRes.success) setFestivals(festRes.data);
      setLoading(false);
    }
    loadPanjika();
  }, [selectedYear]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with Year Selector */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>
          📅 {isBn ? 'শ্রী শ্রী গুপ্তপ্রেস ও বিশুদ্ধসিদ্ধান্ত পঞ্জিকা' : 'Authentic Bengali Panjika & Almanac'}
        </Text>
        <Text style={styles.headerSub}>
          {isBn ? 'তিথি, নক্ষত্র, যোগ, বারবেলা ও সনাতন উৎসব নির্ঘণ্ট' : 'Tithi, Nakshatra, Auspicious Muhurats & Festival Almanac'}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearsRow}>
          {years.map((yr) => {
            const isSelected = selectedYear === yr;
            return (
              <TouchableOpacity
                key={yr}
                style={[styles.yearChip, isSelected && styles.yearChipActive]}
                onPress={() => setSelectedYear(yr)}
              >
                <Text style={[styles.yearText, isSelected && styles.yearTextActive]}>
                  {yr} বঙ্গাব্দ
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Today's Muhurat Details Card */}
      {todayData && (
        <View style={styles.todayCard}>
          <Text style={styles.todayDate}>{todayData.bengaliDate}</Text>
          <Text style={styles.todayTithi}>{isBn ? todayData.tithiBn : todayData.tithiEn}</Text>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>🌟 {isBn ? 'নক্ষত্র' : 'Nakshatra'}</Text>
              <Text style={styles.gridVal}>{todayData.nakshatra}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>🧘 {isBn ? 'যোগ' : 'Yoga'}</Text>
              <Text style={styles.gridVal}>{todayData.yoga}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>🌅 {isBn ? 'সূর্যোদয়' : 'Sunrise'}</Text>
              <Text style={styles.gridVal}>{todayData.suryaUdaya}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>🌇 {isBn ? 'সূর্যাস্ত' : 'Sunset'}</Text>
              <Text style={styles.gridVal}>{todayData.suryaAsta}</Text>
            </View>
          </View>

          <View style={styles.amritaBox}>
            <Text style={styles.amritaText}>
              ✨ {isBn ? 'অমৃতযোগ:' : 'Amrita Yoga:'} {todayData.amritaYoga}
            </Text>
            <Text style={styles.rahuText}>
              ⚠️ {isBn ? 'রাহুকাল:' : 'Rahukaal:'} {todayData.rahukaal}
            </Text>
          </View>
        </View>
      )}

      {/* Festivals List */}
      <Text style={styles.sectionHeading}>
        {isBn ? `${selectedYear} বঙ্গাব্দের প্রধান পার্বণ ও ব্রতোৎসব` : `Major Sacred Festivals (${selectedYear} BS)`}
      </Text>

      {loading ? (
        <ActivityIndicator color={Colors.mandirRed} style={{ marginTop: 20 }} />
      ) : (
        festivals.map((fest, idx) => (
          <View key={idx} style={styles.festCard}>
            <View style={styles.festIconCol}>
              <Text style={styles.festIcon}>🪔</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.festName}>{isBn ? fest.nameBn : fest.nameEn}</Text>
              <Text style={styles.festSub}>
                {fest.type === 'GRAND' ? '🌟 মহাপার্বণ' : '✨ শুভ তিথি'} • {fest.day} {fest.month}
              </Text>
            </View>
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
  headerBox: {
    backgroundColor: Colors.mandirRed,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.mandirGold,
    marginBottom: 16,
  },
  headerTitle: {
    color: Colors.pureWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerSub: {
    color: Colors.mandirGoldLight,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12,
  },
  yearsRow: {
    flexDirection: 'row',
  },
  yearChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.mandirGold,
  },
  yearChipActive: {
    backgroundColor: Colors.mandirGold,
  },
  yearText: {
    color: Colors.pureWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  yearTextActive: {
    color: Colors.mandirRedDark,
    fontWeight: 'bold',
  },
  todayCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    marginBottom: 18,
  },
  todayDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  todayTithi: {
    fontSize: 13,
    color: Colors.saffronRed,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    flexBasis: '48%',
    backgroundColor: '#FAF5EE',
    padding: 8,
    borderRadius: 8,
  },
  gridLabel: {
    fontSize: 10.5,
    color: Colors.textMuted,
  },
  gridVal: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textDark,
    marginTop: 2,
  },
  amritaBox: {
    backgroundColor: '#FFF8E1',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.mandirGold,
  },
  amritaText: {
    fontSize: 11.5,
    color: Colors.textDark,
    fontWeight: 'bold',
  },
  rahuText: {
    fontSize: 11.5,
    color: Colors.crimson,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
    marginBottom: 10,
  },
  festCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  festIconCol: {
    width: 32,
    alignItems: 'center',
  },
  festIcon: {
    fontSize: 20,
  },
  festName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  festSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
