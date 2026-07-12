# Is That Real

AI-powered fact-checking assistant built with Expo, React Native, and DeepSeek API. Users enter a claim and the AI analyzes it for truthfulness.

## Tech Stack

- Expo SDK 56
- React Native 0.85.3
- React 19.2.3
- DeepSeek API
- React Navigation v7 (native-stack)
- expo-secure-store (encrypted API key storage)
- TypeScript

## Getting Started

```bash
npm install
npx expo start
```

## API Key

This app requires a DeepSeek API key. Enter it in the Settings screen within the app. The key is stored securely using `expo-secure-store`.

## Scripts

- `npm start` — Start Expo dev server
- `npm run android` — Start for Android
- `npm run ios` — Start for iOS
- `npm run web` — Start for web
- `npm test` — Run tests

## Project Structure

```
is-that-real/
  src/
    types/        # TypeScript type definitions
    theme/        # Color constants
    services/     # API and storage services
    screens/      # Screen components
    components/   # UI components
  __tests__/      # Test files
```
