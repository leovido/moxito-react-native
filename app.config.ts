export default {
  expo: {
    name: 'Moxito',
    slug: 'moxito-fitness',
    entryPoint: './app/index.tsx',
    updates: {
      url: 'https://u.expo.dev/d7541886-e8a9-47c0-84fc-0685f72d524d',
    },
    plugins: ['expo-font', 'expo-router', 'expo-secure-store', 'expo-web-browser'],
    runtimeVersion: '1.0.0',
    extra: {
      eas: {
        projectId: 'd7541886-e8a9-47c0-84fc-0685f72d524d',
      },
    },
  },
};
