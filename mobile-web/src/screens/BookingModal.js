import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { apiRequest } from '../api/client';

export default function BookingModal({ temple, onClose, onBookingSuccess }) {
  const { user, token, isBn } = useContext(AuthContext);

  const [devoteeName, setDevoteeName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '+919830012345');
  const [gotra, setGotra] = useState(user?.gotra || 'Kashyapa');
  const [pujaDate, setPujaDate] = useState('2026-09-22');
  const [tithiTime, setTithiTime] = useState('Shukla Dashami (Morning 08:00 AM)');
  const [sankalpWish, setSankalpWish] = useState('Family peace, health, and prosperity');
  const [prasadAddress, setPrasadAddress] = useState('Flat 4B, Mandir Enclave, Kolkata');
  const [selectedOfferingPrice, setSelectedOfferingPrice] = useState('501');
  const [submitting, setSubmitting] = useState(false);

  const gotras = ['Kashyapa (কশ্যপ)', 'Sandilya (শাণ্ডিল্য)', 'Bharadwaja (ভরদ্বাজ)', 'Gautama (গৌতম)', 'Vatsa (বাৎস্য)', 'Alambayana (আলম্বায়ন)'];

  const handleSubmit = async () => {
    if (!devoteeName || !phone) {
      alert(isBn ? 'দয়া করে নাম এবং ফোন নম্বর পূরণ করুন' : 'Please fill devotee name and phone number');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest('/api/bookings', {
        method: 'POST',
        token,
        body: JSON.stringify({
          templeId: temple?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          devoteeName,
          devoteePhone: phone,
          gotra: gotra.split(' ')[0],
          pujaDate,
          tithiTime,
          sankalpWish,
          prasadAddress,
          totalAmount: parseFloat(selectedOfferingPrice)
        })
      });

      setSubmitting(false);
      if (res && res.success) {
        alert(isBn ? '✅ আপনার সংকল্প পূজা বুকিং সফল হয়েছে! প্রসাদ প্রস্তুত হলে জানানো হবে।' : '✅ Puja Booking Confirmed! Priest and Prasad dispatch details recorded.');
        if (onBookingSuccess) onBookingSuccess();
        if (onClose) onClose();
      } else {
        alert(res?.message || 'Booking submission failed. Check DB connection.');
      }
    } catch (e) {
      setSubmitting(false);
      alert('Error: ' + e.message);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            🪔 {isBn ? 'সংকল্প পূজা বুকিং' : 'Sacred Puja Booking'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Text style={{ fontSize: 18, color: Colors.textMuted }}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.templeBanner}>
          🏛️ {isBn ? (temple?.name_bn || 'কালীঘাট কালী মন্দির') : (temple?.name_en || 'Kalighat Kali Temple')}
        </Text>

        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
          {/* Devotee Name (Saffron Red text) */}
          <Text style={styles.label}>{isBn ? 'ভক্তের নাম' : 'Devotee Name'} *</Text>
          <TextInput
            style={styles.input}
            value={devoteeName}
            onChangeText={setDevoteeName}
            placeholder="e.g. Ananya Sen"
            placeholderTextColor="#A08E85"
          />

          {/* Contact Phone (Saffron Red text) */}
          <Text style={styles.label}>{isBn ? 'মোবাইল নম্বর' : 'Mobile Number'} *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91..."
            placeholderTextColor="#A08E85"
          />

          {/* Gotra Selector Chips */}
          <Text style={styles.label}>{isBn ? 'গোত্র নির্বাচন করুন' : 'Select Gotra'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            {gotras.map((g) => {
              const gKey = g.split(' ')[0];
              const isSelected = gotra.startsWith(gKey);
              return (
                <TouchableOpacity
                  key={g}
                  style={[styles.gotraChip, isSelected && styles.gotraChipActive]}
                  onPress={() => setGotra(gKey)}
                >
                  <Text style={[styles.gotraText, isSelected && styles.gotraTextActive]}>{g}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Offering Choice */}
          <Text style={styles.label}>{isBn ? 'পূজা দক্ষিণা / সেবা মূল্য' : 'Offering Tier'}</Text>
          <View style={styles.priceRow}>
            {['501', '1100', '2100', '5001'].map((amt) => {
              const isSelected = selectedOfferingPrice === amt;
              return (
                <TouchableOpacity
                  key={amt}
                  style={[styles.priceBtn, isSelected && styles.priceBtnActive]}
                  onPress={() => setSelectedOfferingPrice(amt)}
                >
                  <Text style={[styles.priceBtnText, isSelected && styles.priceBtnTextActive]}>
                    ₹{amt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sankalp Wish */}
          <Text style={styles.label}>{isBn ? 'সংকল্প প্রার্থনা / মনস্কামনা' : 'Sankalp Wish / Prayer'}</Text>
          <TextInput
            style={[styles.input, { height: 65, textAlignVertical: 'top' }]}
            value={sankalpWish}
            onChangeText={setSankalpWish}
            multiline
          />

          {/* Prasad Delivery Address */}
          <Text style={styles.label}>{isBn ? 'প্রসাদ বিতরণের ডাকঠিকানা (Courier Address)' : 'Prasad Delivery Address'}</Text>
          <TextInput
            style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
            value={prasadAddress}
            onChangeText={setPrasadAddress}
            multiline
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color={Colors.pureWhite} />
            ) : (
              <Text style={styles.submitBtnText}>
                {isBn ? `₹${selectedOfferingPrice} দক্ষিণা পরিশোধ করে পূজা সম্পন্ন করুন` : `Confirm Puja (₹${selectedOfferingPrice})`}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 100,
  },
  modalCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 18,
    padding: 18,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderWidth: 1.5,
    borderColor: Colors.mandirGold,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  closeIcon: {
    padding: 4,
  },
  templeBanner: {
    backgroundColor: '#FFF8E1',
    color: Colors.mandirRedDark,
    padding: 8,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 12,
  },
  formScroll: {
    maxHeight: 520,
  },
  label: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13.5,
    color: Colors.saffronRed, // Saffron Red for user entered fields
    fontWeight: '600',
    backgroundColor: '#FFFDF9',
  },
  gotraChip: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.borderGold,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginRight: 6,
  },
  gotraChipActive: {
    backgroundColor: Colors.saffronRed,
    borderColor: Colors.saffronRed,
  },
  gotraText: {
    fontSize: 11,
    color: Colors.textDark,
  },
  gotraTextActive: {
    color: Colors.pureWhite,
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  priceBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFDF9',
  },
  priceBtnActive: {
    backgroundColor: Colors.mandirRed,
    borderColor: Colors.mandirRed,
  },
  priceBtnText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  priceBtnTextActive: {
    color: Colors.mandirGoldLight,
  },
  submitBtn: {
    backgroundColor: Colors.saffronRed,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  submitBtnText: {
    color: Colors.pureWhite,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
