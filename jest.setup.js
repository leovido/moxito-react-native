// Mock React Native before any imports
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    SafeAreaView: ({ children, ...props }) => <RN.View {...props}>{children}</RN.View>,
    NativeModules: {
      ...RN.NativeModules,
      SettingsManager: {
        get: jest.fn(),
        set: jest.fn(),
        watchKeys: jest.fn(),
        clearWatch: jest.fn(),
        _getConstants: jest.fn(() => ({})),
      },
    },
    TurboModuleRegistry: {
      getEnforcing: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        watchKeys: jest.fn(),
        clearWatch: jest.fn(),
        _getConstants: jest.fn(() => ({})),
      })),
    },
  };
});

// Mock global functions
global.clearInterval = jest.fn();
global.setInterval = jest.fn();

// Suppress console warnings for cleaner test output
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ProgressBarAndroid') ||
      args[0].includes('Clipboard') ||
      args[0].includes('PushNotificationIOS') ||
      args[0].includes('NativeEventEmitter'))
  ) {
    return;
  }
  originalWarn(...args);
};
