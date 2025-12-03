const mockSettingsManager = {
  get: jest.fn(),
  set: jest.fn(),
  watchKeys: jest.fn(),
  clearWatch: jest.fn(),
  getConstants: jest.fn(() => ({})),
  _getConstants: jest.fn(() => ({})),
};

jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => mockSettingsManager);

const ReactNative = require('react-native');

ReactNative.NativeModules.SettingsManager = mockSettingsManager;

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
