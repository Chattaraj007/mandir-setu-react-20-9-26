import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { Colors } from './src/theme/colors';
import Header from './src/components/Header';
import BottomNav from './src/components/BottomNav';
import GaneshSplash from './src/components/GaneshSplash';
import HomeScreen from './src/screens/HomeScreen';
import TemplesScreen from './src/screens/TemplesScreen';
import PanjikaScreen from './src/screens/PanjikaScreen';
import MantrasScreen from './src/screens/MantrasScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import BookingModal from './src/screens/BookingModal';
import DonationModal from './src/screens/DonationModal';

function MainApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('HOME');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedTempleForBooking, setSelectedTempleForBooking] = useState(null);
  const [activeDonationCause, setActiveDonationCause] = useState(null);

  if (showSplash) {
    return <GaneshSplash onFinish={() => setShowSplash(false)} />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'TEMPLES':
        return (
          <TemplesScreen
            onOpenBooking={(temple) => setSelectedTempleForBooking(temple)}
          />
        );
      case 'PANJIKA':
        return <PanjikaScreen />;
      case 'MANTRAS':
        return <MantrasScreen />;
      case 'DASHBOARD':
        return <DashboardScreen />;
      case 'HOME':
      default:
        return (
          <HomeScreen
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenBooking={(temple) => setSelectedTempleForBooking(temple)}
            onOpenDonation={(cause) => setActiveDonationCause(cause)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.mandirRedDark} />
      <View style={styles.appContainer}>
        {/* Sacred Header */}
        <Header onOpenLogin={() => setShowLoginModal(true)} />

        {/* Dynamic Screen Content */}
        <View style={styles.screenContainer}>
          {renderActiveScreen()}
        </View>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Login & Profile Modal */}
        {showLoginModal && (
          <View style={styles.fullModalOverlay}>
            <LoginScreen onClose={() => setShowLoginModal(false)} />
          </View>
        )}

        {/* Puja Booking Modal */}
        {selectedTempleForBooking && (
          <BookingModal
            temple={selectedTempleForBooking}
            onClose={() => setSelectedTempleForBooking(null)}
            onBookingSuccess={() => setActiveTab('DASHBOARD')}
          />
        )}

        {/* Donation & Chadhava Modal */}
        {activeDonationCause && (
          <DonationModal
            cause={activeDonationCause}
            onClose={() => setActiveDonationCause(null)}
            onDonationSuccess={() => setActiveTab('DASHBOARD')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.mandirRedDark,
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 520 : '100%', // Elegant phone frame constraint on desktop web
    backgroundColor: Colors.creamBackground,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  screenContainer: {
    flex: 1,
  },
  fullModalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.creamBackground,
    zIndex: 90,
  },
});
