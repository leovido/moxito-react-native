export default {
  expo: {
    name: "Moxito",
    slug: "moxito-fitness",
    scheme: "moxito",
    entryPoint: ".apps/moxito-fitness/app/index.tsx",
    plugins: ["expo-font", "expo-router"],
    ios: {
      bundleIdentifier: "com.christianleovido.Moxito",
      buildNumber: "2",
      version: "1.1.0",
      infoPlist: {
        NSHealthShareUsageDescription:
          "We need access to your health data to track your fitness progress",
        NSHealthUpdateUsageDescription:
          "We need permission to update your health data",
      },
      entitlements: {
        "com.apple.developer.healthkit": true,
        "com.apple.developer.healthkit.access": ["health-records"],
      },
    },
    android: {
      package: "com.christianleovido.Moxito",
    },
    updates: {
      url: "https://u.expo.dev/d7541886-e8a9-47c0-84fc-0685f72d524d",
    },
    runtimeVersion: "1.0.0",
    extra: {
      eas: {
        projectId: "d7541886-e8a9-47c0-84fc-0685f72d524d",
      },
    },
  },
};
