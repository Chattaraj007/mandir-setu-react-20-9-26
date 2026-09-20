import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { apiRequest } from '../api/client';

export default function DashboardScreen() {
  const { user, token, isBn } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [priestName, setPriestName] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    const res = await apiRequest('/api/bookings', { token });
    if (res && res.success && res.data) {
      setBookings(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    const res = await apiRequest(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({
        status: newStatus,
        cancellationReason: newStatus === 'CANCELLED' ? cancelReason : null,
        assignedPriestName: priestName || user?.fullName
      })
    });

    if (res && res.success) {
      alert(`Booking ${newStatus.toLowerCase()} successfully!`);
      setSelectedBooking(null);
      setCancelReason('');
      setPriestName('');
      loadBookings();
    } else {
      alert(res?.message || 'Update failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return '#2E7D32';
      case 'COMPLETED':
        return '#1565C0';
      case 'CANCELLED':
        return '#C62828';
      default:
        return '#E65100';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Dashboard Top Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerRole}>
            {user?.role === 'SUPER_ADMIN'
              ? (isBn ? '👑 কেন্দ্রীয় অ্যাডমিন ড্যাশবোর্ড' : '👑 Central Admin Dashboard')
              : user?.role === 'PRIEST'
              ? (isBn ? '🪔 পুরোহিত সেবা প্যানেল' : '🪔 Priest Seva Panel')
              : user?.role === 'TRUSTEE'
              ? (isBn ? '📜 ট্রাস্টি নজরদারি প্যানেল' : '📜 Trustee Oversight Panel')
              : (isBn ? '🙏 ভক্তের পূজা ও সেবা তালিকা' : '🙏 Devotee Puja History')}
          </Text>
          <Text style={styles.headerUser}>
            {user?.fullName} ({user?.email})
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadBookings}>
          <Text style={styles.refreshText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Summary KPI Cards */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiNumber}>{bookings.length}</Text>
          <Text style={styles.kpiLabel}>{isBn ? 'মোট পূজা বুকিং' : 'Total Bookings'}</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={[styles.kpiNumber, { color: '#2E7D32' }]}>
            {bookings.filter((b) => b.booking_status === 'CONFIRMED').length}
          </Text>
          <Text style={styles.kpiLabel}>{isBn ? 'অনুমোদিত' : 'Confirmed'}</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={[styles.kpiNumber, { color: Colors.saffronRed }]}>
            ₹{bookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0)}
          </Text>
          <Text style={styles.kpiLabel}>{isBn ? 'পূজা দক্ষিণা' : 'Total Dakshina'}</Text>
        </View>
      </View>

      {/* Bookings List */}
      <Text style={styles.sectionTitle}>
        {isBn ? 'পূজা সংকল্প তালিকা (Realtime PostgreSQL)' : 'Live Puja Bookings (PostgreSQL)'}
      </Text>

      {loading ? (
        <ActivityIndicator color={Colors.mandirRed} style={{ marginTop: 24 }} />
      ) : bookings.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={{ fontSize: 32 }}>🪔</Text>
          <Text style={styles.emptyText}>
            {isBn ? 'কোনো বুকিং পাওয়া যায়নি।' : 'No bookings found yet.'}
          </Text>
        </View>
      ) : (
        bookings.map((item) => {
          const statusColor = getStatusColor(item.booking_status);
          const isActionable = user?.role === 'SUPER_ADMIN' || user?.role === 'PRIEST' || user?.role === 'TRUSTEE';

          return (
            <View key={item.id} style={styles.bookingCard}>
              <View style={styles.bookingCardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.templeName}>{isBn ? item.temple_name_bn : item.temple_name_en}</Text>
                  <Text style={styles.offeringTitle}>
                    {isBn ? (item.offering_title_bn || 'বিশেষ সংকল্প পূজা') : (item.offering_title_en || 'Special Puja')}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{item.booking_status}</Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>👤 {item.devotee_name} (গোত্র: {item.gotra})</Text>
                <Text style={styles.detailText}>📞 {item.devotee_phone}</Text>
                <Text style={styles.detailText}>📅 তারিখ: {item.puja_date?.split('T')[0]} ({item.tithi_time})</Text>
                {item.sankalp_wish && (
                  <Text style={styles.detailText}>✨ সংকল্প: {item.sankalp_wish}</Text>
                )}
                {item.assigned_priest_name && (
                  <Text style={[styles.detailText, { color: Colors.saffronRed, fontWeight: 'bold' }]}>
                    🪔 নিযুক্ত পুরোহিত: {item.assigned_priest_name}
                  </Text>
                )}
                <Text style={styles.amountText}>দক্ষিণা: ₹{item.total_amount}</Text>
              </View>

              {/* Status Action Buttons for Priest / Admin */}
              {isActionable && item.booking_status === 'PENDING' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: '#2E7D32' }]}
                    onPress={() => handleUpdateStatus(item.id, 'CONFIRMED')}
                  >
                    <Text style={styles.btnText}>অনুমোদন করুন (Confirm)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: Colors.crimson }]}
                    onPress={() => setSelectedBooking(item)}
                  >
                    <Text style={styles.btnText}>বাতিল করুন (Cancel)</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Cancellation Reason Modal inline */}
              {selectedBooking?.id === item.id && (
                <View style={styles.cancelBox}>
                  <Text style={styles.cancelLabel}>বাতিলের কারণ লিখুন:</Text>
                  <TextInput
                    style={styles.cancelInput}
                    value={cancelReason}
                    onChangeText={setCancelReason}
                    placeholder="e.g. অমাবস্যার বিশেষ তিথিতে সময় পরিবর্তন..."
                  />
                  <TouchableOpacity
                    style={styles.confirmCancelBtn}
                    onPress={() => handleUpdateStatus(item.id, 'CANCELLED')}
                  >
                    <Text style={styles.confirmCancelText}>বাতিল নিশ্চিত করুন</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })
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
  header: {
    backgroundColor: Colors.mandirRed,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.mandirGold,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerRole: {
    color: Colors.pureWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerUser: {
    color: Colors.mandirGoldLight,
    fontSize: 12,
    marginTop: 2,
  },
  refreshBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 8,
  },
  refreshText: {
    fontSize: 16,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Colors.pureWhite,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  kpiNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  kpiLabel: {
    fontSize: 10.5,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
    marginBottom: 12,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: Colors.textMuted,
    marginTop: 8,
    fontSize: 13,
  },
  bookingCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    marginBottom: 12,
  },
  bookingCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  templeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.mandirRedDark,
  },
  offeringTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    color: Colors.pureWhite,
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsRow: {
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 8,
    gap: 3,
  },
  detailText: {
    fontSize: 11.5,
    color: Colors.textDark,
  },
  amountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.saffronRed,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: Colors.pureWhite,
    fontSize: 11.5,
    fontWeight: 'bold',
  },
  cancelBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  cancelLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.crimson,
    marginBottom: 4,
  },
  cancelInput: {
    backgroundColor: Colors.pureWhite,
    borderWidth: 1,
    borderColor: Colors.crimson,
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
    color: Colors.saffronRed, // Saffron Red font
    fontWeight: '600',
  },
  confirmCancelBtn: {
    backgroundColor: Colors.crimson,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 6,
    alignItems: 'center',
  },
  confirmCancelText: {
    color: Colors.pureWhite,
    fontSize: 11,
    fontWeight: 'bold',
  },
});
