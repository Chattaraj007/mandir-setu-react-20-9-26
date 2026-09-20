# 🪔 Mandir Setu • Universal Cross-Platform App (React Native, iOS, Android, Web & PostgreSQL)

Mandir Setu is a comprehensive, spiritual pilgrim platform for West Bengal's sacred temples (Kalighat, Dakshineswar, Tarapith, Belur Math, Mayapur ISKCON).

This repository is completely isolated and self-contained with:
- **Universal React Native (iOS, Android, and Web)** powered by Expo & React Native Web
- **Dynamic Node.js REST API Backend**
- **PostgreSQL 16 Database** with automatic migrations and seed data
- **Full Docker Containerization** (`docker-compose.yml`)

---

## 🚀 Quick Start in Docker (On your Laptop)

### 1. Run Everything with Docker Compose:
Open terminal in the `mandir-setu-crossplatform` folder:

```bash
docker-compose up --build
```

This starts 3 containers:
1. **`postgres`** on port `5432`: PostgreSQL 16 database with pre-seeded dummy records.
2. **`api`** on port `5000`: Dynamic authentication and booking backend.
3. **`web`** on port `3000`: React Native Universal Web dev server.

---

## 🌐 1. Test in the Web Browser
Once Docker is up, open your laptop browser:
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **API Status & Health**: [http://localhost:5000/health](http://localhost:5000/health)

You can interact with all temple listings, book pujas, make donations, chant Vedic mantras, view the Panjika, and log into any of the 4 pre-seeded accounts.

---

## 📱 2. Test on Mobile (iOS & Android via Expo Go)

You can instantly run and test this app on your physical iPhone or Android phone, or in your local Xcode / Android Studio Simulators:

### Method A: Local Development Server
1. In the `mobile-web` directory:
   ```bash
   cd mobile-web
   npm install
   npx expo start
   ```
2. **On Android**:
   - Install **Expo Go** from Google Play Store.
   - Scan the terminal QR code.
   - Or press `a` in the terminal to launch on the local Android Emulator.

3. **On iOS**:
   - Install **Expo Go** from Apple App Store.
   - Scan the QR code using your iPhone's standard Camera app.
   - Or press `i` in the terminal to launch on the local Xcode iOS Simulator.

---

## 📦 3. Prepare Standalone Builds (Android APK & iOS IPA)

This project uses EAS (Expo Application Services) / React Native Prebuild to generate standalone native installable packages:

### Android Build (APK / AAB):
```bash
cd mobile-web
# To build installable APK for Android:
npx eas build -p android --profile preview
```
Or generate the native Android Gradle project locally:
```bash
npx expo run:android
```

### iOS Build (IPA / Xcode Project):
```bash
cd mobile-web
# To build iOS IPA package:
npx eas build -p ios --profile preview
```
Or generate the native iOS Xcode project locally (macOS):
```bash
npx expo run:ios
```

---

## 🔐 Pre-Seeded Dynamic Login Accounts (PostgreSQL)

The database migration (`001_init.sql`) and seed script (`002_seed.sql`) automatically create these accounts:

| Role | Email | Password | Assigned Mandir / Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** 👑 | `admin@mandirsetu.gov.in` | `admin123` | All Temples & Global Bookings |
| **Temple Priest** 🪔 | `priest@kalighat.org` | `priest123` | Kalighat Kali Temple |
| **Trustee** 📜 | `trustee@tarapith.org` | `trustee123` | Tarapith Temple |
| **Devotee** 🙏 | `devotee@mandirsetu.org` | `omnamah108` | Personal Sankalp & Seva |

You can also use the **1-Click Quick Demo Switcher** directly in the Login Screen to test each role's distinct UI experience!

---

## 🗄️ Database Migrations

Located in `backend/migrations/`:
- `001_init.sql`: Creates `users`, `temples`, `puja_offerings`, `bookings`, and `donations` tables with constraints and indexes.
- `002_seed.sql`: Populates the 5 major West Bengal temples, puja offerings, and seed user accounts with hashed credentials.
