const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const config = getDefaultConfig(__dirname);

// Ensure Metro looks in the current directory for the app
config.projectRoot = __dirname;

// Add the packages directory to watch folders for shared packages
config.watchFolders = [__dirname, path.resolve(__dirname, 'packages')];

// Configure module resolution for workspace packages
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// Add workspace package resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Ensure workspace packages are resolved correctly
config.resolver.alias = {
  '@moxito/theme': path.resolve(__dirname, 'packages/theme/src/index.ts'),
  '@moxito/api': path.resolve(__dirname, 'packages/api/src/index.ts'),
  '@moxito/shared-types': path.resolve(__dirname, 'packages/shared-types/src/types.ts'),
  // Add TypeScript path aliases
  '@/*': path.resolve(__dirname, './*'),
};

const resolveRequestWithPackageExports = (context, moduleName, platform) => {
  // Package exports in `isows` (a `viem`) dependency are incompatible, so they need to be disabled
  if (moduleName === 'isows') {
    const ctx = {
      ...context,
      unstable_enablePackageExports: false,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Package exports in `zustand@4` are incompatible, so they need to be disabled
  if (moduleName.startsWith('zustand')) {
    const ctx = {
      ...context,
      unstable_enablePackageExports: false,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Package exports in `jose` are incompatible, so the browser version is used
  if (moduleName === 'jose') {
    const ctx = {
      ...context,
      unstable_conditionNames: ['browser'],
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // The following block is only needed if you are
  // running React Native 0.78 *or older*.
  if (moduleName.startsWith('@privy-io/')) {
    const ctx = {
      ...context,
      unstable_enablePackageExports: true,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.resolveRequest = resolveRequestWithPackageExports;

module.exports = config;
