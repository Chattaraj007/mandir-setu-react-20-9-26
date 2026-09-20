import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';

export default function Header({ onOpenLogin }) {
  const { user, isBn, setIsBn, logout } = useContext(AuthContext);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { labelBn: 'অ্যাডমিন', labelEn: 'Admin', color: Colors.crimson };
      case 'PRIEST':
        return { labelBn: 'পুরোহিত', labelEn: 'Priest', color: Colors.saffronRed };
      case 'TRUSTEE':
        return { labelBn: 'ট্রাস্টি', labelEn: 'Trustee', color: '#6A1B9A' };
      default:
        return { labelBn: 'ভক্ত', labelEn: 'Devotee', color: Colors.mandirRed };
    }
  };

  const badge = getRoleBadge(user?.role);

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.branding}>
          <Text style={styles.diyaIcon}>🪔</Text>
          <View>
            <Text style={styles.title}>মন্দির সেতু • Mandir Setu</Text>
            <Text style={styles.subtitle}>
              {isBn ? 'পশ্চিমবঙ্গের জাগ্রত তীর্থ ও সেবা পোর্টাল' : 'Sacred West Bengal Temples & Seva'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          {/* Language Toggle */}
          <TouchableOpacity
            style={styles.langButton}
            onPress={() => setIsBn(!isBn)}
            activeOpacity={0.7}
          >
            <Text style={styles.langButtonText}>{isBn ? 'EN' : 'বাংলা'}</Text>
          </TouchableOpacity>

          {/* User Account / Role Badge */}
          {user ? (
            <TouchableOpacity style={[styles.roleBadge, { backgroundColor: badge.color }]} onPress={onOpenLogin}>
              <Text style={styles.roleBadgeText}>{isBn ? badge.labelBn : badge.labelEn}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginBtn} onPress={onOpenLogin}>
              <Text style={styles.loginBtnText}>{isBn ? 'লগইন' : 'Login'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.mandirRed,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.mandirGold,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diyaIcon: {
    fontSize: 26,
  },
  title: {
    color: Colors.pureWhite,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: Colors.mandirGoldLight,
    fontSize: 10.5,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.mandirGold,
  },
  langButtonText: {
    color: Colors.pureWhite,
    fontWeight: 'bold',
    fontSize: 12,
  },
  roleBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.mandirGoldLight,
  },
  roleBadgeText: {
    color: Colors.pureWhite,
    fontSize: 11,
    fontWeight: 'bold',
  },
  loginBtn: {
    backgroundColor: Colors.mandirGold,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  loginBtnText: {
    color: Colors.mandirRedDark,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
