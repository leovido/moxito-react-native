# Android Build Learnings (Day 1)

## What blocked the build
- Kotlin/KSP mismatch: expo-updates pulled KSP 1.9.25 but Kotlin resolved to 2.1.20 → crash (`ChangedFiles not present`).
- New Architecture off: Reanimated 4.x + RN 0.81 requires `newArchEnabled=true`.
- Toolchain misalignments: older SDK/NDK/build-tools/libc++ caused C++20/std::format failures in safe-area-context codegen.
- Java version: AGP 8.x expects Java 17; higher or lower can cause edge failures.

## Fixes applied
- Pin shared versions in `android/build.gradle` ext to match RN 0.81 catalog:
  - `compileSdk/targetSdk = 36`, `buildTools = 36.0.0`, `minSdk = 24`
  - `kotlinVersion = 2.1.20`
  - `ndkVersion = 27.1.12297006`
- Set `newArchEnabled=true` in `android/gradle.properties`.
- Use Java 17 (`JAVA_HOME` and `java -version`).
- Clean after upgrades: `cd android && ./gradlew clean`.

## Current working build flow
1) Root gradle sets ext versions + plugin classpaths (AGP, RN, Kotlin).
2) App module consumes ext for SDK/NDK/buildTools; new architecture enabled.
3) Expo/RN plugins run (expo-updates picks matching KSP for Kotlin 2.1.20).
4) C++/CMake/Ninja compile codegen with NDK 27.1 libc++ (std::format available).
5) Assemble succeeds on Java 17.

## How to capture stacktraces
- Save to file: `./gradlew :app:assembleDebug --stacktrace > android/gradle-stacktrace.txt 2>&1`
- Live + save: `./gradlew :app:assembleDebug --stacktrace | tee android/gradle-stacktrace.txt`

## Checklist for new machines/CI
- Java 17 available and selected.
- Android SDK platform 36 + build-tools 36.0.0 installed.
- NDK 27.1.12297006 installed.
- `newArchEnabled=true`.
- Root `ext` versions match RN catalog; Kotlin pinned.

