---
id: expo-mobile
label: Expo (React Native)
stack: Expo SDK, expo-router, TypeScript
best_for: iOS/Android mobile apps, with web preview during development
requires: [node, npx, git]
scaffold: npx --yes create-expo-app@latest {target}
verify_build: ""
verify_dev: npx expo start
verify_url: http://localhost:8081
---

# Expo

## Environment

No credentials needed to start. Service keys added later use Expo's env convention — `EXPO_PUBLIC_` prefix for client-visible values (see <https://docs.expo.dev/guides/environment-variables/>). Record that convention in the handoff so planning does not invent another one.

## Bootstrap

1. Nothing required — the default template boots as-is.
2. Tell the user their preview options: the Expo Go app on a device, or an iOS/Android simulator via the dev-server keyboard shortcuts.

## Agent Notes

- Navigation is file-based via `expo-router` under `app/` — screens are files, not manually registered routes.
- Prefer Expo SDK modules (`expo-camera`, `expo-location`, ...) over bare React Native community packages; they survive upgrades through `npx expo install`, which also pins compatible versions.
- There is no meaningful production "build" locally — release builds go through EAS (`eas build`), which is an account-gated later decision for `bmad-architecture`, not ignition.
