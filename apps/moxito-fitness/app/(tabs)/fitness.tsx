import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Platform,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@moxito/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { setFilterSelection } from "@/moxieSlice";
import { StatsCard } from "@/components/StatsCard";
import { EarningsCard } from "@/components/EarningsCard";
import { moxieApi } from "@moxito/api";
import { healthKitService } from "@/components/HealthKitService";

export default function FitnessScreen() {
  const [username, setUsername] = useState<string>("Moxie");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const filterSelection = useSelector(
    (state: RootState) => state.moxie.filterSelection,
  );

  const {
    data: stats,
    isLoading,
    error,
  } = moxieApi.endpoints.getMoxieStats.useQuery({
    fid: 203666,
    filter: "TODAY",
  });

  const {
    data: stepCount,
    isLoading: stepCountLoading,
    error: stepCountError,
  } = healthKitService.getStepCount(
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(23, 59, 59, 999)),
  );

  useEffect(() => {
    setUsername(stats?.socials[0].profileDisplayName || "Moxie");
    setProfileImage(stats?.socials[0].profileImage || null);
  }, [stats]);

  useEffect(() => {
    console.log(stepCount, "stepcount");
  }, [stepCount]);

  // const { data: points, isLoading, error } = moxitoService.endpoints.getAllCheckinsByUser.useQuery({
  //   fid: 203666,
  //   startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
  //   endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
  // });

  return (
    <ImageBackground
      source={require("../../assets/images/app-bg2.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={"dark-content"} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              <Text
                style={[styles.greetingLight, { fontFamily: "Lato_300Light" }]}
              >
                Hi,{" "}
              </Text>
              <Text
                style={[styles.greetingBold, { fontFamily: "Lato_700Bold" }]}
              >
                {username}
              </Text>
            </Text>
            <Text
              style={[
                styles.lastUpdate,
                {
                  fontFamily: Platform.select({
                    android: "Lato_300Light",
                    ios: "Lato-Light",
                  }),
                },
              ]}
            >
              Last update: 8h ago
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <Pressable
              style={styles.settingsIconContainer}
              onPress={() => {
                router.push("/(auth)");
              }}
            >
              <Image
                source={require("../../assets/images/icon-settings.png")}
                style={styles.settingsIcon}
              />
            </Pressable>
            <Pressable
              style={styles.profileIcon}
              onPress={() => {
                console.log("profile");
              }}
            >
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/images/icon-profile.png")
                }
                style={styles.profileIcon}
                resizeMode="cover"
              />
            </Pressable>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Moxie Banner */}
          <LinearGradient
            colors={[theme.colors.primary[100], "#BC99FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.moxieBanner}
          >
            <Text style={styles.moxieText}>
              You are earning points while running!
            </Text>
          </LinearGradient>

          {/* Earnings Card */}
          <EarningsCard />

          {/* Stats */}
          <View style={styles.statsContainer}>
            <StatsCard label="Steps today" value="6733" unit="10k" />
            <View
              style={{
                borderBottomColor: theme.colors.black[16],
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
            <StatsCard label="Calories burned" value="2112" unit="kcal" />
            <View
              style={{
                borderBottomColor: theme.colors.black[16],
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
            <StatsCard label="Distance traveled" value="23" unit="kcal" />
            <View
              style={{
                borderBottomColor: theme.colors.black[16],
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
            <StatsCard label="Resting Heart Rate" value="80" unit="bpm" />

            {/* Time Filter */}
            <View style={styles.timeFilter}>
              <TouchableOpacity
                style={[
                  styles.inactiveTimeFilter,
                  filterSelection === 0 && styles.activeTimeFilter,
                ]}
                onPress={() => dispatch(setFilterSelection(0))}
              >
                <Text style={styles.timeFilterText}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.inactiveTimeFilter,
                  filterSelection === 1 && styles.activeTimeFilter,
                ]}
                onPress={() => dispatch(setFilterSelection(1))}
              >
                <Text style={styles.timeFilterText}>Weekly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.inactiveTimeFilter,
                  filterSelection === 2 && styles.activeTimeFilter,
                ]}
                onPress={() => dispatch(setFilterSelection(2))}
              >
                <Text style={styles.timeFilterText}>Month</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary[10],
    padding: theme.spacing[4],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing[4],
  },
  greeting: {
    fontSize: theme.fontSizes["2xl"],
    color: theme.colors.black[100],
  },
  greetingLight: {
    fontWeight: theme.fontWeights.light,
  },
  greetingBold: {
    fontWeight: theme.fontWeights.black,
  },
  lastUpdate: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.black[100],
  },
  headerIcons: {
    flexDirection: "row",
    gap: theme.spacing[2],
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.white[100],
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  profileIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.primary[100],
    borderRadius: 20,
  },
  moxieBanner: {
    padding: theme.spacing[4],
    borderRadius: 24,
    marginBottom: theme.spacing[4],
  },
  moxieText: {
    color: theme.colors.white[100],
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
    fontFamily: "Lato_400Regular",
  },
  statsContainer: {
    backgroundColor: theme.colors.white[100],
    borderRadius: 16,
    padding: theme.spacing[4],
    gap: theme.spacing[4],
  },
  timeFilter: {
    flexDirection: "row",
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
  },
  activeTimeFilter: {
    backgroundColor: theme.colors.black[100],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: 24,
  },
  inactiveTimeFilter: {
    backgroundColor: theme.colors.black[8],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: 24,
  },
  timeFilterText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.white[100],
  },
  statsIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
