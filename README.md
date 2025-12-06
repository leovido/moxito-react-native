# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Code Quality with Biome

This project uses [Biome](https://biomejs.dev/) for code quality, formatting, and linting. Biome is a fast, modern alternative to ESLint + Prettier that provides:

- **Unified tooling**: Combines linting, formatting, and import organization
- **Performance**: 10-100x faster than ESLint + Prettier
- **Zero configuration**: Works out of the box with sensible defaults
- **TypeScript support**: Excellent support for TypeScript and React Native
- **Modern standards**: Built with Rust for optimal performance

### Biome Commands

```bash
# Check code quality (linting + formatting)
yarn check

# Fix auto-fixable issues
yarn check:fix

# Fix all issues (including unsafe fixes)
yarn check:fix:unsafe

# Format code only
yarn format

# Check formatting without changing files
yarn format:check

# Lint only
yarn lint

# Fix linting issues
yarn lint:fix
```

### Why Biome over ESLint + Prettier?

1. **Speed**: Biome processes files much faster than traditional tools
2. **Unified**: Single tool instead of managing multiple configurations
3. **Modern**: Built for modern JavaScript/TypeScript projects
4. **React Native optimized**: Excellent support for React Native patterns
5. **Zero config**: Works immediately without complex setup

## Get started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Install the Git hooks

   ```bash
   npx lefthook install
   ```

3. Start the app

   ```bash
   yarn start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Health Connect Integration

This app integrates with Android Health Connect and iOS HealthKit to display health and fitness data.

### Android Health Connect Setup

1. **Install Health Connect**: Ensure Health Connect is installed on your Android device (API 28+). You can install it from the [Google Play Store](https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata).

2. **Grant Permissions**: When you first open the Fitness tab, the app will request Health Connect permissions. You can also grant permissions by:
   - Opening the Health Connect app
   - Going to "Apps and devices"
   - Finding "Moxito" and granting the required permissions

3. **Required Permissions**: The app requests read access to:
   - Steps
   - Distance
   - Heart Rate

4. **Play Console Declaration**: Before publishing to Google Play, you must declare Health Connect data types in the Play Console:
   - Go to your app's Play Console
   - Navigate to "Policy" → "App content" → "Health Connect data types"
   - Declare all data types your app reads/writes
   - See [Health Connect documentation](https://developer.android.com/health-and-fitness/health-connect/get-started) for details

### iOS HealthKit Setup

1. **Enable HealthKit**: HealthKit is available on iOS devices by default.

2. **Grant Permissions**: When you first open the Fitness tab, iOS will prompt you to grant HealthKit permissions.

3. **Required Capabilities**: The app requests read access to:
   - Steps
   - Distance
   - Heart Rate

### Testing Health Connect

To test the Health Connect integration:

1. **Health Connect Toolbox**: Use the [Health Connect Toolbox](https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata.toolbox) app to insert test data.

2. **Manual Testing**:
   - Open the Fitness tab
   - Verify that steps, distance, and heart rate data are displayed
   - Check that the date is correctly formatted
   - Verify the source label shows "Health Connect" on Android or "Apple Health" on iOS

3. **Permission Testing**:
   - Revoke permissions in Health Connect/HealthKit settings
   - Reopen the Fitness tab
   - Verify that the app handles permission denial gracefully
   - Re-grant permissions and verify data syncs correctly

## Get a fresh project

When you're ready, run:

```bash
yarn reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
