import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { apiRequest } from '../api/client';

export default function DonationModal({ cause = 'GAU_SEVA', onClose, onDonationSuccess }) {
  const { user, token, isBn } = useContext(AuthContext);

  const [donorName, setDonorName] = useState(user?.fullName || 'Anonymous Devotee');
  const [amount, setAmount] = useState('501');
  const [gotra, setGotra] = useState(user?.gotra || 'Kashyapa');
  const [submitting, setSubmitting] = useState(false);

  const causes = [
    { id: 'GAU_SEVA', labelBn: '🐄 সুরভী গো-সেবা', labelEn: 'Cow Seva (Gau Seva)' },
    { id: 'TEMPLE_RENOVATION', labelBn: '🏛️ মন্দির সংস্কার ও জীর্ণোদ্ধার', labelEn: 'Temple Renovation' },
    { id: 'ANNADAN', labelBn: '🍚 মহাপ্রসাদ অন্নদান', labelEn: 'Daily Annadan' }
  ];

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    const res = await apiRequest('/api/donations', {
      method: 'POST',
      token,
      body: JSON.stringify({
        templeId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Kalighat / General
        donorName,
        causeType: cause,
        amount: parseFloat(amount),
        gotra,
        paymentMethod: 'UPI'
      })
    });
    setSubmitting(false);

    if (res && res.success) {
      alert(isBn ? '🙏 দান সফল হয়েছে! আপনার পুণ্য সংকল্প গৃহীত হলো।' : '🙏 Sacred offering acknowledged! Receipt saved.');
      if (onDonationSuccess) onDonationSuccess();
      if (onClose) onClose();
    } else {
      alert(res?.message || 'Donation failed.');
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isBn ? 'পুণ্য দান ও চড়াবা নিবেদন' : 'Sacred Offering / Donation'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 18, color: Colors.textMuted }}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{isBn ? 'সেবা নির্বাচন' : 'Cause'}</Text>
        <View style={styles.causeRow}>
          {causes.map((c) => (
            <View key={c.id} style={[styles.causeChip, cause === c.id && styles.causeChipActive]}>
              <Text style={[styles.causeText, cause === c.id && styles.causeTextActive]}>
                {isBn ? c.labelBn : c.labelEn}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.label}>{isBn ? 'দাতার নাম' : 'Donor Name'}</Text>
        <TextInput
          style={styles.input}
          value={donorName}
          onChangeText={setDonorName}
        />

        <Text style={styles.label}>{isBn ? 'দানের পরিমাণ (₹)' : 'Amount (₹)'}</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <View style={styles.presetRow}>
          {['101', '251', '501', '1100', '2100'].map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.presetBtn, amount === val && styles.presetBtnActive]}
              onPress={() => setAmount(val)}
            >
              <Text style={[styles.presetText, amount === val && styles.presetTextActive]}>
                ₹{val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleDonate}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.pureWhite} />
          ) : (
            <Text style={styles.submitBtnText}>
              {isBn ? `₹${amount} সমর্পণ করুন` : `Offer ₹${amount}`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 100,
  },
  card: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    padding: 18,
    width: '100%',
    maxWidth: 440,
    borderWidth: 1.5,
    borderColor: Colors.mandirGold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  label: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginTop: 8,
    marginBottom: 4,
  },
  causeRow: {
    gap: 4,
    marginBottom: 8,
  },
  causeChip: {
    backgroundColor: '#FAF5EE',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  causeChipActive: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.saffronRed,
  },
  causeText: {
    fontSize: 12,
    color: Colors.textDark,
  },
  causeTextActive: {
    fontWeight: 'bold',
    color: Colors.saffronRed,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13.5,
    color: Colors.saffronRed, // Saffron Red font
    fontWeight: 'bold',
    backgroundColor: '#FFFDF9',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    marginBottom: 16,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
  },
  presetBtnActive: {
    backgroundColor: Colors.saffronRed,
    borderColor: Colors.saffronRed,
  },
  presetText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  presetTextActive: {
    color: Colors.pureWhite,
  },
  submitBtn: {
    backgroundColor: Colors.mandirRed,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBtnText: {
    color: Colors.mandirGoldLight,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
