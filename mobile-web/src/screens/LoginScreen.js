import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';

export default function LoginScreen({ onClose }) {
  const { user, login, logout, loading, loginError, isBn, dummyAccounts } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = async () => {
    if (!email || !password) return;
    const res = await login(email, password);
    if (res.success && onClose) {
      onClose();
    }
  };

  const handleQuickLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    const res = await login(acc.email, acc.password);
    if (res.success && onClose) {
      onClose();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.diya}>🪔</Text>
          <View>
            <Text style={styles.title}>
              {user ? (isBn ? 'ব্যবহারকারীর বিবরণ' : 'User Profile') : (isBn ? 'লগইন ও প্রোফাইল' : 'Account Login')}
            </Text>
            <Text style={styles.subtitle}>
              {isBn ? 'ভক্ত, পুরোহিত, ট্রাস্টি বা অ্যাডমিন হিসেবে প্রবেশ করুন' : 'Sign in as Devotee, Priest, Trustee, or Admin'}
            </Text>
          </View>
        </View>

        {user ? (
          <View style={styles.profileSection}>
            <View style={styles.profileBadge}>
              <Text style={styles.profileAvatar}>👤</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{user.fullName || user.email}</Text>
                <Text style={styles.profileRole}>
                  {isBn ? 'ভূমিকা: ' : 'Role: '}
                  <Text style={{ color: Colors.saffronRed, fontWeight: 'bold' }}>{user.role}</Text>
                </Text>
                {user.gotra && (
                  <Text style={styles.profileMeta}>
                    {isBn ? 'গোত্র: ' : 'Gotra: '}{user.gotra}
                  </Text>
                )}
                {user.templeNameEn && (
                  <Text style={styles.profileMeta}>
                    {isBn ? 'সংযুক্ত মন্দির: ' : 'Temple: '}{isBn ? (user.templeNameBn || user.templeNameEn) : user.templeNameEn}
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
              <Text style={styles.logoutBtnText}>{isBn ? 'লগআউট করুন' : 'Log Out'}</Text>
            </TouchableOpacity>

            <View style={styles.separator} />
            <Text style={styles.sectionHeader}>
              {isBn ? 'ভূমিকা পরিবর্তন করুন (Dummy Accounts Switch):' : 'Switch Role with Pre-seeded Database Records:'}
            </Text>
          </View>
        ) : (
          <View style={styles.formSection}>
            {loginError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {loginError}</Text>
              </View>
            )}

            <Text style={styles.inputLabel}>{isBn ? 'ইমেল আইডি' : 'Email Address'}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. devotee@mandirsetu.org"
              placeholderTextColor="#A08E85"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>{isBn ? 'পাসওয়ার্ড' : 'Password'}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#A08E85"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleCustomLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={Colors.pureWhite} />
              ) : (
                <Text style={styles.submitBtnText}>{isBn ? 'লগইন করুন' : 'Sign In'}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.separator} />

            <Text style={styles.sectionHeader}>
              {isBn ? 'দ্রুত ডেমো লগইন (Pre-seeded DB Accounts):' : 'One-Click Fast Demo Login (Postgres DB):'}
            </Text>
          </View>
        )}

        {/* 1-Click Fast Login for All Roles */}
        <View style={styles.quickGrid}>
          {dummyAccounts.map((acc) => (
            <TouchableOpacity
              key={acc.role}
              style={[
                styles.quickCard,
                user?.role === acc.role && styles.quickCardActive
              ]}
              onPress={() => handleQuickLogin(acc)}
              activeOpacity={0.7}
            >
              <View style={styles.quickCardHeader}>
                <Text style={styles.quickRoleBadge}>
                  {acc.role === 'SUPER_ADMIN' ? '👑 Admin' : acc.role === 'PRIEST' ? '🪔 Priest' : acc.role === 'TRUSTEE' ? '📜 Trustee' : '🙏 Devotee'}
                </Text>
                {user?.role === acc.role && <Text style={styles.activeCheck}>✓ Active</Text>}
              </View>
              <Text style={styles.quickName}>{acc.name}</Text>
              <Text style={styles.quickEmail}>{acc.email}</Text>
              <Text style={styles.quickCreds}>Pass: {acc.password}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {onClose && (
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>{isBn ? 'বন্ধ করুন' : 'Close'}</Text>
          </TouchableOpacity>
        )}
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
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  diya: {
    fontSize: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  formSection: {
    width: '100%',
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: Colors.crimson,
    fontSize: 12,
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.saffronRed, // Saffron Red font color for user entered text
    fontWeight: '600',
    backgroundColor: '#FFFDF9',
  },
  submitBtn: {
    backgroundColor: Colors.saffronRed,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: Colors.saffronRed,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  submitBtnText: {
    color: Colors.pureWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#EAE1D7',
    marginVertical: 18,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
    marginBottom: 12,
  },
  quickGrid: {
    gap: 10,
  },
  quickCard: {
    borderWidth: 1,
    borderColor: Colors.borderGold,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFAF0',
  },
  quickCardActive: {
    borderColor: Colors.saffronRed,
    borderWidth: 2,
    backgroundColor: '#FFF3E0',
  },
  quickCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickRoleBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  activeCheck: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.saffronRed,
  },
  quickName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textDark,
  },
  quickEmail: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  quickCreds: {
    fontSize: 10.5,
    color: Colors.saffronRed,
    fontWeight: 'bold',
    marginTop: 2,
  },
  profileSection: {
    width: '100%',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF8E1',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.mandirGold,
    marginBottom: 14,
  },
  profileAvatar: {
    fontSize: 34,
  },
  profileName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  profileRole: {
    fontSize: 12,
    color: Colors.textDark,
    marginTop: 2,
  },
  profileMeta: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: Colors.crimson,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: Colors.crimson,
    fontWeight: 'bold',
    fontSize: 13,
  },
  closeBtn: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});
