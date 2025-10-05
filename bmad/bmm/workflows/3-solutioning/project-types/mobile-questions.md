# Mobile Project Architecture Questions

## Platform

1. **Target platforms:**
   - iOS only
   - Android only
   - Both iOS + Android

2. **Framework choice:**
   - React Native (JavaScript/TypeScript, large ecosystem)
   - Flutter (Dart, high performance, beautiful UI)
   - Native (Swift for iOS, Kotlin for Android)
   - Expo (React Native with managed workflow)
   - Other: **\_\_\_**

3. **If React Native - workflow:**
   - Expo (managed, easier, some limitations)
   - React Native CLI (bare workflow, full control)

## Backend and Data

4. **Backend approach:**
   - Firebase (BaaS, real-time, easy)
   - Supabase (BaaS, PostgreSQL, open-source)
   - Custom API (REST/GraphQL)
   - AWS Amplify
   - Other BaaS: **\_\_\_**

5. **Local data persistence:**
   - AsyncStorage (simple key-value)
   - SQLite (relational, offline-first)
   - Realm (NoSQL, sync)
   - WatermelonDB (reactive, performance)
   - MMKV (fast key-value)

6. **State management:**
   - Redux Toolkit
   - Zustand
   - MobX
   - Context API + useReducer
   - Jotai/Recoil
   - React Query (server state)

## Navigation

7. **Navigation library:**
   - React Navigation (standard for RN)
   - Expo Router (file-based)
   - React Native Navigation (native navigation)

## Authentication

8. **Auth approach:**
   - Firebase Auth
   - Supabase Auth
   - Auth0
   - Social auth (Google, Apple, Facebook)
   - Custom
   - None

## Push Notifications

9. **Push notifications:** (if needed)
   - Firebase Cloud Messaging
   - Expo Notifications
   - OneSignal
   - AWS SNS
   - None needed

## Payments (if applicable)

10. **In-app purchases:**
    - RevenueCat (cross-platform, subscriptions)
    - expo-in-app-purchases
    - react-native-iap
    - Stripe (external payments)
    - None needed

## Additional

11. **Maps integration:** (if needed)
    - Google Maps
    - Apple Maps
    - Mapbox
    - None needed

12. **Analytics:**
    - Firebase Analytics
    - Amplitude
    - Mixpanel
    - PostHog
    - None needed

13. **Crash reporting:**
    - Sentry
    - Firebase Crashlytics
    - Bugsnag
    - None needed

14. **Offline-first requirement:**
    - Yes (sync when online)
    - No (online-only)
    - Partial (some features offline)

15. **App distribution:**
    - App Store + Google Play (public)
    - TestFlight + Internal Testing (beta)
    - Enterprise distribution
    - Expo EAS Build
