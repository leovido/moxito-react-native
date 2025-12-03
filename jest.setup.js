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

if (typeof globalThis.setImmediate === 'undefined') {
  globalThis.setImmediate = (callback, ...args) => {
    return setTimeout(callback, 0, ...args);
  };
}

if (typeof globalThis.clearImmediate === 'undefined') {
  globalThis.clearImmediate = (handle) => {
    clearTimeout(handle);
  };
}

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
