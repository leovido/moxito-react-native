const _React = require('react');

if (!process.env.EXPO_OS) {
  process.env.EXPO_OS = 'ios';
}

// Mock TurboModuleRegistry before React Native initializes
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const mockModule = {
    get: jest.fn(),
    set: jest.fn(),
    watchKeys: jest.fn(),
    clearWatch: jest.fn(),
    getConstants: jest.fn(() => ({
      Dimensions: {
        window: {
          width: 375,
          height: 667,
          scale: 2,
          fontScale: 2,
        },
        screen: {
          width: 375,
          height: 667,
          scale: 2,
          fontScale: 2,
        },
      },
    })),
    _getConstants: jest.fn(() => ({})),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    playTouchSound: jest.fn(),
  };

  return {
    get: jest.fn(() => mockModule),
    getEnforcing: jest.fn(() => mockModule),
  };
});

const ReactNative = require('react-native');

ReactNative.SafeAreaView = ({ children, ...props }) => (
  <ReactNative.View {...props}>{children}</ReactNative.View>
);

ReactNative.NativeModules.SettingsManager = {
  ...(ReactNative.NativeModules.SettingsManager ?? {}),
  get: jest.fn(),
  set: jest.fn(),
  watchKeys: jest.fn(),
  clearWatch: jest.fn(),
  _getConstants: jest.fn(() => ({})),
};

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
