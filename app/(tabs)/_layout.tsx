import { usePrivy } from '@privy-io/expo';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import CustomTabBar from '../../components/CustomTabBar';
import { HeaderBanner } from '../../components/HeaderBanner';

function TabsWithHeader() {
  const { user } = usePrivy();
  const router = useRouter();
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState('Never');

  // Initialize last update time
  useEffect(() => {
    setLastUpdateTime(Date.now());
  }, []);

  // Update last update time display
  useEffect(() => {
    if (!lastUpdateTime) {
      return;
    }

    const updateTime = () => {
      const secondsAgo = Math.floor((Date.now() - lastUpdateTime) / 1000);
      if (secondsAgo < 60) {
        setLastUpdate(`${secondsAgo} ${secondsAgo === 1 ? 'second' : 'seconds'} ago`);
      } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        setLastUpdate(`${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`);
      } else {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        setLastUpdate(`${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lastUpdateTime]);

  // Get user's display name from Privy
  const getUserName = () => {
    if (!user) {
      return 'Moxito';
    }

    // Try to get Farcaster username first
    const farcasterAccount = user.linked_accounts?.find(
      (account: { type: string }) => account.type === 'farcaster'
    );

    if (farcasterAccount && farcasterAccount.type === 'farcaster' && farcasterAccount.username) {
      return farcasterAccount.username;
    }

    // Fallback to display name if available
    if (
      farcasterAccount &&
      farcasterAccount.type === 'farcaster' &&
      farcasterAccount.display_name
    ) {
      return farcasterAccount.display_name;
    }

    // Fallback to wallet address
    const wallet = user.linked_accounts?.find(
      (account: { type: string }) => account.type === 'wallet'
    );
    if (wallet && 'address' in wallet && typeof wallet.address === 'string') {
      return `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;
    }

    return 'Moxito';
  };

  const handleClaim = () => {
    console.log('Claim button pressed');
    // Add your claim logic here
  };

  const handleSettings = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBanner
        greeting={`Hello, ${getUserName()}`}
        lastUpdate={`Last update: ${lastUpdate}`}
        onClaim={handleClaim}
        onSettings={handleSettings}
      />
      <Tabs
        tabBar={(props) => (
          <CustomTabBar {...(props as unknown as Parameters<typeof CustomTabBar>[0])} />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarAccessibilityLabel: 'Home tab',
          }}
        />
        <Tabs.Screen
          name="fitness"
          options={{
            title: 'Fitness',
            tabBarAccessibilityLabel: 'Fitness tab',
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            title: 'Workout',
            tabBarAccessibilityLabel: 'Workout tab',
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarAccessibilityLabel: 'Search tab',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarAccessibilityLabel: 'Profile tab',
          }}
        />
      </Tabs>
    </View>
  );
}

export default function TabLayout() {
  return <TabsWithHeader />;
}
