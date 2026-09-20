import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';

export default function BottomNav({ activeTab, onSelectTab }) {
  const { isBn, user } = useContext(AuthContext);

  const tabs = [
    { id: 'HOME', icon: '🏛️', labelBn: 'হোম', labelEn: 'Home' },
    { id: 'TEMPLES', icon: '🛕', labelBn: 'মন্দিরসমূহ', labelEn: 'Temples' },
    { id: 'PANJIKA', icon: '📅', labelBn: 'পঞ্জিকা', labelEn: 'Panjika' },
    { id: 'MANTRAS', icon: '🔔', labelBn: 'বেদমন্ত্র', labelEn: 'Mantras' },
    {
      id: 'DASHBOARD',
      icon: '📊',
      labelBn: user?.role === 'DEVOTEE' ? 'আমার পূজা' : 'ড্যাশবোর্ড',
      labelEn: user?.role === 'DEVOTEE' ? 'My Pujas' : 'Dashboard'
    },
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabItem, isSelected && styles.tabItemActive]}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, isSelected && styles.tabLabelActive]}>
              {isBn ? tab.labelBn : tab.labelEn}
            </Text>
            {isSelected && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: Colors.pureWhite,
    borderTopWidth: 1.5,
    borderTopColor: Colors.borderGold,
    paddingVertical: 6,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: 'rgba(216, 67, 21, 0.08)',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.saffronRed, // Saffron Red for active tab
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    backgroundColor: Colors.saffronRed,
    borderRadius: 2,
  },
});
