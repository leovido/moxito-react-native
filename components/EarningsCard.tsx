import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@moxito/theme";

export const EarningsCard = () => (
  <LinearGradient
    colors={["#1D1D1D", "#3D3D3D"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.earningsCard}
  >
    <Image
      source={require("../assets/images/icon-run-move.png")}
      style={[styles.moxieCoin, { width: "40%", height: "100%" }]}
    />

    <View style={styles.earningsContent}>
      <Text style={[styles.earningsLabel, { fontFamily: "Lato_300Light" }]}>
        Earned from steps
      </Text>
      <Text style={styles.earningsValue}>859</Text>
      <Text style={styles.earningsSubtext}>~$ 1.23</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  earningsCard: {
    flex: 1,
    backgroundColor: theme.colors.black[100],
    borderRadius: 24,
    padding: theme.spacing[7],
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: theme.spacing[4],
    gap: theme.spacing[4],
  },
  moxieCoin: {
    marginRight: theme.spacing[4],
  },
  earningsContent: {
    flex: 1,
  },
  earningsLabel: {
    color: theme.colors.white[100],
    fontSize: theme.fontSizes.sm,
  },
  earningsValue: {
    color: theme.colors.white[100],
    fontSize: 54,
    fontWeight: theme.fontWeights.bold,
    fontFamily: "Lato_700Bold",
  },
  earningsSubtext: {
    color: theme.colors.white[50],
    fontSize: 20,
    fontFamily: "Lato_300Light",
  },
}); 