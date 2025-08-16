const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Get the workspace root directory
const workspaceRoot = path.resolve(__dirname, "../../");

// Ensure Metro looks in the current directory for the app
config.projectRoot = __dirname;

// Add the root workspace directory to watch folders for shared packages
config.watchFolders = [__dirname, workspaceRoot];

// Configure module resolution for workspace packages
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Add workspace package resolution
config.resolver.platforms = ["ios", "android", "native", "web"];
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

// Ensure workspace packages are resolved correctly
config.resolver.alias = {
  "@moxito/theme": path.resolve(workspaceRoot, "packages/theme/src/index.ts"),
  "@moxito/api": path.resolve(workspaceRoot, "packages/api/src/index.ts"),
  "@moxito/shared-types": path.resolve(
    workspaceRoot,
    "packages/shared-types/src/types.ts"
  ),
  // Add TypeScript path aliases
  "@/*": path.resolve(__dirname, "./*"),
};

module.exports = config;
