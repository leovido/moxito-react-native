import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthProvider } from "./(auth)/AuthProvider";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		Lato_400Regular: require("../assets/fonts/Lato_400Regular.ttf"),
		Lato_300Light: require("../assets/fonts/Lato_300Light.ttf"),
		Lato_700Bold: require("../assets/fonts/Lato_700Bold.ttf"),
		Lato_900Black: require("../assets/fonts/Lato_900Black.ttf"),
		Lato_100Thin: require("../assets/fonts/Lato_100Thin.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	return (
		<Provider store={store}>
			<ThemeProvider value={DarkTheme}>
				<AuthProvider>
					<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
					<Stack>
						<Stack.Screen
							name="(auth)/index"
							options={{
								headerShown: false,
								headerBackVisible: false,
								gestureEnabled: false,
							}}
						/>
						<Stack.Screen
							name="(tabs)"
							options={{
								headerShown: false,
							}}
						/>
					</Stack>
				</AuthProvider>
			</ThemeProvider>
		</Provider>
	);
}
