import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@moxito/theme";
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";

export default function AuthScreen() {
	const router = useRouter();
	const { startLogin, isAuthenticated, authError } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			router.replace("/(tabs)/fitness");
		}
	}, [isAuthenticated, router]);

	const handleLogin = () => {
		startLogin();
	};

	return (
		<>
			<Image
				source={require("../../assets/images/login.png")}
				style={styles.backgroundImage}
			/>
			<View style={styles.container}>
				<View style={styles.content}>
					<Text style={styles.title}>Sign in to Moxito with Farcaster</Text>
					{authError && <Text style={styles.errorText}>{authError}</Text>}
					<Text style={styles.subtitle}>
						Sign in to the apps to display your profile or skip this step.
					</Text>
					<Pressable style={styles.signInButton} onPress={handleLogin}>
						<Text style={styles.signInButtonText}>Sign in</Text>
					</Pressable>
					<Pressable 
						style={styles.skipButton} 
						onPress={() => router.replace("/(tabs)/fitness")}
					>
						<Text style={styles.skipButtonText}>Skip this step</Text>
					</Pressable>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	backgroundImage: {
		position: "absolute",
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	content: {
		width: "100%",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.7)",
		padding: 20,
		borderRadius: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.white[100],
		marginBottom: 10,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 16,
		color: colors.white[100],
		marginBottom: 20,
		textAlign: "center",
	},
	errorText: {
		color: colors.error,
		marginBottom: 10,
	},
	signInButton: {
		backgroundColor: colors.primary[100],
		paddingHorizontal: 30,
		paddingVertical: 15,
		borderRadius: 25,
		width: "100%",
		alignItems: "center",
		marginBottom: 10,
	},
	signInButtonText: {
		color: colors.white[100],
		fontSize: 18,
		fontWeight: "600",
	},
	skipButton: {
		paddingVertical: 15,
	},
	skipButtonText: {
		color: colors.white[100],
		fontSize: 16,
	},
});
