import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { apiRequest } from '../api/client';

export default function TemplesScreen({ onOpenBooking }) {
  const { isBn } = useContext(AuthContext);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  const districts = [
    { id: 'ALL', labelBn: 'সব জেলা', labelEn: 'All Districts' },
    { id: 'Kolkata', labelBn: 'কলকাতা', labelEn: 'Kolkata' },
    { id: 'North 24 Parganas', labelBn: 'উত্তর ২৪ পরগনা', labelEn: 'North 24 Parganas' },
    { id: 'Birbhum', labelBn: 'বীরভূম', labelEn: 'Birbhum' },
    { id: 'Nadia', labelBn: 'নদিয়া', labelEn: 'Nadia' },
    { id: 'Howrah', labelBn: 'হাওড়া', labelEn: 'Howrah' }
  ];

  useEffect(() => {
    async function loadTemples() {
      setLoading(true);
      let endpoint = '/api/temples';
      const params = [];
      if (selectedDistrict !== 'ALL') params.push(`district=${encodeURIComponent(selectedDistrict)}`);
      if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
      if (params.length > 0) endpoint += `?${params.join('&')}`;

      const res = await apiRequest(endpoint);
      if (res && res.success && res.data) {
        setTemples(res.data);
      }
      setLoading(false);
    }
    loadTemples();
  }, [selectedDistrict, search]);

  const renderTempleCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.templeName}>{isBn ? item.name_bn : item.name_en}</Text>
          <Text style={styles.deityName}>
            🙏 {isBn ? item.deity_bn : item.deity_en}
          </Text>
        </View>
        <View style={styles.districtBadge}>
          <Text style={styles.districtText}>{isBn ? item.district_bn : item.district_en}</Text>
        </View>
      </View>

      <Text style={styles.location}>📍 {isBn ? item.location_bn : item.location_en}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {isBn ? item.description_bn : item.description_en}
      </Text>

      <View style={styles.timingsRow}>
        <Text style={styles.timingText}>🕒 দর্শন: {item.darshan_timings || '06:00 AM - 09:00 PM'}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.bookPujaBtn}
          onPress={() => onOpenBooking && onOpenBooking(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.bookPujaBtnText}>{isBn ? '🪔 পূজা সংকল্প বুক করুন' : '🪔 Book Puja Sankalp'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Input (Saffron Red text styling) */}
      <View style={styles.searchBoxContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={isBn ? 'মন্দির বা দেবদেবীর নাম দিয়ে খুঁজুন...' : 'Search temple or deity name...'}
          placeholderTextColor="#9E8D84"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* District Selector Chips */}
      <View style={styles.chipsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={districts}
          keyExtractor={(d) => d.id}
          renderItem={({ item }) => {
            const isSelected = selectedDistrict === item.id;
            return (
              <TouchableOpacity
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedDistrict(item.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {isBn ? item.labelBn : item.labelEn}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        />
      </View>

      {/* Temples List */}
      {loading ? (
        <ActivityIndicator color={Colors.mandirRed} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={temples}
          keyExtractor={(t) => t.id}
          renderItem={renderTempleCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 32 }}>🏛️</Text>
              <Text style={styles.emptyText}>
                {isBn ? 'কোনো মন্দির পাওয়া যায়নি' : 'No temples found matching criteria'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  searchBoxContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: Colors.pureWhite,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.saffronRed, // Saffron Red font styling for user input
    fontWeight: '600',
  },
  chipsContainer: {
    marginBottom: 8,
  },
  chip: {
    backgroundColor: Colors.pureWhite,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  chipSelected: {
    backgroundColor: Colors.saffronRed,
    borderColor: Colors.saffronRed,
  },
  chipText: {
    fontSize: 12,
    color: Colors.textDark,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.pureWhite,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
  },
  card: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  templeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  deityName: {
    fontSize: 13,
    color: Colors.saffronRed,
    fontWeight: '600',
    marginTop: 2,
  },
  districtBadge: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: Colors.mandirGold,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  districtText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  location: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: Colors.textDark,
    lineHeight: 17,
    marginBottom: 10,
  },
  timingsRow: {
    backgroundColor: '#FAF5EE',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  timingText: {
    fontSize: 11.5,
    color: Colors.textMuted,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bookPujaBtn: {
    backgroundColor: Colors.saffronRed,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bookPujaBtnText: {
    color: Colors.pureWhite,
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
});
