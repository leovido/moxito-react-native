// AuthContext.tsx
import { createContext, useContext, useState } from "react";
import * as WebBrowser from "expo-web-browser";

interface AuthContextType {
	isAuthenticated: boolean;
	url: string | null;
	authError: string | null;
	startLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [url, setUrl] = useState<string | null>(null);
	const [authError, setAuthError] = useState<string | null>(null);

	const startLogin = async () => {
		try {
			const authURL = "https://app.moxito.xyz";
			const result = await WebBrowser.openAuthSessionAsync(
				authURL,
				"moxito://", // your callback scheme
			);

			if (result.type === "success" && result.url) {
				setUrl(result.url);
				setIsAuthenticated(true);
			} else {
				// Handle cancellation or other non-success cases
				setAuthError("Authentication was cancelled or failed");
			}
		} catch (error) {
			// Log error to Sentry
			Sentry.Native.captureException(error);
			setAuthError(
				error instanceof Error ? error.message : "Authentication failed",
			);
		}
	};

	const value = {
		isAuthenticated,
		url,
		authError,
		startLogin,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
