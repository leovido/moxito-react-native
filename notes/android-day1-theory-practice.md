# Android Day 1 — Theory & Practice (RN/Expo Bare)

## Theory (quick hits)
- Gradle layers:
  - `settings.gradle`: plugin management, version catalogs, include builds.
  - Root `build.gradle`: shared `ext` versions (SDK/NDK/buildTools/Kotlin), plugin classpaths, repositories.
  - App `build.gradle`: applies plugins, uses shared versions, defines namespace/appId, signing, build types, dependencies.
- AGP + toolchain:
  - AGP 8.x wants Java 17.
  - SDK alignment: compileSdk/targetSdk/buildTools should match RN’s catalog (RN 0.81 → 36 / 36.0.0).
  - NDK alignment: RN 0.81 expects NDK 27.1. libc++ there provides C++20 `std::format` needed by codegen/native modules.
- Kotlin/KSP:
  - Root Kotlin Gradle Plugin must match KSP versions used by expo-updates; we pin Kotlin to 2.1.20 so Expo picks the matching KSP.
- New Architecture:
  - Reanimated 4.x on RN 0.81 requires Fabric/TurboModules; enable via `newArchEnabled=true` in `gradle.properties`.
- Manifest & permissions:
  - Manifests merge (app + libraries); permissions live in `AndroidManifest.xml`. Conflicts resolved via `tools:node`.
- C++/NDK path:
  - CMake/Ninja build codegen/native libs; uses headers/libc++ from the configured NDK. Misaligned NDK → C++ compile errors.
- Tasks to know:
  - `:app:assembleDebug`, `:app:bundleRelease`, `:app:installDebug`, add `--stacktrace` for diagnostics.

## Practice (do-now checklist)
- Verify alignment (done in this repo):
  - `ext` in `android/build.gradle`: compileSdk/targetSdk=36, buildTools=36.0.0, minSdk=26, ndk=27.1.12297006, kotlin=2.1.20.
  - `newArchEnabled=true` in `android/gradle.properties`.
  - Java 17 active (`java -version`).
- Run and capture:
  - `./gradlew :app:assembleDebug --stacktrace | tee android/gradle-stacktrace.txt`
  - Optional deps view: `./gradlew :app:dependencies --configuration debugRuntimeClasspath | head -n 200`
- Manifest/permissions (prep for HealthConnect):
  - Open `android/app/src/main/AndroidManifest.xml`; plan to add `android.permission.health.READ_STEPS`, `READ_DISTANCE`, `READ_ACTIVE_CALORIES` when integrating.
- C++ sanity:
  - Ensure NDK 27.1.12297006 and SDK build-tools 36.0.0/platform 36 are installed via SDK Manager.

## Error drill (symptom → fix)
- KSP/Kotlin mismatch (`ChangedFiles not present`): pin Kotlin in root classpath; let Expo pick matching KSP.
- Reanimated assert (new arch): set `newArchEnabled=true`.
- std::format / folly C++ errors: align NDK/buildTools/compileSdk to RN catalog (NDK 27.1, SDK 36).
- Classpath/plugin not found: check repositories and pluginManagement; ensure versions match RN/Expo expectations.

